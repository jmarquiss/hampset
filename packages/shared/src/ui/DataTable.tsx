import type { Key, ReactNode } from 'react';

import { cx } from './cx';
import { Empty } from './Feedback';

/**
 * A `DataTable` column. `hideStackedLabel` leaves out the column name when rows are stacked on
 * phones, for columns that speak for themselves (a name, a row's buttons).
 */
export interface Column<T> {
  cell: (row: T) => ReactNode;
  className?: string;
  header: string;
  hideStackedLabel?: boolean;
}

/**
 * A table of `rows`, or `empty` when there are none. On phones each row stacks into a block of
 * label and value pairs instead of squeezing the columns; the visible labels stand in for the
 * table semantics some browsers drop once the cells are no longer laid out as a table.
 */
export function DataTable<T>({
  columns,
  empty,
  rowKey,
  rows,
}: {
  columns: Column<T>[];
  empty: ReactNode;
  rowKey: (row: T) => Key;
  rows: T[];
}) {
  if (rows.length === 0) return <Empty>{empty}</Empty>;
  return (
    <table className="w-full text-left text-sm max-md:block">
      <thead className="border-b border-line text-xs tracking-wide text-muted uppercase max-md:hidden">
        <tr>
          {columns.map((column) => (
            <th
              key={column.header}
              scope="col"
              className={cx('px-3 py-2 font-semibold', column.className)}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-line max-md:block">
        {rows.map((row) => (
          <tr key={rowKey(row)} className="max-md:block max-md:space-y-2 max-md:py-3">
            {columns.map((column) => (
              <td
                key={column.header}
                className={cx(
                  'p-3 align-middle max-md:flex max-md:gap-3 max-md:p-0',
                  column.className,
                )}
              >
                {!column.hideStackedLabel && (
                  <span className="w-24 shrink-0 pt-0.5 text-xs font-semibold tracking-wide text-muted uppercase md:hidden">
                    {column.header}
                  </span>
                )}
                <div className="min-w-0 max-md:flex-1">{column.cell(row)}</div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
