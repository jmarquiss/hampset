import { club } from '@club/shared/club';
import { ButtonLink, Card, CardGrid, Page, Prose, TextLink } from '@club/shared/ui';

import { pageMeta } from '../meta';

export const meta = () =>
  pageMeta(
    'Contact us',
    `Get in touch with ${club.name}: address, phone, email and directions to Bloomfield Rise, Bath.`,
  );

/** Contact page. */
export default function Contact() {
  return (
    <Page
      title="Contact us"
      intro="Questions, joining or just want to come along and watch? We'd love to hear from you."
    >
      <CardGrid cols={2}>
        <Card title="Get in touch">
          <Prose>
            <p>
              Email <TextLink href={`mailto:${club.email}`}>{club.email}</TextLink>
            </p>
            <p>
              Phone <TextLink href={`tel:${club.phone.replace(/\s/g, '')}`}>{club.phone}</TextLink>
            </p>
            <ButtonLink href={`mailto:${club.email}`} size="lg" className="max-sm:w-full">
              Email the club
            </ButtonLink>
          </Prose>
        </Card>

        <Card title="Find us">
          <Prose>
            <address className="not-italic">
              {club.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p>
              <TextLink href={club.mapUrl}>Open in Google Maps</TextLink>
            </p>
          </Prose>
        </Card>
      </CardGrid>

      <p>
        Follow us on <TextLink href={club.facebookUrl}>Facebook</TextLink> and find fixtures and
        results on <TextLink href={club.playCricketUrl}>Play-Cricket</TextLink>.
      </p>
    </Page>
  );
}
