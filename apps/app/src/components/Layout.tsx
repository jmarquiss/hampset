import { club } from '@club/shared/club';
import scorpion from '@club/shared/logo/scorpion-white.svg';
import {
  Brand,
  Button,
  Card,
  Container,
  ErrorText,
  Footer,
  Loading,
  Navbar,
  PageTitle,
} from '@club/shared/ui';
import { Navigate, Outlet } from 'react-router';

import { useMe } from '../hooks/useMe';
import { authClient } from '../lib/auth';

const notices = {
  disabled: {
    body: `Your access to the members area has been removed. Contact ${club.email} if you think this is a mistake.`,
    title: 'Access removed',
  },
  pending: {
    body: 'Thanks for signing up. A club admin will approve your access soon; reload this page to check.',
    title: 'Waiting for approval',
  },
};

/**
 * App shell for signed-in pages; redirects to /login when there's no session, and shows a notice
 * instead of the page to pending or disabled users. Child routes get the member through
 * `useOutletContext<Me>()`.
 */
export function Layout() {
  const { data: me, error, isLoading } = useMe();

  if (isLoading || error)
    return (
      <Container className="py-8">{error ? <ErrorText error={error} /> : <Loading />}</Container>
    );
  if (!me) return <Navigate to="/login" replace />;

  const signOut = async () => {
    await authClient.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        brand={
          <Brand as="a" href={import.meta.env.VITE_SITE_URL} logo={scorpion}>
            {club.shortName}
          </Brand>
        }
        actions={
          <>
            <span className="mr-2 hidden text-sm text-accent sm:inline">{me.email}</span>
            <Button variant="outline-light" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </>
        }
      />
      <main className="flex-1">
        <Container className="py-8">
          {me.status === 'active' ? (
            <Outlet context={me} />
          ) : (
            <>
              <PageTitle>{notices[me.status].title}</PageTitle>
              <Card>
                <p className="wrap-anywhere">{notices[me.status].body}</p>
              </Card>
            </>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
