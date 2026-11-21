import type { Context } from 'hono';

import { getDb, schema } from '@club/db';
import { betterAuth } from 'better-auth';
import { testUtils } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { setCookie } from 'hono/cookie';

import type { AppEnv } from './env';

import { authOptions } from './auth';

/** Email of the local test account the dev server signs in as. */
export const DEV_EMAIL = 'test.member@localhost';

/**
 * Signs the browser in as the local test account, creating it the first time as a pending sign-up,
 * as if they had just signed in with Google. Its status is then changed from the admin dashboard.
 * Only loaded on the Vite dev server: index.ts imports this module behind `import.meta.env.DEV`.
 */
export async function devSignIn(c: Context<AppEnv>) {
  // Second guard, in case a build is ever made with DEV set: production's APP_URL is never local.
  if (new URL(c.env.APP_URL).hostname !== 'localhost') return c.json({ error: 'Not found' }, 404);

  const options = authOptions(c.env);
  // The sign-up gate needs a Better Auth endpoint context, which the test helpers don't have.
  const user = { ...options.user, validateUserInfo: undefined };
  const { test } = await betterAuth({ ...options, plugins: [testUtils()], user }).$context;

  const existing = await getDb(c.env.DB).query.user.findFirst({
    where: eq(schema.user.email, DEV_EMAIL),
  });
  const member =
    existing ??
    (await test.saveUser(
      test.createUser({ email: DEV_EMAIL, emailVerified: true, name: 'Test Member' }),
    ));

  const [cookie] = await test.getCookies({ userId: member.id });
  if (!cookie) throw new Error('Better Auth returned no session cookie');
  setCookie(c, cookie.name, cookie.value, {
    expires: cookie.expires ? new Date(cookie.expires * 1000) : undefined,
    httpOnly: cookie.httpOnly,
    path: cookie.path,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
  });
  return c.body(null, 204);
}
