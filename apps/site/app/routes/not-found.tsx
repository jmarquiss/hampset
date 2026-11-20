import { Page, TextLink } from '@club/shared/ui';
import { Link } from 'react-router';

import { pageMeta } from '../meta';

export const meta = () => pageMeta('Page not found', "This page doesn't exist.");

/** Catch-all for unknown paths; prerendered as 404.html. */
export default function NotFound() {
  return (
    <Page title="Page not found" intro="Sorry, we couldn't find that page.">
      <TextLink as={Link} to="/">
        Back to the home page
      </TextLink>
    </Page>
  );
}
