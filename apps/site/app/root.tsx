import type { ReactNode } from 'react';

import { club } from '@club/shared/club';
import touchIcon from '@club/shared/logo/apple-touch-icon.png';
import icon from '@club/shared/logo/icon.svg';
import scorpion from '@club/shared/logo/scorpion-white.svg';
import { Brand, ButtonLink, Footer, Navbar, NavItem } from '@club/shared/ui';
import { Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration } from 'react-router';

import './app.css';

const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

/** The HTML document shared by every page. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className="scroll-pt-20">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={icon} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={touchIcon} />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Header, page content and footer. */
export default function App() {
  return (
    <>
      <Navbar
        sticky
        brand={
          <Brand as={Link} to="/" logo={scorpion} className="text-xl tracking-wide">
            {club.shortName}
          </Brand>
        }
        links={nav.map((item) => (
          <NavItem key={item.to} as={NavLink} to={item.to} end>
            {item.label}
          </NavItem>
        ))}
        actions={
          <ButtonLink href={import.meta.env.VITE_APP_URL} variant="light" size="sm">
            Members
          </ButtonLink>
        }
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
