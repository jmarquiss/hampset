import { getDb, schema } from '@club/db';
import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';

import type { Env } from './env';

/** Error code sent to the login page when Google hasn't verified the account's email. */
export const EMAIL_NOT_VERIFIED = 'email_not_verified';

/** Longest name stored for a member; longer ones are cut short. */
export const MAX_NAME_LENGTH = 100;

/**
 * Database hook for user writes: trims the name, which members can set themselves, and clears the
 * image, which the app never shows. Rejects a name that isn't a string.
 */
// eslint-disable-next-line @typescript-eslint/require-await -- Better Auth hooks return a Promise
async function limitProfile(user: { name?: unknown }) {
  if (user.name === undefined) return { data: { image: null } };
  if (typeof user.name !== 'string')
    throw APIError.fromStatus('BAD_REQUEST', { message: 'Name must be text' });
  const name = Array.from(user.name.trim()).slice(0, MAX_NAME_LENGTH).join('');
  return { data: { image: null, name } };
}

/**
 * Builds the Better Auth options: Google sign-in only. Anyone with a verified email can create an
 * account, but it stays pending until an admin sets `approvedAt` (see requireMember in index.ts).
 */
export function authOptions(env: Env) {
  return {
    account: {
      encryptOAuthTokens: true,
      // Keeps in-flight sign-in state in an encrypted cookie rather than in the verification table.
      storeStateStrategy: 'cookie',
      // Otherwise a second Google account with the same verified email (a recycled address, or
      // a Workspace "conflicting account") would be signed in as the existing member.
      accountLinking: { enabled: false },
    },
    advanced: {
      ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] },
    },
    basePath: '/api/auth',
    baseURL: env.APP_URL,
    database: drizzleAdapter(getDb(env.DB), { provider: 'sqlite', schema }),
    databaseHooks: {
      user: { create: { before: limitProfile }, update: { before: limitProfile } },
    },
    rateLimit: { enabled: true, max: 20, window: 60 },
    secret: env.BETTER_AUTH_SECRET,
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    socialProviders: {
      google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    },
    user: {
      // Admins approve people by email, so it must be one Google has verified.
      validateUserInfo: ({ source, user }) =>
        source.action === 'create-user' && !user.emailVerified
          ? { error: EMAIL_NOT_VERIFIED }
          : undefined,
      // Input: false stops members setting these themselves through sign-up or update-user.
      additionalFields: {
        approvedAt: { input: false, required: false, type: 'date' },
        disabledAt: { input: false, required: false, type: 'date' },
      },
    },
    // Sign-in failures without their own error URL also land on the login page with ?error=.
    onAPIError: { errorURL: '/login' },
  } satisfies BetterAuthOptions;
}

type Auth = ReturnType<typeof betterAuth<ReturnType<typeof authOptions>>>;
const cache = new WeakMap<Env, Auth>();

/**
 * Returns the Better Auth instance for this env, built once per isolate rather than per request.
 */
export function createAuth(env: Env): Auth {
  let auth = cache.get(env);
  if (!auth) {
    auth = betterAuth(authOptions(env));
    cache.set(env, auth);
  }
  return auth;
}
