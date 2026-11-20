import type { ReactNode } from 'react';

/** Shows an error's message, or nothing when there's no error. */
export function ErrorText({ error }: { error: unknown }) {
  if (!error) return null;
  return (
    <p role="alert" className="rounded-sm bg-danger/10 p-3 text-sm wrap-anywhere text-danger">
      {error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Something went wrong.'}
    </p>
  );
}

/** A loading placeholder. */
export function Loading() {
  return <p className="text-muted">Loading…</p>;
}

/** A placeholder for an empty list. */
export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-sm border border-dashed border-line p-6 text-center text-muted">
      {children}
    </p>
  );
}
