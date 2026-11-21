import type { ElementType } from 'react';

import { cx, type AsProps } from './cx';

/**
 * An inline text link in the brand colour that wraps anywhere, so long emails and URLs can't
 * overflow narrow screens. Renders an `<a>`, or pass `as={Link}` for a router link.
 */
export function TextLink<C extends ElementType = 'a'>({
  as,
  className,
  ...props
}: AsProps<C, { className?: string }>) {
  const Component: ElementType = as ?? 'a';
  return (
    <Component
      className={cx(
        'font-semibold wrap-anywhere text-brand underline hover:text-brand-light',
        className,
      )}
      {...props}
    />
  );
}
