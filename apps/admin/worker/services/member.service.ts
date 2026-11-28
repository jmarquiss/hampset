import type { BatchItem } from 'drizzle-orm/batch';

import { getDb, memberStatus, schema, statusIs, type DB, type MemberStatus } from '@club/db';
import { and, eq, or, sql, type SQL } from 'drizzle-orm';

import type { Member } from '../schemas/member.schema';

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

export async function listMembers(database: D1Database): Promise<Member[]> {
  const users = await getDb(database).query.user.findMany({
    columns: {
      approvedAt: true,
      createdAt: true,
      disabledAt: true,
      email: true,
      id: true,
      name: true,
      roles: true,
    },
    orderBy: (user, { asc }) => asc(user.createdAt),
  });

  return users.map(({ approvedAt, createdAt, disabledAt, ...rest }) => ({
    ...rest,
    createdAt: createdAt.toISOString(),
    status: memberStatus({ approvedAt, disabledAt }),
  }));
}

export async function updateMemberRoles(
  database: D1Database,
  id: string,
  submittedRoles: Member['roles'],
) {
  const roles = [...new Set(submittedRoles)];
  const [updated] = await getDb(database)
    .update(user)
    .set({ roles, updatedAt: new Date() })
    .where(eq(user.id, id))
    .returning({ id: user.id });

  return Boolean(updated);
}

export type MemberActionResult =
  | { currentStatus: ReturnType<typeof memberStatus>; kind: 'conflict' }
  | { kind: 'not-found' }
  | { kind: 'updated' };

/** Applies the state change and its audit record in a single database batch. */
export async function applyMemberAction(
  database: D1Database,
  { action, actorEmail, id }: { action: schema.AuditAction; actorEmail: string; id: string },
): Promise<MemberActionResult> {
  const db = getDb(database);
  const { from, run } = actions[action];
  const target = and(eq(user.id, id), or(...from.map(statusIs))) ?? sql`0`;
  const results: unknown[] = await db.batch([
    db.insert(auditLog).select(
      db
        /* eslint-disable perfectionist/sort-objects -- must match the table's column order */
        .select({
          id: sql<number>`null`.as('id'),
          actorEmail: sql<string>`${actorEmail}`.as('actor_email'),
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

  if ((results[1] as unknown[]).length > 0) return { kind: 'updated' };

  const member = await db.query.user.findFirst({ where: eq(user.id, id) });
  if (!member) return { kind: 'not-found' };
  return { currentStatus: memberStatus(member), kind: 'conflict' };
}
