import { club } from '@club/shared/club';
import { Page, Section, TextLink } from '@club/shared/ui';

import { pageMeta } from '../meta';

export const meta = () =>
  pageMeta('Terms of service', `Terms for using the ${club.name} public website and members area.`);

/** Terms for the public site and members area. */
export default function Terms() {
  return (
    <Page
      title="Terms of service"
      intro={`Terms for using the ${club.name} website and members area.`}
    >
      <Section title="Using this service">
        <p>
          By using this website or members area, you agree to these terms. The public website shares
          information about the club. The members area is provided for club members and people whose
          access has been approved by a club administrator.
        </p>
      </Section>

      <Section title="Accounts and access">
        <p>
          Sign in to the members area with your own Google account. You are responsible for keeping
          access to that account secure and for using the service only for lawful purposes. Please
          provide accurate information and tell us if you believe someone else has accessed your
          account.
        </p>
        <p>
          New accounts require administrator approval. The club may decline, suspend or remove
          access where appropriate, including when a person is no longer eligible to use the members
          area or these terms are breached.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>
          Do not misuse the service, attempt to access accounts or systems without permission,
          interfere with its operation, or use it to upload or share unlawful or harmful material.
          Respect other users and the club when using any members features.
        </p>
      </Section>

      <Section title="Availability and content">
        <p>
          We aim to keep the service available and information accurate, but we do not guarantee
          uninterrupted access or that all content is complete or current. We may update, suspend or
          withdraw features to maintain or improve the service.
        </p>
      </Section>

      <Section title="Third-party services">
        <p>
          The members area uses Google for sign-in and our services may link to third-party
          websites. Those services are governed by their own terms and policies. See our{' '}
          <TextLink href="/privacy">Privacy policy</TextLink> for information about personal data.
        </p>
      </Section>

      <Section title="Requesting removal of information">
        <p>
          To request removal of your personal information, email{' '}
          <TextLink href={`mailto:${club.email}`}>{club.email}</TextLink>.
        </p>
      </Section>

      <Section title="Liability and changes">
        <p>
          Nothing in these terms limits liability where it cannot legally be limited. To the extent
          permitted by law, the service is provided without a guarantee that it will always be
          available or error-free. We may revise these terms; continued use after an update means
          you accept the revised terms.
        </p>
      </Section>

      <Section title="Contact and governing law">
        <p>
          Questions about these terms? Contact us at{' '}
          <TextLink href={`mailto:${club.email}`}>{club.email}</TextLink> or{' '}
          {club.address.join(', ')}. These terms are governed by the laws of England and Wales.
        </p>
        <p>Last updated: 21 November 2026.</p>
      </Section>
    </Page>
  );
}
