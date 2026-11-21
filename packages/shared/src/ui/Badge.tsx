import type { ReactNode } from 'react';

import { cx } from './cx';

/** A small rounded label, for example a count beside a tab name. */
export function Badge({
  children,
  tone = 'muted',
}: {
  children: ReactNode;
  tone?: 'brand' | 'muted';
}) {
  return (
    <span
      className={cx(
        'inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold',
        tone === 'brand' ? 'bg-brand text-white' : 'bg-accent-light text-muted',
      )}
    >
      {children}
    </span>
  );
}
