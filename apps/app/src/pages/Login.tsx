import { api } from '@club/shared/api';
import { club } from '@club/shared/club';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Navigate, useSearchParams } from 'react-router';

import { AuthCard } from '../components/AuthCard';
import { useMe } from '../hooks/useMe';

const errorMessages = new Map([
  [
    'email_not_verified',
    "Google hasn't verified that account's email address. Verify it with Google, then try again.",
  ],
  [
    'account_not_linked',
    `Sign in with the Google account you first used for the members area. Contact ${club.email} if you need it changed.`,
  ],
]);

/**
 * Sign-in page. Better Auth redirects back here with `?error=` when sign-in fails. On the dev
 * server it signs straight in as the local test account (see worker/dev.ts), unless showing an
 * error.
 */
export function Login() {
  const { data: me } = useMe();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const code = params.get('error');
  // StrictMode runs effects twice on the dev server; this stops a second, racing sign-in.
  const devSignInStartedRef = useRef(false);

  useEffect(() => {
    if (!import.meta.env.DEV || me !== null || code || devSignInStartedRef.current) return;
    devSignInStartedRef.current = true;
    api('/dev/sign-in', { method: 'POST' })
      .then(() => queryClient.invalidateQueries({ queryKey: ['me'] }))
      .catch((err: unknown) => console.error('dev sign-in failed', err));
  }, [me, code, queryClient]);

  if (me) return <Navigate to="/" replace />;

  return (
    <AuthCard
      title="Members area"
      error={code && (errorMessages.get(code) ?? "Sign-in didn't work. Please try again.")}
    >
      <p>Sign in with your Google account.</p>
      <p>New to the club? Sign in and a club admin will approve your access.</p>
    </AuthCard>
  );
}
