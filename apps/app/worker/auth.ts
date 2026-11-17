import { claimInvite, getDb, schema } from "@club/db";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getOAuthState } from "better-auth/api";
import type { Env } from "./env";

/** Error code sent to the login page when someone without a valid invite tries to sign up. */
export const INVITE_REQUIRED = "invite_required";

/**
 * Builds the Better Auth options: Google sign-in only, and new accounts only for people holding
 * an unexpired invite. The invite token rides through the Google redirect as `additionalData`
 * (see signInWithGoogle in src/lib/auth.ts) and is claimed just before the account is created.
 */
export function authOptions(env: Env) {
  const db = getDb(env.DB);
  return {
    baseURL: env.APP_URL,
    basePath: "/api/auth",
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "sqlite", schema }),
    socialProviders: {
      google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    },
    // Keeps the in-flight sign-in state, including the invite token, in an encrypted cookie
    // rather than as plain text in the database.
    account: { storeStateStrategy: "cookie" },
    user: {
      validateUserInfo: async ({ source }) => {
        if (source.action !== "create-user") return;
        // Only an OAuth callback carries state; anything else counts as having no invite.
        const token = (await getOAuthState().catch(() => null))?.inviteToken;
        if (typeof token === "string" && (await claimInvite(db, token))) return;
        return { error: INVITE_REQUIRED };
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    advanced: {
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
    },
    rateLimit: { enabled: true, window: 60, max: 20 },
    // Sign-in failures without their own error URL also land on the login page with ?error=.
    onAPIError: { errorURL: "/login" },
  } satisfies BetterAuthOptions;
}

type Auth = ReturnType<typeof betterAuth<ReturnType<typeof authOptions>>>;
const cache = new WeakMap<Env, Auth>();

/** Returns the Better Auth instance for this env, built once per isolate rather than per request. */
export function createAuth(env: Env): Auth {
  let auth = cache.get(env);
  if (!auth) {
    auth = betterAuth(authOptions(env));
    cache.set(env, auth);
  }
  return auth;
}
