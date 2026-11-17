import { club } from "@club/shared/club";
import { Card, PageTitle } from "@club/shared/ui";
import { useOutletContext } from "react-router";
import type { Me } from "../hooks/useMe";

const links = [
  {
    title: "Fixtures and results",
    body: "See upcoming matches and scorecards on Play-Cricket.",
    href: club.playCricketUrl,
  },
  {
    title: "Club website",
    body: "News, club information and how to find us.",
    href: import.meta.env.VITE_SITE_URL,
  },
  {
    title: "Contact the club",
    body: club.email,
    href: `mailto:${club.email}`,
  },
];

/** Landing page for signed-in members. */
export function Home() {
  const me = useOutletContext<Me>();
  const firstName = me.name.split(" ")[0] || me.name;

  return (
    <>
      <PageTitle>Welcome, {firstName}</PageTitle>
      <Card className="mb-6">
        <p>
          This is the new {club.shortName} members area. It's just getting started, and more
          features will appear here soon.
        </p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-brand"
          >
            <h2 className="font-display text-lg text-brand">{link.title}</h2>
            <p className="mt-1 text-sm break-words text-muted">{link.body}</p>
          </a>
        ))}
      </div>
    </>
  );
}
