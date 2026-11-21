import { club } from '@club/shared/club';
import { Page, Section, TextLink } from '@club/shared/ui';

import { pageMeta } from '../meta';

export const meta = () =>
  pageMeta(
    'Privacy policy',
    `How ${club.name} collects, uses and protects personal information on its website and members area.`,
  );

/** Privacy policy for the public site and members area. */
export default function Privacy() {
  return (
    <Page
      title="Privacy policy"
      intro={`How ${club.name} handles personal information when you use our website or members area.`}
    >
      <Section title="Who we are">
        <p>
          {club.name} is the data controller for the personal information described in this policy.
          You can contact us at <TextLink href={`mailto:${club.email}`}>{club.email}</TextLink> or at{' '}
          {club.address.join(', ')}.
        </p>
      </Section>

      <Section title="Information we collect">
        <p>
          When you use the members area, you sign in with Google. We receive the name, email address
          and profile image made available by your Google account. Google verifies your email
          address. We use these details to create your account, identify you, and let club
          administrators manage access. New accounts remain pending until an administrator approves
          them.
        </p>
        <p>
          The members area also stores account and sign-in records, including your approval or
          disabled status, session information and the Google account connection needed for sign-in.
          OAuth tokens are stored encrypted. Administrators' account management actions are recorded
          in an audit log.
        </p>
        <p>
          Our public website can be browsed without signing in. If you email us, we receive the
          information you choose to include in your message and use it to respond.
        </p>
      </Section>

      <Section title="How we use information">
        <p>
          We use personal information to provide and secure the members area, approve and manage
          membership access, respond to enquiries, and maintain the service. We do not sell personal
          information or use it for advertising.
        </p>
      </Section>

      <Section title="Service providers and Google">
        <p>
          Google provides sign-in, and Cloudflare hosts the website, application and database. These
          providers process information as needed to provide their services. Signing in with Google
          is also subject to{' '}
          <TextLink href="https://policies.google.com/privacy">Google's Privacy Policy</TextLink>.
        </p>
      </Section>

      <Section title="Retention and your choices">
        <p>
          We keep account information while your account is active or needed to administer club
          access. An administrator can disable an account or delete a disabled account, including its
          sessions and linked Google account. We retain relevant audit records for accountability.
          Enquiry emails are kept only as long as needed to handle the enquiry and related club
          administration.
        </p>
        <p>
          You can contact us to request access to, correction of, or deletion of your personal
          information, or to ask a question about how it is used. You may also complain to the UK
          Information Commissioner's Office (<TextLink href="https://ico.org.uk/">ICO</TextLink>).
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We may update this policy when our services or practices change. This page shows the current
          version.
        </p>
        <p>Last updated: 21 November 2026.</p>
      </Section>
    </Page>
  );
}
