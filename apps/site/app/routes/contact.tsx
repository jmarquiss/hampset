import { club } from "@club/shared/club";
import { Page, pageMeta } from "../components/Page";

export const meta = () =>
  pageMeta(
    "Contact us",
    `Get in touch with ${club.name}: address, phone, email and directions to Bloomfield Rise, Bath.`,
  );

const linkClass = "font-semibold text-brand underline";

/** Contact page. */
export default function Contact() {
  return (
    <Page
      title="Contact us"
      intro="Questions, joining or just want to come along and watch? We'd love to hear from you."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-brand">Get in touch</h2>
          <p>
            Email{" "}
            <a href={`mailto:${club.email}`} className={linkClass}>
              {club.email}
            </a>
          </p>
          <p>
            Phone{" "}
            <a href={`tel:${club.phone.replace(/\s/g, "")}`} className={linkClass}>
              {club.phone}
            </a>
          </p>
          <a
            href={`mailto:${club.email}`}
            className="inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-light"
          >
            Email the club
          </a>
        </div>

        <div className="space-y-4 rounded-lg border border-line bg-white p-6">
          <h2 className="font-display text-2xl text-brand">Find us</h2>
          <address className="not-italic">
            {club.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p>
            <a href={club.mapUrl} className={linkClass}>
              Open in Google Maps
            </a>
          </p>
        </div>
      </div>

      <p>
        Follow us on{" "}
        <a href={club.facebookUrl} className={linkClass}>
          Facebook
        </a>{" "}
        and find fixtures and results on{" "}
        <a href={club.playCricketUrl} className={linkClass}>
          Play-Cricket
        </a>
        .
      </p>
    </Page>
  );
}
