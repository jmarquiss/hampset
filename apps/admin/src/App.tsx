import { club } from '@club/shared/club';
import scorpion from '@club/shared/logo/scorpion-white.svg';
import { Brand, Container, Navbar, NavItem, PageTitle } from '@club/shared/ui';
import { appUrl, siteUrl } from '@club/shared/urls';

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
            <NavItem href={siteUrl}>Website</NavItem>
            <NavItem href={appUrl}>Members app</NavItem>
            {/* Ends the Cloudflare Access session. */}
            <NavItem href="/cdn-cgi/access/logout">Sign out</NavItem>
          </>
        }
      />
      <main className="flex-1">
        <Container className="space-y-8 py-8">
          <PageTitle>Admin dashboard</PageTitle>
          <MemberTable />
          <AuditList />
        </Container>
      </main>
    </div>
  );
}
