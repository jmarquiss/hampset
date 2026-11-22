import { ButtonLink, Container, NavItem, PageTitle, Shell } from '@club/shared/ui';
import { appUrl } from '@club/shared/urls';

import { AuditList } from './components/AuditList';
import { MemberTable } from './components/MemberTable';

/** The admin dashboard: approve sign-ups to the members app and manage existing members. */
export function App() {
  return (
    <Shell
      label="Admin"
      links={<NavItem href={appUrl}>Members app</NavItem>}
      actions={
        // Ends the Cloudflare Access session.
        <ButtonLink href="/cdn-cgi/access/logout" variant="outline-light" size="sm">
          Sign out
        </ButtonLink>
      }
    >
      <Container className="space-y-8 py-8">
        <PageTitle>Admin dashboard</PageTitle>
        <MemberTable />
        <AuditList />
      </Container>
    </Shell>
  );
}
