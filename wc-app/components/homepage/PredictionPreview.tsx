import type { LeaderboardPlayer } from "./types";

type PredictionPreviewProps = {
  players: LeaderboardPlayer[];
};

export function PredictionPreview({ players }: PredictionPreviewProps) {
  return (
    <div className="relative">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-terracotta/20 blur-2xl" />
      <div className="rounded-shell border border-ink/15 bg-pitch p-3 shadow-feature">
        <div className="rounded-panel bg-cream p-5">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-eyebrow text-terracotta">
                Group code
              </p>
              <p className="mt-1 font-mono text-2xl font-black tracking-tight">ORANJE-26</p>
            </div>
            <div className="rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-green">
              18 players
            </div>
          </div>

          <div className="grid gap-4 py-5 sm:grid-cols-[1fr_0.8fr]">
            <ScorePredictionCard />
            <PointsSummaryCard />
          </div>

          <MiniLeaderboard players={players.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}

function ScorePredictionCard() {
  return (
    <div className="rounded-tile bg-ink p-5 text-cream">
      <p className="font-mono text-sm text-sage">New York/New Jersey, 18:00</p>
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <ScoreBox team="Brazil" score="2" />
        <span className="pt-8 text-sage">:</span>
        <ScoreBox team="Morocco" score="1" />
      </div>
      <button className="mt-5 w-full rounded-full bg-terracotta px-4 py-3 text-sm font-black text-surface transition-transform hover:-translate-y-0.5 active:translate-y-0">
        Save prediction
      </button>
    </div>
  );
}

type ScoreBoxProps = {
  team: string;
  score: string;
};

function ScoreBox({ team, score }: ScoreBoxProps) {
  return (
    <div>
      <p className="text-sm font-bold">{team}</p>
      <p className="mt-2 rounded-2xl bg-cream py-3 text-center font-mono text-4xl font-black text-ink">
        {score}
      </p>
    </div>
  );
}

function PointsSummaryCard() {
  return (
    <div className="rounded-tile border border-ink/10 bg-surface p-5">
      <p className="text-xs font-bold uppercase tracking-eyebrow text-muted">Points</p>
      <p className="mt-4 font-mono text-6xl font-black tracking-tighter text-green">47</p>
      <p className="mt-3 text-sm leading-6 text-muted">
        Exact score, result, and bonus streaks keep the race moving.
      </p>
    </div>
  );
}

type MiniLeaderboardProps = {
  players: LeaderboardPlayer[];
};

function MiniLeaderboard({ players }: MiniLeaderboardProps) {
  return (
    <div className="space-y-3">
      {players.map((player) => (
        <div
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-ink/10 bg-surface/70 px-4 py-3"
          key={player.rank}
        >
          <span className="font-mono text-xs font-black text-terracotta">{player.rank}</span>
          <span className="font-semibold">{player.name}</span>
          <span className="font-mono text-sm font-black">{player.points} pts</span>
        </div>
      ))}
    </div>
  );
}
