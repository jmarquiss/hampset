import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('exposes tabs and panels accessibly and moves selection with arrow keys', () => {
    render(
      <Tabs
        label="Member status"
        items={[
          { content: 'Waiting content', id: 'waiting', label: 'Waiting' },
          { content: 'Active content', id: 'active', label: 'Active' },
        ]}
      />,
    );

    const waiting = screen.getByRole('tab', { name: 'Waiting' });
    const active = screen.getByRole('tab', { name: 'Active' });
    expect(waiting.getAttribute('aria-selected')).toBe('true');
    expect(active.getAttribute('tabindex')).toBe('-1');
    expect(screen.getByRole('tabpanel').textContent).toContain('Waiting content');

    waiting.focus();
    fireEvent.keyDown(waiting, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(active);
    expect(active.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toContain('Active content');
  });
});
