import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from 'react';

import { club } from '../club';
import scorpion from '../logo/scorpion-white.svg';
import { siteUrl } from '../urls';
import { Container } from './Container';
import { Brand, Navbar, NavItem } from './Navbar';

/** A link component taking an `href`, such as an adapter around react-router's `NavLink`. */
export type SiteLinkComponent = ComponentType<{ href: string } & ComponentPropsWithoutRef<'a'>>;

const headerPages = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

// `shortLabel` is shown on phones, so the footer fits on one line.
const footerPages = [
  { label: 'Privacy policy', path: '/privacy', shortLabel: 'Privacy' },
  { label: 'Terms of service', path: '/terms', shortLabel: 'Terms' },
];

/** Shows `short` on phones and `full` from the `sm` breakpoint up. */
function Responsive({ full, short }: { full: string; short: string }) {
  return (
    <>
      <span className="sm:hidden">{short}</span>
      <span className="max-sm:hidden">{full}</span>
    </>
  );
}

/**
 * The header, main content and footer shared by the site, members app and admin. The header
 * links to the public site's pages, followed by any extra `links` (`NavItem`s), and shows
 * `actions` on the right; `label` names the app beside the club name.
 *
 * Site pages link to absolute `siteUrl` addresses, so they work from every app. The site itself
 * passes `siteLink` to render them as in-app links with relative paths instead.
 */
export function Shell({
  actions,
  children,
  label,
  links,
  siteLink,
}: {
  actions?: ReactNode;
  children: ReactNode;
  label?: string;
  links?: ReactNode;
  siteLink?: SiteLinkComponent;
}) {
  const Link = siteLink ?? 'a';
  const href = (path: string) => (siteLink ? path : `${siteUrl}${path}`);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        sticky
        brand={
          <Brand as={Link} href={href('/')} logo={scorpion} aria-current={false}>
            <span className="truncate">
              {club.shortName}
              {label ? <span className="text-accent max-sm:hidden"> {label}</span> : null}
            </span>
          </Brand>
        }
        links={
          <>
            {headerPages.map((page) => (
              <NavItem key={page.path} as={Link} href={href(page.path)}>
                {page.label}
              </NavItem>
            ))}
            {links}
          </>
        }
        actions={actions}
      />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand text-sm text-accent">
        <Container className="flex items-center justify-between gap-4 py-6 whitespace-nowrap">
          <span className="flex items-center gap-3">
            <img src={scorpion} alt="" className="h-7 w-auto" />
            <span>
              © <Responsive full={club.name} short={club.shortName} />
            </span>
          </span>
          <div className="flex items-center gap-4">
            {footerPages.map((page) => (
              <Link key={page.path} href={href(page.path)} className="hover:text-white">
                <Responsive full={page.label} short={page.shortLabel} />
              </Link>
            ))}
          </div>
        </Container>
      </footer>
    </div>
  );
}
