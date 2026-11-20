import type { ReactNode } from 'react';

import { Badge } from './Badge';
import { cx } from './cx';
import { useTabs } from './useTabs';

/** A tab for `Tabs`; `count` shows as a badge beside the label. */
export interface TabItem {
  content: ReactNode;
  count?: number;
  id: string;
  label: ReactNode;
}

/**
 * A row of tabs above the selected tab's content, with the first tab selected to start. The row
 * scrolls sideways when it's wider than the screen; `className` styles the row.
 */
export function Tabs({
  className,
  items,
  label,
}: {
  className?: string;
  items: TabItem[];
  label: string;
}) {
  const { current, panelProps, tabProps } = useTabs(items.length, false);
  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className={cx('flex scrollbar-none overflow-x-auto border-b border-line', className)}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            {...tabProps(i)}
            className={cx(
              '-mb-px flex shrink-0 items-center gap-2 border-b-2 p-3 text-sm font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-light sm:px-4',
              i === current
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:border-line hover:text-brand',
            )}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <Badge tone={i === current ? 'brand' : 'muted'}>{item.count}</Badge>
            )}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div key={item.id} {...panelProps(i)} className="pt-4">
          {item.content}
        </div>
      ))}
    </div>
  );
}
