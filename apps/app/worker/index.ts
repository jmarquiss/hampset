import { memberStatus } from '@club/db';
import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { secureHeaders } from 'hono/secure-headers';

import type { AppEnv } from './env';

import { createAuth } from './auth';

/**
 * Loads the signed-in user into c.var.user, or responds 401. Passes on the refreshed session
 * cookie Better Auth issues once a day, so active members stay signed in.
 */
const requireSession = createMiddleware<AppEnv>(async (c, next) => {
  const { headers, response: session } = await createAuth(c.env).api.getSession({
    headers: c.req.raw.headers,
    returnHeaders: true,
  });
  if (!session) return c.json({ error: 'Not signed in' }, 401);
  for (const cookie of headers.getSetCookie()) c.header('Set-Cookie', cookie, { append: true });
  const { email, id, name } = session.user;
  c.set('user', { email, id, name, status: memberStatus(session.user) });
  return next();
});

/** Responds 403 unless the signed-in user has been approved and isn't disabled. */
const requireMember = createMiddleware<AppEnv>(async (c, next) => {
  if (c.var.user.status !== 'active') return c.json({ error: 'Not an active member' }, 403);
  return next();
});

export const app = new Hono<AppEnv>().basePath('/api');

app.use(secureHeaders(), csrf());
app.on(['GET', 'POST'], '/auth/*', (c) => createAuth(c.env).handler(c.req.raw));

// Vite replaces import.meta.env.DEV with false in production builds, so this route and the dev
// module are left out of the deployed Worker entirely (scripts/check-build.sh checks for it).
if (import.meta.env.DEV) {
  app.post('/dev/sign-in', async (c) => (await import('./dev')).devSignIn(c));
}

app.use(requireSession);
// Pending and disabled users can see their own status, so the app can tell them why they're
// waiting.
app.get('/me', (c) => c.json(c.var.user));

// Everything below requires an active member, so new routes are protected by default.
app.use(requireMember);

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message || 'Request refused' }, err.status);
  }
  console.error(err);
  return c.json({ error: 'Something went wrong' }, 500);
});

export default app;
