import { club } from '@club/shared/club';
import scorpion from '@club/shared/logo/scorpion-white.svg';
import { Brand, Container, Navbar, NavItem } from '@club/shared/ui';

import { AuditList } from './components/AuditList';
import { MemberTable } from './components/MemberTable';

/** The admin dashboard: approve sign-ups to the members app and manage existing members. */
export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        brand={
          <Brand logo={scorpion}>
            <span>
              {club.shortName} <span className="text-accent">Admin</span>
            </span>
          </Brand>
        }
        links={
          <>
            <NavItem href={import.meta.env.VITE_SITE_URL}>Website</NavItem>
            <NavItem href={import.meta.env.VITE_APP_URL}>Members app</NavItem>
            {/* Ends the Cloudflare Access session. */}
            <NavItem href="/cdn-cgi/access/logout">Sign out</NavItem>
          </>
        }
      />
      <main className="flex-1">
        <Container className="space-y-8 py-8">
          <MemberTable />
          <AuditList />
        </Container>
      </main>
    </div>
  );
}
