import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ListDetail } from './ListDetail';

describe('ListDetail', () => {
  it('uses labelled tabs and selects the matching panel with vertical arrow keys', () => {
    render(
      <ListDetail
        label="Teams"
        items={[
          { content: 'First team details', id: 'first', label: 'First' },
          { content: 'Second team details', id: 'second', label: 'Second' },
        ]}
      />,
    );

    const tabs = screen.getByRole('tablist', { name: 'Teams' });
    const first = within(tabs).getByRole('tab', { name: 'First' });
    const second = within(tabs).getByRole('tab', { name: 'Second' });
    expect(first.hasAttribute('aria-controls')).toBe(true);
    expect(screen.getByRole('tabpanel').textContent).toContain('First team details');

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(second);
    expect(screen.getByRole('tabpanel').textContent).toContain('Second team details');
  });
});
