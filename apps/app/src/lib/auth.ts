import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({ basePath: '/api/auth' });

/** Starts Google sign-in. New accounts wait for an admin to approve them. */
export function signInWithGoogle() {
  return authClient.signIn.social({
    callbackURL: '/',
    errorCallbackURL: '/login',
    provider: 'google',
  });
}
