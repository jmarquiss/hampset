import type { ReactNode } from 'react';

import { Container } from './Container';

/** The dark-blue bar at the bottom of a page: the logo and `children`, with `aside` opposite. */
export function Footer({
  aside,
  children,
  logo,
}: {
  aside?: ReactNode;
  children: ReactNode;
  logo: string;
}) {
  return (
    <footer className="bg-brand text-sm text-accent">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-6">
        <span className="flex items-center gap-3">
          <img src={logo} alt="" className="h-7 w-auto" />
          {children}
        </span>
        {aside ? <div className="wrap-anywhere">{aside}</div> : null}
      </Container>
    </footer>
  );
}
