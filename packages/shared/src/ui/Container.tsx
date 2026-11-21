import type { ReactNode } from 'react';

import { cx } from './cx';

/** Centres content at the standard page width with side padding. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-5xl px-4', className)}>{children}</div>;
}
