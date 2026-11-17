import { PageTitle } from "@club/shared/ui";
import { Link } from "react-router";

/** Shown for unknown routes inside the signed-in app. */
export function NotFound() {
  return (
    <>
      <PageTitle>Page not found</PageTitle>
      <Link to="/" className="text-brand underline">
        Back to the members area
      </Link>
    </>
  );
}
