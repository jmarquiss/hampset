import { club } from '@club/shared/club';
import { Page, Section, TextLink } from '@club/shared/ui';

import { Teams } from '../components/Teams';
import { pageMeta } from '../meta';

export const meta = () =>
  pageMeta(
    'About the club',
    `The history, teams and information about ${club.name}, playing in Bath since ${club.founded}.`,
  );

/** About page. */
export default function About() {
  return (
    <Page
      title="About the club"
      intro={`Good quality cricket at a reasonable cost, in the south of Bath since ${club.founded}.`}
    >
      <Section title="Our history">
        <p>
          {club.name} was founded in {club.founded}, and in 2025 we celebrated our 85th anniversary.
          We're a friendly, sociable and inclusive club, and our aim has always been to provide good
          quality cricket at a reasonable cost.
        </p>
      </Section>

      <Section title="Teams">
        <p>
          Senior men's sides on Saturdays and Sundays, a growing women's section, and juniors from
          Under 9 to Under 19. Fixtures, results and scorecards are on our{' '}
          <TextLink href={club.playCricketUrl}>Play-Cricket site</TextLink>.
        </p>
        <Teams />
      </Section>

      <Section title="Finding us">
        <p>
          From Bath, take the A367 towards Radstock. Just after The Bear pub at Bear Flat, take the
          right-hand fork into Bloomfield Road. At the top of the hill the playing fields are on the
          left, about 50 metres before the traffic lights.
        </p>
        <p>
          <TextLink href={club.mapUrl}>Open in Google Maps</TextLink>
        </p>
      </Section>
    </Page>
  );
}
