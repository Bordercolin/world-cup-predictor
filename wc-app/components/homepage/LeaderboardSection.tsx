import { SectionEyebrow } from "./SectionEyebrow";
import type { LeaderboardPlayer } from "./types";

type LeaderboardSectionProps = {
  players: LeaderboardPlayer[];
  scoringRules: string[];
};

export function LeaderboardSection({ players, scoringRules }: LeaderboardSectionProps) {
  return (
    <section
      className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10"
      id="leaderboard"
    >
      <LeaderboardCard players={players} />
      <ScoringRulesCard rules={scoringRules} />
    </section>
  );
}

type LeaderboardCardProps = {
  players: LeaderboardPlayer[];
};

function LeaderboardCard({ players }: LeaderboardCardProps) {
  return (
    <div className="rounded-shell bg-green p-6 text-cream sm:p-8">
      <SectionEyebrow tone="cream">Live leaderboard</SectionEyebrow>
      <div className="mt-10 space-y-3">
        {players.map((player) => (
          <LeaderboardRow player={player} key={player.rank} />
        ))}
      </div>
    </div>
  );
}

type LeaderboardRowProps = {
  player: LeaderboardPlayer;
};

function LeaderboardRow({ player }: LeaderboardRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 rounded-2xl border border-cream/12 bg-cream/8 px-4 py-4">
      <span className="font-mono text-sm font-black text-sand">{player.rank}</span>
      <span className="font-bold">{player.name}</span>
      <span className="font-mono text-lg font-black">{player.points}</span>
      <span className="rounded-full bg-cream px-2.5 py-1 font-mono text-xs font-black text-green">
        {player.form}
      </span>
    </div>
  );
}

type ScoringRulesCardProps = {
  rules: string[];
};

function ScoringRulesCard({ rules }: ScoringRulesCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-shell border border-ink/12 bg-surface p-6 sm:p-8">
      <div>
        <SectionEyebrow>Scoring rules</SectionEyebrow>
        <h2 className="mt-4 text-4xl font-black leading-none tracking-display">
          Simple enough for everyone, sharp enough to argue about.
        </h2>
      </div>
      <div className="mt-10 grid gap-3">
        {rules.map((rule) => (
          <div
            className="rounded-2xl border border-ink/10 bg-canvas px-4 py-3 font-semibold"
            key={rule}
          >
            {rule}
          </div>
        ))}
      </div>
    </div>
  );
}
