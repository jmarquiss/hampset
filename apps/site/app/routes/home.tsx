import { club } from "@club/shared/club";
import badge from "@club/shared/logo/badge.svg";
import { Link } from "react-router";
import { pageMeta } from "../components/Page";

export const meta = () =>
  pageMeta(
    null,
    `A friendly, sociable and inclusive cricket club in Bath, founded in ${club.founded}. New players always welcome.`,
  );

const highlights = [
  {
    title: "Senior cricket",
    body: "Six senior teams in 2026, four of them playing league cricket.",
  },
  {
    title: "Juniors",
    body: "Age-group teams for young players aged 7 to 19, including an Under 19 T20 side.",
  },
  {
    title: "Women's cricket",
    body: "A growing women's section, and new players are always welcome.",
  },
];

/** Home page. */
export default function Home() {
  return (
    <>
      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 md:flex-row-reverse md:items-center md:justify-between md:py-20">
          <img
            src={badge}
            alt={`${club.name} badge`}
            className="size-32 shrink-0 rounded-full ring-4 ring-accent/40 md:size-64"
          />
          <div>
            <p className="text-sm font-semibold tracking-widest text-accent uppercase">
              Bath · Founded {club.founded}
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl">Welcome to {club.shortName}</h1>
            <p className="mt-4 max-w-2xl text-lg text-accent">
              We are a friendly, sociable and inclusive cricket club. If you have any questions or
              would like to join, please get in touch.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="rounded-full bg-accent px-6 py-3 font-semibold text-brand hover:bg-white"
              >
                Get in touch
              </Link>
              <Link
                to="/about"
                className="rounded-full border border-accent/60 px-6 py-3 font-semibold hover:bg-brand-light"
              >
                About the club
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12">
        <section className="max-w-3xl space-y-3 text-lg leading-relaxed">
          <h2 className="font-display text-3xl text-brand">The club</h2>
          <p>
            Welcome to {club.name}, Bath, founded in {club.founded}. Our aim is to provide good
            quality cricket at a reasonable cost. In 2025 we celebrated our 85th anniversary.
          </p>
          <p>
            We have good facilities at Bloomfield Rise in the south of Bath, and we're always
            looking for new players.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl text-brand">{item.title}</h3>
              <p className="mt-2 text-muted">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="rounded-lg bg-accent-light p-8">
          <h2 className="font-display text-2xl text-brand">New players welcome</h2>
          <p className="mt-2 max-w-2xl">
            Interested in playing? Email us at{" "}
            <a href={`mailto:${club.email}`} className="font-semibold text-brand underline">
              {club.email}
            </a>{" "}
            and we'll get back to you.
          </p>
        </section>
      </div>
    </>
  );
}
