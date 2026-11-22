import type { ComponentPropsWithoutRef } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { NavItem } from './Navbar';
import { Shell, type SiteLinkComponent } from './Shell';

/** Stands in for the site's router link, marking the links it renders. */
function RouterLink({ children, ...props }: { href: string } & ComponentPropsWithoutRef<'a'>) {
  return (
    <a data-router {...props}>
      {children}
    </a>
  );
}

/** The links Shell renders: the brand and header pages, the extra `links`, then the footer. */
const expectedLinks = (site: (path: string) => { href: string; router: boolean }) => [
  ...['/', '/', '/about', '/contact'].map(site),
  { href: '/extra', router: false },
  ...['/privacy', '/terms'].map(site),
];

const cases: {
  expected: { href: string; router: boolean }[];
  name: string;
  siteLink?: SiteLinkComponent;
}[] = [
  {
    expected: expectedLinks((path) => ({ href: `https://club.test${path}`, router: false })),
    name: 'absolute site URLs by default',
  },
  {
    expected: expectedLinks((path) => ({ href: path, router: true })),
    name: 'relative paths through siteLink',
    siteLink: RouterLink,
  },
];

afterEach(cleanup);

describe('Shell', () => {
  it.each(cases)('links to site pages with $name', ({ expected, siteLink }) => {
    render(
      <Shell siteLink={siteLink} links={<NavItem href="/extra">Extra</NavItem>}>
        Content
      </Shell>,
    );

    expect(
      screen.getAllByRole('link').map((link) => ({
        href: link.getAttribute('href'),
        router: link.hasAttribute('data-router'),
      })),
    ).toEqual(expected);
  });
});
