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
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#e3dbc8] p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <SectionEyebrow tone="green">Match schedule</SectionEyebrow>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.045em] sm:text-6xl">
              Every fixture becomes a deadline.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#405143]">
            The real host-site energy comes from countdowns, fixtures, and matchday urgency. Here,
            that U.S. summer rhythm turns into predictions that lock before the first whistle.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_0.42fr]">
          <div className="divide-y divide-[#152016]/12 rounded-[1.5rem] border border-[#152016]/12 bg-[#f8f0df]">
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
        <p className="font-mono text-sm font-black text-[#d24a2a]">{match.date}</p>
        <p className="mt-1 font-mono text-xs font-semibold text-[#405143]">{match.time}</p>
      </div>
      <div>
        <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#1d345e]">
          {match.stage} / {match.matchday}
        </p>
        <p className="mt-1 text-xl font-black tracking-tight">{match.fixture}</p>
      </div>
      <div>
        <p className="text-sm font-bold text-[#152016]">{match.group}</p>
        <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#405143]">
          {match.venue}
        </p>
      </div>
      <span className="w-fit rounded-full border border-[#152016]/15 px-3 py-1 text-xs font-bold text-[#165d4a]">
        {match.status}
      </span>
    </div>
  );
}

function HostModePanel() {
  return (
    <aside className="flex flex-col justify-between rounded-[1.5rem] bg-[#1d345e] p-5 text-[#f8f0df]">
      <div>
        <SectionEyebrow size="xs" tone="cream">
          U.S. host mode
        </SectionEyebrow>
        <p className="mt-5 text-3xl font-black leading-none tracking-[-0.04em]">
          Match nights move across time zones.
        </p>
      </div>
      <p className="mt-8 text-sm leading-6 text-[#dfe7d6]">
        Late kickoffs, early alarms, office pools, group chats, and weekend watch parties all feed
        the same private table.
      </p>
    </aside>
  );
}

function TournamentPhaseRail() {
  return (
    <div className="rounded-[1.5rem] border border-[#152016]/12 bg-[#f8f0df] p-5">
      <SectionEyebrow size="xs" tone="terracotta">
        Tournament path
      </SectionEyebrow>
      <div className="mt-5 grid gap-2 sm:grid-cols-5">
        {tournamentPhases.map((phase, index) => (
          <div
            className={`rounded-2xl px-3 py-3 text-sm font-black ${
              index === 0 ? "bg-[#152016] text-[#f8f0df]" : "bg-[#f5f1e8] text-[#405143]"
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
    <div className="rounded-[1.5rem] bg-[#fff8ec] p-5">
      <SectionEyebrow size="xs" tone="navy">
        Host-city rail
      </SectionEyebrow>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {hostCities.map((city) => (
          <span
            className="shrink-0 rounded-full border border-[#1d345e]/18 bg-[#f5f1e8] px-4 py-2 text-sm font-bold text-[#263b62]"
            key={city}
          >
            {city}
          </span>
        ))}
      </div>
    </div>
  );
}
