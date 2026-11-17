import { club } from "@club/shared/club";
import { type KeyboardEvent, useState } from "react";

type Team = {
  name: string;
  summary: string;
  league: string;
  format: string;
  when: string;
  about: string;
};

// Edit this list as teams change. League details are from the club's Play-Cricket site.
const teams: Team[] = [
  {
    name: "Saturday 1st XI",
    summary: "Our top side, playing league cricket on Saturdays.",
    league: "Bristol & District Cricket Association, Division Three",
    format: "40-over league matches",
    when: "Saturdays, usually 1pm",
    about:
      "Promoted in 2026 after finishing second in Division Three. Home games are at Bloomfield Rise.",
  },
  {
    name: "Saturday 2nd XI",
    summary: "Competitive league cricket and a step up to the 1st XI.",
    league: "Bristol & District Cricket Association, Division Seven East",
    format: "40-over league matches",
    when: "Saturdays, usually 1pm",
    about: "Runners-up in Division Seven East in 2026, where only the champions go up.",
  },
  {
    name: "Saturday 3rd XI",
    summary: "League cricket for developing and returning players.",
    league: "Bristol & District Cricket Association, Division Nine East",
    format: "League matches",
    when: "Saturdays",
    about: "Division Nine East champions in 2026, and promoted for next season.",
  },
  {
    name: "Saturday 4th XI",
    summary: "Another Saturday side, so more members get a game.",
    league: "Fixtures listed on Play-Cricket",
    format: "Saturday matches",
    when: "Saturdays",
    about: "A good way into senior cricket at the club. Ask us about getting a game.",
  },
  {
    name: "Sunday XI",
    summary: "Sunday league cricket in North Somerset.",
    league: "North Somerset League, Sunday Conference Division Three",
    format: "40-over league matches",
    when: "Sundays",
    about: "Promoted in 2026 after finishing second in their division.",
  },
  {
    name: "Women",
    summary: "Our growing women's section, open to all abilities.",
    league: "Friendly and festival matches",
    format: "Short formats, including pairs cricket",
    when: "Weekends through the summer",
    about:
      "The Women's 1st XI played their first ever home match at Bloomfield Rise in 2026. New players are always welcome, whether or not you've played before.",
  },
  {
    name: "Juniors",
    summary: "Under 9s to Under 19s, for players aged 7 to 19.",
    league: "Bath and District Youth Cricket League",
    format: "Age-group sides from Under 9 to Under 15, plus an Under 19 T20 team",
    when: "Evenings and weekends in the season",
    about:
      "Junior cricket is the heart of the club, and many of our senior players started here. Get in touch to find the right age group.",
  },
];

/** The club's teams: a list to pick from, with the picked team's details alongside. */
export function Teams() {
  const [selected, setSelected] = useState(0);

  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (selected + step + teams.length) % teams.length;
    setSelected(next);
    document.getElementById(`team-tab-${next}`)?.focus();
  };

  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {/* A scrolling row of pills on phones, a card beside the details on wider screens. */}
      <div
        role="tablist"
        aria-label="Teams"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-1 pb-2 md:mx-0 md:block md:rounded-2xl md:bg-white md:p-4 md:shadow-lg"
      >
        {teams.map((team, i) => (
          <button
            key={team.name}
            id={`team-tab-${i}`}
            role="tab"
            aria-selected={i === selected}
            aria-controls={`team-panel-${i}`}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => setSelected(i)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition md:block md:w-full md:rounded-none md:border-0 md:border-l-4 md:bg-transparent md:py-3 md:text-left ${
              i === selected
                ? "border-brand bg-brand text-white md:border-brand"
                : "border-line bg-white text-brand md:border-transparent md:hover:border-line"
            }`}
          >
            <span className="tracking-wide md:block md:text-brand md:uppercase">{team.name}</span>
            <span className="mt-1 hidden text-sm font-normal text-muted md:block">
              {team.summary}
            </span>
          </button>
        ))}
      </div>

      {teams.map((team, i) => (
        <div
          key={team.name}
          id={`team-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`team-tab-${i}`}
          hidden={i !== selected}
          className="rounded-[2.5rem] bg-radial-[at_30%_20%] from-brand-light to-brand p-8 text-white ring-8 ring-accent-light md:sticky md:top-24 md:p-10"
        >
          <h3 className="font-display text-3xl">{team.name}</h3>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["League", team.league],
              ["Format", team.format],
              ["When", team.when],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold tracking-widest text-accent uppercase">
                  {label}
                </dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 leading-relaxed text-accent-light">{team.about}</p>
          <a
            href={`${club.playCricketUrl}/Teams`}
            className="mt-8 inline-block rounded-full bg-accent px-5 py-2 font-semibold text-brand hover:bg-white"
          >
            Fixtures and results
          </a>
        </div>
      ))}
    </div>
  );
}
