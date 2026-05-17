import { SectionEyebrow } from "./SectionEyebrow";
import type { Match } from "./types";

type MatchScheduleSectionProps = {
  matches: Match[];
};

const tournamentPhases = ["Group Stage", "Round of 32", "Round of 16", "Quarterfinals", "Final"];
const hostCities = ["NY/NJ", "Miami", "Dallas", "Kansas City", "Seattle", "Los Angeles"];

export function MatchScheduleSection({ matches }: MatchScheduleSectionProps) {
  return (
    <section className="px-5 pb-24 sm:px-8 lg:px-10" id="matches">
      <div className="mx-auto max-w-7xl rounded-shell bg-muted-surface p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <SectionEyebrow tone="green">Match schedule</SectionEyebrow>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-display sm:text-6xl">
              Every fixture becomes a deadline.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            The real host-site energy comes from countdowns, fixtures, and matchday urgency. Here,
            that U.S. summer rhythm turns into predictions that lock before the first whistle.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
          <div className="divide-y divide-ink/12 rounded-panel border border-ink/12 bg-cream">
            {matches.map((match) => (
              <MatchRow match={match} key={match.fixture} />
            ))}
          </div>
          <HostModePanel />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <TournamentPhaseRail />
          <HostCityRail />
        </div>
      </div>
    </section>
  );
}

type MatchRowProps = {
  match: Match;
};

function MatchRow({ match }: MatchRowProps) {
  return (
    <div className="grid gap-4 px-5 py-5 sm:grid-cols-[0.7fr_1fr_1.1fr_auto] sm:items-center">
      <div>
        <p className="font-mono text-sm font-black text-terracotta">{match.date}</p>
        <p className="mt-1 font-mono text-xs font-semibold text-muted">{match.time}</p>
      </div>
      <div>
        <p className="font-mono text-xs font-black uppercase tracking-label text-navy">
          {match.stage} / {match.matchday}
        </p>
        <p className="mt-1 text-xl font-black tracking-tight">{match.fixture}</p>
      </div>
      <div>
        <p className="text-sm font-bold text-ink">{match.group}</p>
        <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-label text-muted">
          {match.venue}
        </p>
      </div>
      <span className="w-fit rounded-full border border-ink/15 px-3 py-1 text-xs font-bold text-green">
        {match.status}
      </span>
    </div>
  );
}

function HostModePanel() {
  return (
    <aside className="flex flex-col justify-between rounded-panel bg-navy p-5 text-cream">
      <div>
        <SectionEyebrow size="xs" tone="cream">
          U.S. host mode
        </SectionEyebrow>
        <p className="mt-5 text-3xl font-black leading-none tracking-display">
          Match nights move across time zones.
        </p>
      </div>
      <p className="mt-8 text-sm leading-6 text-mint">
        Late kickoffs, early alarms, office pools, group chats, and weekend watch parties all feed
        the same private table.
      </p>
    </aside>
  );
}

function TournamentPhaseRail() {
  return (
    <div className="rounded-panel border border-ink/12 bg-cream p-5">
      <SectionEyebrow size="xs" tone="terracotta">
        Tournament path
      </SectionEyebrow>
      <div className="mt-5 grid gap-2 sm:grid-cols-5">
        {tournamentPhases.map((phase, index) => (
          <div
            className={`rounded-2xl px-3 py-3 text-sm font-black ${
              index === 0 ? "bg-ink text-cream" : "bg-canvas text-muted"
            }`}
            key={phase}
          >
            {phase}
          </div>
        ))}
      </div>
    </div>
  );
}

function HostCityRail() {
  return (
    <div className="rounded-panel bg-surface p-5">
      <SectionEyebrow size="xs" tone="navy">
        Host-city rail
      </SectionEyebrow>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {hostCities.map((city) => (
          <span
            className="shrink-0 rounded-full border border-navy/18 bg-canvas px-4 py-2 text-sm font-bold text-ocean-ink"
            key={city}
          >
            {city}
          </span>
        ))}
      </div>
    </div>
  );
}
