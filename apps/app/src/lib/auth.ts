import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({ basePath: "/api/auth" });

/**
 * Starts Google sign-in. Pass the token from an invite link when accepting an invite; without
 * one, only existing members can sign in.
 */
export function signInWithGoogle(inviteToken?: string) {
  return authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
    errorCallbackURL: "/login",
    additionalData: inviteToken ? { inviteToken } : undefined,
  });
}
