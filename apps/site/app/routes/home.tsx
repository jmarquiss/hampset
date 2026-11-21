import { club } from '@club/shared/club';
import badge from '@club/shared/logo/badge.svg';
import {
  ButtonLink,
  CallToAction,
  Card,
  CardGrid,
  Container,
  Hero,
  Section,
  TextLink,
} from '@club/shared/ui';
import { Link } from 'react-router';

import { pageMeta } from '../meta';

export const meta = () =>
  pageMeta(
    null,
    `A friendly, sociable and inclusive cricket club in Bath, founded in ${club.founded}. New players always welcome.`,
  );

const highlights = [
  {
    body: 'Six senior mens teams in 2026, four of them playing league cricket.',
    title: 'Senior mens cricket',
  },
  {
    body: 'Age-group teams for young players aged 7 to 19, including an Under 19 T20 side. Supported by ECB qualified coaches.',
    title: 'Juniors',
  },
  {
    body: "A growing women's section, and new players are always welcome.",
    title: "Women's cricket",
  },
];

/** Home page. */
export default function Home() {
  return (
    <>
      <Hero
        eyebrow={`Bath · Founded ${club.founded}`}
        title={`Welcome to ${club.shortName}`}
        image={
          <img
            src={badge}
            alt={`${club.name} badge`}
            className="size-28 rounded-full ring-4 ring-accent/40 sm:size-32 md:size-56 lg:size-64"
          />
        }
        actions={
          <>
            <ButtonLink as={Link} to="/contact" variant="light" size="lg">
              Get in touch
            </ButtonLink>
            <ButtonLink as={Link} to="/about" variant="outline-light" size="lg">
              About the club
            </ButtonLink>
          </>
        }
      >
        We are a friendly, sociable and inclusive cricket club. If you have any questions or would
        like to join, please get in touch.
      </Hero>

      <Container className="space-y-10 py-10 sm:space-y-12 sm:py-12">
        <Section title="The club" className="max-w-3xl text-lg">
          <p>
            Welcome to {club.name}, Bath, founded in {club.founded}. Our aim is to provide good
            quality cricket at a reasonable cost. In 2025 we celebrated our 85th anniversary.
          </p>
          <p>
            We have good facilities at Bloomfield Rise in the south of Bath, and we're always
            looking for new players.
          </p>
        </Section>

        <CardGrid>
          {highlights.map((item) => (
            <Card key={item.title} title={item.title} level={3}>
              <p className="text-muted">{item.body}</p>
            </Card>
          ))}
        </CardGrid>

        <CallToAction
          title="New players welcome"
          action={
            <ButtonLink href={`mailto:${club.email}`} size="lg" className="w-full md:w-auto">
              Email us
            </ButtonLink>
          }
        >
          Interested in playing? Email us at{' '}
          <TextLink href={`mailto:${club.email}`}>{club.email}</TextLink> and we'll get back to you.
        </CallToAction>
      </Container>
    </>
  );
}
