import { club } from '@club/shared/club';
import { ButtonLink, ListDetail } from '@club/shared/ui';

interface Team {
  about: string;
  format: string;
  league: string;
  name: string;
  summary: string;
  when: string;
}

// Edit this list as teams change. League details are from the club's Play-Cricket site.
const teams: Team[] = [
  {
    about:
      'Promoted in 2026 after finishing second in Division Three. Home games are at Bloomfield Rise.',
    format: '40-over league matches',
    league: 'Bristol & District Cricket Association, Division Three',
    name: 'Saturday 1st XI',
    summary: 'Our top side, playing league cricket on Saturdays.',
    when: 'Saturdays, usually 1pm',
  },
  {
    about: 'Runners-up in Division Seven East in 2026, where only the champions go up.',
    format: '40-over league matches',
    league: 'Bristol & District Cricket Association, Division Seven East',
    name: 'Saturday 2nd XI',
    summary: 'Competitive league cricket and a step up to the 1st XI.',
    when: 'Saturdays, usually 1pm',
  },
  {
    about: 'Division Nine East champions in 2026, and promoted for next season.',
    format: 'League matches',
    league: 'Bristol & District Cricket Association, Division Nine East',
    name: 'Saturday 3rd XI',
    summary: 'League cricket for developing and returning players.',
    when: 'Saturdays',
  },
  {
    about: 'A good way into senior cricket at the club. Ask us about getting a game.',
    format: 'Saturday matches',
    league: 'Fixtures listed on Play-Cricket',
    name: 'Saturday 4th XI',
    summary: 'Another Saturday side, so more members get a game.',
    when: 'Saturdays',
  },
  {
    about: 'Promoted in 2026 after finishing second in their division.',
    format: '40-over league matches',
    league: 'North Somerset League, Sunday Conference Division Three',
    name: 'Sunday XI',
    summary: 'Sunday league cricket in North Somerset.',
    when: 'Sundays',
  },
  {
    about:
      "The Women's 1st XI played their first ever home match at Bloomfield Rise in 2026. New players are always welcome, whether or not you've played before.",
    format: 'Short formats, including pairs cricket',
    league: 'Friendly and festival matches',
    name: 'Women',
    summary: "Our growing women's section, open to all abilities.",
    when: 'Weekends through the summer',
  },
  {
    about:
      'Junior cricket is the heart of the club, and many of our senior players started here. Get in touch to find the right age group.',
    format: 'Age-group sides from Under 9 to Under 15, plus an Under 19 T20 team',
    league: 'Bath and District Youth Cricket League',
    name: 'Juniors',
    summary: 'Under 9s to Under 19s, for players aged 7 to 19.',
    when: 'Evenings and weekends in the season',
  },
];

/** The club's teams: a list to pick from, with the picked team's details alongside. */
export function Teams() {
  return (
    <ListDetail
      label="Teams"
      items={teams.map((team) => ({
        content: (
          <>
            <h3 className="font-display text-2xl sm:text-3xl">{team.name}</h3>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['League', team.league],
                ['Format', team.format],
                ['When', team.when],
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
            <ButtonLink href={`${club.playCricketUrl}/Teams`} variant="light" className="mt-8">
              Fixtures and results
            </ButtonLink>
          </>
        ),
        description: team.summary,
        id: team.name,
        label: team.name,
      }))}
    />
  );
}
