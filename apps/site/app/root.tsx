import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import touchIcon from '@club/shared/logo/apple-touch-icon.png';
import icon from '@club/shared/logo/icon.svg';
import { ButtonLink, Shell } from '@club/shared/ui';
import { appUrl } from '@club/shared/urls';
import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration } from 'react-router';

import './app.css';

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
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Renders the shared header and footer's site links as in-app links, highlighting the page. */
function SiteLink({ href, ...props }: { href: string } & ComponentPropsWithoutRef<'a'>) {
  return <NavLink to={href} end {...props} />;
}

/** Header, page content and footer. */
export default function App() {
  return (
    <Shell
      siteLink={SiteLink}
      actions={
        <ButtonLink href={appUrl} variant="light" size="sm">
          Members
        </ButtonLink>
      }
    >
      <Outlet />
    </Shell>
  );
}
