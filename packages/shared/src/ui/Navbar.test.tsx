import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Navbar, NavItem } from './Navbar';

const dismissals: {
  dismiss: (outside: HTMLElement, link: HTMLElement) => void;
  focusMenu: boolean;
  label: string;
}[] = [
  {
    dismiss: (outside) => fireEvent.pointerDown(outside),
    focusMenu: false,
    label: 'an outside click',
  },
  {
    dismiss: () => fireEvent.keyDown(document, { key: 'Escape' }),
    focusMenu: true,
    label: 'Escape',
  },
  {
    dismiss: (_outside, link) => fireEvent.click(link),
    focusMenu: false,
    label: 'link selection',
  },
];

afterEach(cleanup);

describe('Navbar', () => {
  it.each(dismissals)('closes the mobile menu on $label', ({ dismiss, focusMenu }) => {
    render(
      <>
        <Navbar
          brand="Club"
          links={
            <NavItem href="/about" onClick={(event) => event.preventDefault()}>
              About
            </NavItem>
          }
        />
        <button type="button">Outside</button>
      </>,
    );

    const menuButton = screen.getByRole('button', { name: 'Menu' });
    const nav = screen.getByRole('navigation', { name: 'Main' });
    const link = screen.getByRole('link', { name: 'About' });
    const outside = screen.getByRole('button', { name: 'Outside' });
    expect(menuButton.getAttribute('aria-controls')).toBe(nav.id);
    fireEvent.click(menuButton);
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    dismiss(outside, link);
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    if (focusMenu) expect(document.activeElement).toBe(menuButton);
  });
});
