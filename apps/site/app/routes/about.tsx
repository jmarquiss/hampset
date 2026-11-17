import { club } from "@club/shared/club";
import { Page, pageMeta, Section } from "../components/Page";
import { Teams } from "../components/Teams";

export const meta = () =>
  pageMeta(
    "About the club",
    `The history, teams and grounds of ${club.name}, playing in Bath since ${club.founded}.`,
  );

const grounds = [
  {
    name: "Bloomfield Rise",
    address: "Bloomfield Rise, Odd Down, Bath BA2 2BL",
    facilities: [
      "Pavilion",
      "Changing facilities",
      "Score box",
      "Two artificial nets and one grass net",
    ],
  },
  {
    name: "Odd Down Playing Fields",
    address: "Bloomfield Road, Odd Down, Bath BA2 2PB",
    facilities: ["Three squares", "Changing facilities"],
  },
];

const affiliations = [
  "West of England Premier Cricket League",
  "North Somerset Cricket League",
  "Bath and District Youth Cricket League",
  "Bristol & District Cricket Association",
  "Somerset",
  "Bath & North East Somerset",
  "Sports West",
];

/** About page. */
export default function About() {
  return (
    <Page
      title="About the club"
      intro={`Good quality cricket at a reasonable cost, in the south of Bath since ${club.founded}.`}
    >
      <Section title="Our history">
        <p>
          {club.name} was founded in {club.founded}, and in 2025 we celebrated our 85th anniversary.
          We're a friendly, sociable and inclusive club, and our aim has always been to provide good
          quality cricket at a reasonable cost.
        </p>
      </Section>

      <Section title="Teams">
        <p>
          Senior men's sides on Saturdays and Sundays, a growing women's section, and juniors from
          Under 9 to Under 19. Fixtures, results and scorecards are on our{" "}
          <a href={club.playCricketUrl} className="font-semibold text-brand underline">
            Play-Cricket site
          </a>
          .
        </p>
        <Teams />
      </Section>

      <Section title="Grounds">
        <div className="grid gap-4 sm:grid-cols-2">
          {grounds.map((ground) => (
            <div key={ground.name} className="rounded-lg border border-line bg-white p-6">
              <h3 className="font-display text-xl text-brand">{ground.name}</h3>
              <p className="mt-1 text-sm text-muted">{ground.address}</p>
              <ul className="mt-3 list-disc space-y-1 pl-6">
                {ground.facilities.map((facility) => (
                  <li key={facility}>{facility}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Finding us">
        <p>
          From Bath, take the A367 towards Radstock. Just after The Bear pub at Bear Flat, take the
          right-hand fork into Bloomfield Road. At the top of the hill the playing fields are on the
          left, about 50 metres before the traffic lights.
        </p>
        <p>
          <a href={club.mapUrl} className="font-semibold text-brand underline">
            Open in Google Maps
          </a>
        </p>
      </Section>

      <Section title="Affiliations">
        <ul className="list-disc space-y-1 pl-6">
          {affiliations.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}
