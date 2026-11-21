import type { ReactNode } from 'react';

import { cx } from './cx';

/**
 * A white panel with a border. With `title` it gets a heading (`level` sets h2 or h3), an
 * optional `subtitle` and an `action` beside the title. With `href` the whole card is a link.
 */
export function Card({
  action,
  children,
  className,
  href,
  level = 2,
  subtitle,
  title,
}: {
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  href?: string;
  level?: 2 | 3;
  subtitle?: ReactNode;
  title?: ReactNode;
}) {
  const Heading = level === 2 ? 'h2' : 'h3';
  const hasHeading = title != null || subtitle != null || action != null;
  const content = (
    <>
      {hasHeading ? (
        <div
          className={cx(
            'flex flex-wrap items-start justify-between gap-x-4 gap-y-2',
            children != null && 'mb-3',
          )}
        >
          <div className="min-w-0">
            {title ? <Heading className="font-display text-xl text-brand">{title}</Heading> : null}
            {subtitle ? <p className="mt-1 text-sm wrap-anywhere text-muted">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </>
  );
  const classes = cx(
    'block min-w-0 rounded-lg border border-line bg-white p-4 shadow-sm sm:p-6',
    href && 'transition hover:border-brand',
    className,
  );
  return href ? (
    <a href={href} className={classes}>
      {content}
    </a>
  ) : (
    <div className={classes}>{content}</div>
  );
}

/**
 * A responsive grid of cards: one column on phones, then two columns from `sm` or three from `md`.
 * Three columns skip the two-column step so a row of three never wraps two-and-one.
 */
export function CardGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={cx('grid gap-4', cols === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2')}>
      {children}
    </div>
  );
}
