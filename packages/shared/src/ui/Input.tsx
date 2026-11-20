import type { InputHTMLAttributes } from 'react';

import { cx } from './cx';

/** A themed text input. */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'w-full rounded-full border border-line bg-white px-4 py-2 focus:border-brand focus:outline-none',
        className,
      )}
      {...props}
    />
  );
}
