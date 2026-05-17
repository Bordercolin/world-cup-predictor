import { redirect } from "next/navigation";
import { logout } from "./actions";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const openPredictions = [
  {
    fixture: "Brazil vs Morocco",
    stage: "Group Stage",
    matchday: "Matchday 1",
    group: "Group C",
    venue: "NY/NJ",
    lock: "18:00 ET",
    pick: "2-1",
  },
  {
    fixture: "France vs Senegal",
    stage: "Group Stage",
    matchday: "Matchday 1",
    group: "Group D",
    venue: "Los Angeles",
    lock: "15:00 PT",
    pick: "Not set",
  },
  {
    fixture: "Norway vs Senegal",
    stage: "Group Stage",
    matchday: "Matchday 2",
    group: "Group D",
    venue: "Seattle",
    lock: "20:00 PT",
    pick: "1-1",
  },
];

const groups = [
  { name: "Office Sweep", members: "18", rank: "2nd", code: "ORANJE-26" },
  { name: "Sunday Five-a-side", members: "12", rank: "1st", code: "NORTH-11" },
];

const leaderboard = [
  { rank: "01", name: "Mara De Wit", points: "47", movement: "+9" },
  { rank: "02", name: "You", points: "43", movement: "+6" },
  { rank: "03", name: "Nina Hofstad", points: "39", movement: "+7" },
  { rank: "04", name: "Olivier Mensah", points: "34", movement: "+3" },
];

const hostCities = ["All", "NY/NJ", "Miami", "Dallas", "Kansas City", "Seattle", "Los Angeles"];

const worldCupGroups = [
  {
    group: "Group C",
    teams: [
      { name: "Brazil", pts: 6, status: "Qualified" },
      { name: "Morocco", pts: 4, status: "In play" },
      { name: "Japan", pts: 1, status: "In play" },
      { name: "Canada", pts: 0, status: "Eliminated" },
    ],
  },
  {
    group: "Group D",
    teams: [
      { name: "France", pts: 4, status: "In play" },
      { name: "Senegal", pts: 4, status: "In play" },
      { name: "Norway", pts: 3, status: "In play" },
      { name: "Chile", pts: 0, status: "Eliminated" },
    ],
  },
];

const knockoutPath = ["Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "Final"];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/home");
  }

  const displayName =
    typeof user.user_metadata.display_name === "string"
      ? user.user_metadata.display_name
      : user.email?.split("@")[0] ?? "Player";

  return (
    <main className="min-h-[100dvh] bg-[#f5f1e8] px-5 py-6 text-[#152016] sm:px-8 lg:px-10">
      <header className="mx-auto flex max-w-7xl flex-col gap-4 rounded-[1.5rem] border border-[#152016]/12 bg-[#fff8ec]/80 px-5 py-4 shadow-[0_24px_80px_-58px_rgba(21,32,22,0.7)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#1d345e]">
            Signed in as {user.email}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
            Welcome back, {displayName}
          </h1>
        </div>
        <form action={logout}>
          <button
            className="rounded-full border border-[#152016]/15 bg-[#f5f1e8] px-5 py-3 text-sm font-bold text-[#152016] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 py-10 lg:grid-cols-[1fr_0.42fr]">
        <div className="rounded-[2rem] bg-[#152016] p-6 text-[#f8f0df] sm:p-8">
          <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-[#cdddbb]">
            Group Stage / Matchday 1
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-5xl font-black leading-none tracking-[-0.055em] sm:text-7xl">
                Brazil vs Morocco
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#dfe7d6]">
                Your current pick is saved as Brazil 2, Morocco 1 at NY/NJ. You can edit until
                kickoff.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#f8f0df] p-5 text-[#152016]">
              <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#405143]">
                Locks in
              </p>
              <p className="mt-3 font-mono text-5xl font-black tracking-tighter">03:42</p>
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-[#d24a2a] p-6 text-[#fff8ec] sm:p-8">
          <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-[#ffe0c8]">
            Quick actions
          </p>
          <div className="mt-8 grid gap-3">
            <button
              className="cursor-not-allowed rounded-full bg-[#fff8ec] px-5 py-3 text-sm font-black text-[#152016] opacity-75"
              disabled
              type="button"
            >
              Create group
            </button>
            <button
              className="cursor-not-allowed rounded-full border border-[#fff8ec]/45 px-5 py-3 text-sm font-black text-[#fff8ec] opacity-75"
              disabled
              type="button"
            >
              Join with invite code
            </button>
          </div>
          <p className="mt-6 text-sm leading-6 text-[#ffe0c8]">
            Group creation and invite-code joining are the next backend tables to connect.
          </p>
        </aside>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 pb-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[#152016]/12 bg-[#fff8ec] p-6 sm:p-8">
          <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-[#d24a2a]">
            World Cup structure
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {worldCupGroups.map((group) => (
              <article className="rounded-[1.5rem] bg-[#f5f1e8] p-5" key={group.group}>
                <h2 className="text-2xl font-black tracking-tight">{group.group}</h2>
                <div className="mt-5 space-y-2">
                  {group.teams.map((team) => (
                    <div
                      className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-2xl bg-[#fff8ec] px-4 py-3"
                      key={team.name}
                    >
                      <span className="font-bold">{team.name}</span>
                      <span className="font-mono text-sm font-black">{team.pts} pts</span>
                      <span className="rounded-full border border-[#152016]/10 px-2.5 py-1 text-xs font-bold text-[#405143]">
                        {team.status}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#1d345e] p-6 text-[#f8f0df] sm:p-8">
          <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-[#d9e3cf]">
            Knockout bracket
          </p>
          <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.045em]">
            Group predictions turn into a bracket path.
          </h2>
          <div className="mt-8 grid gap-3">
            {knockoutPath.map((phase, index) => (
              <div
                className={`rounded-2xl px-4 py-3 font-bold ${
                  index === knockoutPath.length - 1
                    ? "bg-[#f8f0df] text-[#152016]"
                    : "border border-[#f8f0df]/14 bg-[#f8f0df]/8"
                }`}
                key={phase}
              >
                {phase}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 pb-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-[#152016]/12 bg-[#fff8ec] p-6 sm:p-8">
          <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-[#d24a2a]">
            Your groups
          </p>
          <div className="mt-8 grid gap-4">
            {groups.map((group) => (
              <article
                className="rounded-[1.25rem] bg-[#f5f1e8] p-5"
                key={group.code}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">{group.name}</h2>
                    <p className="mt-2 text-sm text-[#405143]">
                      {group.members} players, currently {group.rank}
                    </p>
                  </div>
                  <p className="font-mono text-xs font-black text-[#1d345e]">{group.code}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#e3dbc8] p-6 sm:p-8">
          <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-[#165d4a]">
            Open predictions
          </p>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {hostCities.map((city) => (
              <span
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                  city === "All"
                    ? "bg-[#152016] text-[#f8f0df]"
                    : "border border-[#1d345e]/18 bg-[#fff8ec] text-[#263b62]"
                }`}
                key={city}
              >
                {city}
              </span>
            ))}
          </div>
          <div className="mt-8 divide-y divide-[#152016]/12 rounded-[1.5rem] bg-[#f8f0df]">
            {openPredictions.map((prediction) => (
              <div
                className="grid gap-3 px-5 py-5 sm:grid-cols-[1.1fr_0.7fr_0.6fr_auto] sm:items-center"
                key={prediction.fixture}
              >
                <div>
                  <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-[#1d345e]">
                    {prediction.stage} / {prediction.matchday}
                  </p>
                  <p className="mt-1 text-lg font-black tracking-tight">{prediction.fixture}</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{prediction.group}</p>
                  <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#405143]">
                    {prediction.venue}
                  </p>
                </div>
                <p className="font-mono text-sm font-semibold text-[#405143]">
                  {prediction.lock}
                </p>
                <span className="w-fit rounded-full border border-[#152016]/15 px-3 py-1 text-xs font-bold text-[#165d4a]">
                  {prediction.pick}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 pb-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] bg-[#165d4a] p-6 text-[#f8f0df] sm:p-8">
          <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-[#cdddbb]">
            Group leaderboard
          </p>
          <div className="mt-8 space-y-3">
            {leaderboard.map((player) => (
              <div
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 rounded-2xl border border-[#f8f0df]/12 bg-[#f8f0df]/8 px-4 py-4"
                key={player.rank}
              >
                <span className="font-mono text-sm font-black text-[#e8d8bb]">{player.rank}</span>
                <span className="font-bold">{player.name}</span>
                <span className="font-mono text-lg font-black">{player.points}</span>
                <span className="rounded-full bg-[#f8f0df] px-2.5 py-1 font-mono text-xs font-black text-[#165d4a]">
                  {player.movement}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#152016]/12 bg-[#fff8ec] p-6 sm:p-8">
          <p className="font-mono text-sm font-black uppercase tracking-[0.24em] text-[#d24a2a]">
            Scoring
          </p>
          <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.045em]">
            43 points, with 2 exact scores and a 3-match streak.
          </h2>
          <div className="mt-8 grid gap-3">
            {["Exact score: 5 pts", "Correct result: 3 pts", "Goal difference: 1 pt"].map(
              (rule) => (
                <div className="rounded-2xl bg-[#f5f1e8] px-4 py-3 font-semibold" key={rule}>
                  {rule}
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
