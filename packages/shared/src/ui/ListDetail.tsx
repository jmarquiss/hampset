import type { ReactNode } from 'react';

import { cx } from './cx';
import { useTabs } from './useTabs';

/** An entry for `ListDetail`: `description` shows under the label on wide screens. */
export interface ListDetailItem {
  content: ReactNode;
  description?: ReactNode;
  id: string;
  label: ReactNode;
}

/**
 * A list to pick from with the picked item's details in a dark-blue panel. On phones the list is
 * a scrolling row of pills above the panel; on wider screens it's a card beside a sticky panel.
 */
export function ListDetail({ items, label }: { items: ListDetailItem[]; label: string }) {
  const { current, panelProps, tabProps } = useTabs(items.length, true);
  return (
    <div className="grid items-start gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-8">
      <div
        role="tablist"
        aria-label={label}
        className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4 pt-1 pb-2 md:mx-0 md:block md:rounded-2xl md:bg-white md:p-4 md:shadow-lg"
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            {...tabProps(i)}
            className={cx(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-brand-light md:block md:w-full md:rounded-none md:border-0 md:border-l-4 md:bg-transparent md:py-3 md:text-left',
              i === current
                ? 'border-brand bg-brand text-white md:border-brand'
                : 'border-line bg-white text-brand md:border-transparent md:hover:border-line',
            )}
          >
            <span className="tracking-wide md:block md:text-brand md:uppercase">{item.label}</span>
            {item.description ? (
              <span className="mt-1 hidden text-sm font-normal text-muted md:block">
                {item.description}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          {...panelProps(i)}
          className="min-w-0 rounded-4xl bg-radial-[at_30%_20%] from-brand-light to-brand p-6 text-white ring-8 ring-accent-light sm:p-8 md:sticky md:top-24 md:rounded-[2.5rem] md:p-10"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
