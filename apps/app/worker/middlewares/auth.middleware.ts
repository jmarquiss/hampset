import { getDb, memberStatus, schema } from '@club/db';
import { createMiddleware } from 'hono/factory';
import { eq } from 'drizzle-orm';

import type { AppEnv } from '../env';

import { createAuth } from '../auth';

/** Loads the signed-in member into context and forwards refreshed session cookies. */
export const requireSession = createMiddleware<AppEnv>(async (c, next) => {
  const { headers, response: session } = await createAuth(c.env).api.getSession({
    headers: c.req.raw.headers,
    returnHeaders: true,
  });
  if (!session) return c.json({ error: 'Not signed in' }, 401);
  for (const cookie of headers.getSetCookie()) c.header('Set-Cookie', cookie, { append: true });

  const { email, id, name } = session.user;
  const member = await getDb(c.env.DB).query.user.findFirst({
    columns: { approvedAt: true, disabledAt: true, roles: true },
    where: eq(schema.user.id, id),
  });
  c.set('user', {
    email,
    id,
    name,
    roles: member?.roles ?? [],
    status: memberStatus(member ?? session.user),
  });
  return next();
});

/** Responds 403 unless the signed-in user is active. */
export const requireMember = createMiddleware<AppEnv>(async (c, next) => {
  if (c.var.user.status !== 'active') return c.json({ error: 'Not an active member' }, 403);
  return next();
});
