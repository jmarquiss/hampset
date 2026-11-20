import { club } from '@club/shared/club';
import badge from '@club/shared/logo/badge.svg';
import { Button, Card, ErrorText } from '@club/shared/ui';
import { useEffect, useState, type ReactNode } from 'react';

import { signInWithGoogle } from '../lib/auth';

/** A centred card for signed-out pages with a "Continue with Google" button. */
export function AuthCard({
  children,
  error,
  title,
}: {
  children: ReactNode;
  error?: null | string;
  title: string;
}) {
  const [busy, setBusy] = useState(false);
  const [startError, setStartError] = useState<null | string>(null);

  // Re-enable the button if the browser restores this page from its back/forward cache.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => e.persisted && setBusy(false);
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  const signIn = async () => {
    setBusy(true);
    setStartError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setStartError(error.message ?? 'Could not start Google sign-in.');
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand p-4">
      <Card className="w-full max-w-md space-y-5">
        <img src={badge} alt={`${club.name} badge`} className="mx-auto size-24" />
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-muted uppercase">
            {club.shortName}
          </p>
          <h1 className="font-display text-2xl text-brand">{title}</h1>
        </div>
        <div className="space-y-3 text-sm text-muted">{children}</div>
        <ErrorText error={error ?? startError} />
        <Button className="w-full" onClick={signIn} disabled={busy}>
          {busy ? 'Redirecting…' : 'Continue with Google'}
        </Button>
      </Card>
    </div>
  );
}
