import type { LeaderboardPlayer } from "./types";

type PredictionPreviewProps = {
  players: LeaderboardPlayer[];
};

export function PredictionPreview({ players }: PredictionPreviewProps) {
  return (
    <div className="relative">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#d24a2a]/20 blur-2xl" />
      <div className="rounded-[2rem] border border-[#152016]/15 bg-[#163427] p-3 shadow-[0_36px_90px_-45px_rgba(21,32,22,0.95)]">
        <div className="rounded-[1.55rem] bg-[#f8f0df] p-5">
          <div className="flex items-center justify-between border-b border-[#152016]/10 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d24a2a]">
                Group code
              </p>
              <p className="mt-1 font-mono text-2xl font-black tracking-tight">ORANJE-26</p>
            </div>
            <div className="rounded-full bg-[#dfe8d3] px-3 py-1 text-xs font-bold text-[#165d4a]">
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
    <div className="rounded-[1.25rem] bg-[#152016] p-5 text-[#f8f0df]">
      <p className="font-mono text-sm text-[#cdddbb]">New York/New Jersey, 18:00</p>
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <ScoreBox team="Brazil" score="2" />
        <span className="pt-8 text-[#cdddbb]">:</span>
        <ScoreBox team="Morocco" score="1" />
      </div>
      <button className="mt-5 w-full rounded-full bg-[#d24a2a] px-4 py-3 text-sm font-black text-[#fff8ec] transition-transform hover:-translate-y-0.5 active:translate-y-0">
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
      <p className="mt-2 rounded-2xl bg-[#f8f0df] py-3 text-center font-mono text-4xl font-black text-[#152016]">
        {score}
      </p>
    </div>
  );
}

function PointsSummaryCard() {
  return (
    <div className="rounded-[1.25rem] border border-[#152016]/10 bg-[#fff8ec] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#405143]">Points</p>
      <p className="mt-4 font-mono text-6xl font-black tracking-tighter text-[#165d4a]">47</p>
      <p className="mt-3 text-sm leading-6 text-[#405143]">
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
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-[#152016]/10 bg-[#fff8ec]/70 px-4 py-3"
          key={player.rank}
        >
          <span className="font-mono text-xs font-black text-[#d24a2a]">{player.rank}</span>
          <span className="font-semibold">{player.name}</span>
          <span className="font-mono text-sm font-black">{player.points} pts</span>
        </div>
      ))}
    </div>
  );
}
