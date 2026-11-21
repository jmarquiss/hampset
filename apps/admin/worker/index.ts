import type { BatchItem } from 'drizzle-orm/batch';

import { getDb, memberStatus, schema, statusIs, type DB, type MemberStatus } from '@club/db';
import { and, asc, desc, eq, or, sql, type SQL } from 'drizzle-orm';
import { Hono, type Context } from 'hono';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { secureHeaders } from 'hono/secure-headers';

import type { AdminEnv } from './env';

import { requireAccess } from './access';

const { auditLog, user } = schema;

/**
 * What an admin can do to a member: the statuses it's allowed from, and the change. Rejecting a
 * sign-up is `disable`, so the person can't simply sign up again; `delete` is only for disabled
 * users and cascades to their sessions and linked Google account.
 */
const actions: Record<
  schema.AuditAction,
  { from: MemberStatus[]; run: (db: DB, where: SQL) => BatchItem<'sqlite'> }
> = {
  approve: {
    from: ['pending'],
    run: (db, where) =>
      db.update(user).set({ approvedAt: new Date() }).where(where).returning({ id: user.id }),
  },
  delete: {
    from: ['disabled'],
    run: (db, where) => db.delete(user).where(where).returning({ id: user.id }),
  },
  disable: {
    from: ['pending', 'active'],
    run: (db, where) =>
      db.update(user).set({ disabledAt: new Date() }).where(where).returning({ id: user.id }),
  },
  enable: {
    from: ['disabled'],
    run: (db, where) =>
      db.update(user).set({ disabledAt: null }).where(where).returning({ id: user.id }),
  },
};

export const app = new Hono<AdminEnv>().basePath('/api');

app.use(secureHeaders(), requireAccess, csrf());

/**
 * Applies `action` to the member in the `:id` route param and records it in the audit log.
 * Both writes are conditional on the member's current status and run in one batch, which D1
 * executes as a single transaction, so a concurrent change can't leave an audit row for an action
 * that didn't happen. Responds 404 for an unknown member, or 409 if the action doesn't apply to
 * their status.
 */
async function act(c: Context<AdminEnv>, action: schema.AuditAction) {
  const db = getDb(c.env.DB);
  const id = c.req.param('id') ?? '';
  const { from, run } = actions[action];
  const target = and(eq(user.id, id), or(...from.map(statusIs))) ?? sql`0`;
  // The audit insert runs first, while the member still matches `target`.
  const results: unknown[] = await db.batch([
    // Drizzle's insert-select needs every column in table order; NULL lets SQLite assign the id.
    db.insert(auditLog).select(
      db
        /* eslint-disable perfectionist/sort-objects -- must match the table's column order */
        .select({
          id: sql<number>`null`.as('id'),
          actorEmail: sql<string>`${c.var.adminEmail}`.as('actor_email'),
          action: sql<schema.AuditAction>`${action}`.as('action'),
          targetUserId: user.id,
          targetEmail: user.email,
          createdAt: sql<Date>`${Date.now()}`.as('created_at'),
        })
        /* eslint-enable perfectionist/sort-objects */
        .from(user)
        .where(target),
    ),
    run(db, target),
  ]);
  const changed = results[1] as unknown[];
  if (changed.length > 0) return c.body(null, 204);

  const member = await db.query.user.findFirst({ where: eq(user.id, id) });
  if (!member) return c.json({ error: 'Member not found' }, 404);
  return c.json({ error: `That member is ${memberStatus(member)}; refresh and try again.` }, 409);
}

app.get('/members', async (c) => {
  const users = await getDb(c.env.DB).query.user.findMany({
    columns: {
      approvedAt: true,
      createdAt: true,
      disabledAt: true,
      email: true,
      id: true,
      name: true,
    },
    orderBy: asc(user.createdAt),
  });
  return c.json(
    users.map(({ approvedAt, disabledAt, ...rest }) => ({
      ...rest,
      status: memberStatus({ approvedAt, disabledAt }),
    })),
  );
});

app.post('/members/:id/:action{approve|disable|enable}', (c) =>
  act(c, c.req.param('action') as 'approve' | 'disable' | 'enable'),
);
app.delete('/members/:id', (c) => act(c, 'delete'));

app.get('/audit', async (c) => {
  const entries = await getDb(c.env.DB).query.auditLog.findMany({
    limit: 50,
    orderBy: desc(schema.auditLog.id),
  });
  return c.json(entries);
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message || 'Request refused' }, err.status);
  }
  console.error(err);
  return c.json({ error: 'Something went wrong' }, 500);
});

export default app;
