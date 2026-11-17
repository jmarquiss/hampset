import { createMiddleware } from "hono/factory";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AdminEnv } from "./env";

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

/** Returns the cached signing-key set for an Access team; jose refreshes it as keys rotate. */
function keysFor(teamOrigin: string) {
  let keys = keySets.get(teamOrigin);
  if (!keys) {
    keys = createRemoteJWKSet(new URL("/cdn-cgi/access/certs", teamOrigin));
    keySets.set(teamOrigin, keys);
  }
  return keys;
}

/**
 * Rejects requests without a valid Cloudflare Access login token. Access adds the token to every
 * request it lets through, so this guards against anything reaching the Worker another way. The
 * check is skipped only on the Vite dev server with ACCESS_AUD unset; production builds always
 * enforce it.
 */
export const requireAccess = createMiddleware<AdminEnv>(async (c, next) => {
  const { ACCESS_TEAM_DOMAIN: team, ACCESS_AUD: audience } = c.env;
  if (import.meta.env.DEV && !audience) return next();

  const token = c.req.header("Cf-Access-Jwt-Assertion");
  if (!token || !team || !audience) return c.json({ error: "Unauthorized" }, 401);
  try {
    const issuer = new URL(team).origin;
    await jwtVerify(token, keysFor(issuer), { issuer, audience });
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
});
