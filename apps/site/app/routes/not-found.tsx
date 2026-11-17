import { Link } from "react-router";
import { Page, pageMeta } from "../components/Page";

export const meta = () => pageMeta("Page not found", "This page doesn't exist.");

/** Catch-all for unknown paths; prerendered as 404.html. */
export default function NotFound() {
  return (
    <Page title="Page not found" intro="Sorry, we couldn't find that page.">
      <Link to="/" className="font-semibold text-brand underline">
        Back to the home page
      </Link>
    </Page>
  );
}
