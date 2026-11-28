import { createMiddleware } from 'hono/factory';
import { createRemoteJWKSet, jwtVerify } from 'jose';

import type { AdminEnv } from '../env';

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

/** Returns the cached signing-key set for an Access team; jose refreshes it as keys rotate. */
function keysFor(teamOrigin: string) {
  let keys = keySets.get(teamOrigin);
  if (!keys) {
    keys = createRemoteJWKSet(new URL('/cdn-cgi/access/certs', teamOrigin));
    keySets.set(teamOrigin, keys);
  }
  return keys;
}

/**
 * Rejects requests without a valid Cloudflare Access login token, and puts the admin's email in
 * c.var.adminEmail. Access adds the token to every request it lets through, so this guards against
 * anything reaching the Worker another way. The check is skipped only on the Vite dev server with
 * ACCESS_AUD unset; production builds always enforce it.
 */
export const requireAccess = createMiddleware<AdminEnv>(async (c, next) => {
  const { ACCESS_AUD: audience, ACCESS_TEAM_DOMAIN: team } = c.env;
  if (import.meta.env.DEV && !audience) {
    c.set('adminEmail', 'dev@localhost');
    return next();
  }

  const token = c.req.header('Cf-Access-Jwt-Assertion');
  if (!token || !team || !audience) return c.json({ error: 'Unauthorized' }, 401);
  let email: unknown;
  try {
    const issuer = new URL(team).origin;
    ({ email } = (await jwtVerify(token, keysFor(issuer), { audience, issuer })).payload);
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  if (typeof email !== 'string') return c.json({ error: 'Unauthorized' }, 401);
  c.set('adminEmail', email);
  return next();
});
