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
    <div className="rounded-[2rem] bg-[#165d4a] p-6 text-[#f8f0df] sm:p-8">
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
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 rounded-2xl border border-[#f8f0df]/12 bg-[#f8f0df]/8 px-4 py-4">
      <span className="font-mono text-sm font-black text-[#e8d8bb]">{player.rank}</span>
      <span className="font-bold">{player.name}</span>
      <span className="font-mono text-lg font-black">{player.points}</span>
      <span className="rounded-full bg-[#f8f0df] px-2.5 py-1 font-mono text-xs font-black text-[#165d4a]">
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
    <div className="flex flex-col justify-between rounded-[2rem] border border-[#152016]/12 bg-[#fff8ec] p-6 sm:p-8">
      <div>
        <SectionEyebrow>Scoring rules</SectionEyebrow>
        <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.045em]">
          Simple enough for everyone, sharp enough to argue about.
        </h2>
      </div>
      <div className="mt-10 grid gap-3">
        {rules.map((rule) => (
          <div
            className="rounded-2xl border border-[#152016]/10 bg-[#f5f1e8] px-4 py-3 font-semibold"
            key={rule}
          >
            {rule}
          </div>
        ))}
      </div>
    </div>
  );
}
