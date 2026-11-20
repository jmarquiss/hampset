import type { ReactNode } from 'react';

import { cx } from './cx';

/** Spaced paragraphs of body text. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('space-y-3 leading-relaxed', className)}>{children}</div>;
}

/** A bulleted list of strings. */
export function BulletList({ className, items }: { className?: string; items: string[] }) {
  return (
    <ul className={cx('list-disc space-y-1 pl-6', className)}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
