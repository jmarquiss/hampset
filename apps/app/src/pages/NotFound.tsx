import { PageTitle, TextLink } from '@club/shared/ui';
import { Link } from 'react-router';

/** Shown for unknown routes inside the signed-in app. */
export function NotFound() {
  return (
    <>
      <PageTitle>Page not found</PageTitle>
      <TextLink as={Link} to="/">
        Back to the members area
      </TextLink>
    </>
  );
}
