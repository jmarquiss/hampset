import { club } from '@club/shared/club';
import { Card, CardGrid, PageTitle } from '@club/shared/ui';
import { useOutletContext } from 'react-router';

import type { Me } from '../hooks/useMe';

const links = [
  {
    body: 'See upcoming matches and scorecards on Play-Cricket.',
    href: club.playCricketUrl,
    title: 'Fixtures and results',
  },
  {
    body: 'News, club information and how to find us.',
    href: import.meta.env.VITE_SITE_URL,
    title: 'Club website',
  },
  {
    body: club.email,
    href: `mailto:${club.email}`,
    title: 'Contact the club',
  },
];

/** Landing page for signed-in members. */
export function Home() {
  const me = useOutletContext<Me>();
  const firstName = me.name.trim().split(/\s+/)[0];

  return (
    <>
      <PageTitle>{firstName ? `Welcome, ${firstName}` : 'Welcome'}</PageTitle>
      <Card className="mb-6">
        <p>
          This is the new {club.shortName} members area. It's just getting started, and more
          features will appear here soon.
        </p>
      </Card>
      <CardGrid>
        {links.map((link) => (
          <Card key={link.title} title={link.title} subtitle={link.body} href={link.href} />
        ))}
      </CardGrid>
    </>
  );
}
