import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTable } from './DataTable';

describe('DataTable', () => {
  it('keeps table headers associated and provides labels for stacked cells', () => {
    const columns = [
      { cell: (row: { name: string; role: string }) => row.name, header: 'Name' },
      { cell: (row: { name: string; role: string }) => row.role, header: 'Role' },
      {
        cell: () => <button type="button">Edit</button>,
        header: 'Actions',
        hideStackedLabel: true,
      },
    ];
    render(
      <DataTable
        columns={columns}
        rows={[{ name: 'Ada', role: 'Admin' }]}
        rowKey={(row) => row.name}
        empty="None"
      />,
    );

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'Name' }).getAttribute('scope')).toBe(
      'col',
    );
    const cells = within(table).getAllByRole('cell');
    expect(cells[0]?.textContent).toContain('Name');
    expect(cells[0]?.textContent).toContain('Ada');
    expect(cells[1]?.textContent).toContain('Role');
    expect(cells[2]?.textContent).toContain('Edit');
    expect(cells[2]?.textContent).not.toContain('Actions');
  });
});
