import { logout } from "@/app/home/actions";

type HomeDashboardProps = {
  displayName: string;
  email?: string;
};

type Tone = "terracotta" | "green" | "cream" | "navy";
type PillIntent = "neutral" | "good" | "warn" | "dark";

const profileStats = [
  { label: "Total points", value: "43", detail: "+6 this matchday" },
  { label: "Group rank", value: "02", detail: "Office Sweep" },
  { label: "Exact scores", value: "2", detail: "From 7 locked picks" },
  { label: "Power-ups left", value: "3", detail: "One 2x still unused" },
];

const focusMatch = {
  homeTeam: "Brazil",
  awayTeam: "Morocco",
  stage: "Group Stage",
  matchday: "Matchday 1",
  kickoff: "18:00 ET",
  lockWindow: "03:42",
  pick: { home: "2", away: "1" },
  powerUp: "2x points",
  basePoints: "5",
  boostedPoints: "10",
};

const openPredictions = [
  {
    id: "bra-mar",
    homeTeam: "Brazil",
    awayTeam: "Morocco",
    stage: "Group Stage",
    matchday: "Matchday 1",
    group: "Group C",
    venue: "NY/NJ",
    lock: "18:00 ET",
    pick: "2-1",
    powerUp: "2x points",
    status: "Ready",
  },
  {
    id: "fra-sen",
    homeTeam: "France",
    awayTeam: "Senegal",
    stage: "Group Stage",
    matchday: "Matchday 1",
    group: "Group D",
    venue: "Los Angeles",
    lock: "15:00 PT",
    pick: "Not set",
    powerUp: "None",
    status: "Needs pick",
  },
  {
    id: "nor-sen",
    homeTeam: "Norway",
    awayTeam: "Senegal",
    stage: "Group Stage",
    matchday: "Matchday 2",
    group: "Group D",
    venue: "Seattle",
    lock: "20:00 PT",
    pick: "1-1",
    powerUp: "Underdog boost",
    status: "Draft",
  },
  {
    id: "ecu-ger",
    homeTeam: "Ecuador",
    awayTeam: "Germany",
    stage: "Group Stage",
    matchday: "Matchday 3",
    group: "Group E",
    venue: "Dallas",
    lock: "16:00 CT",
    pick: "Not set",
    powerUp: "None",
    status: "Open",
  },
];

const groups = [
  { name: "Office Sweep", members: "18", rank: "2nd", code: "ORANJE-26", points: "614" },
  { name: "Sunday Five-a-side", members: "12", rank: "1st", code: "NORTH-11", points: "391" },
];

const leaderboard = [
  { rank: "01", name: "Mara De Wit", points: "47", movement: "+9", form: "Exact score" },
  { rank: "02", name: "You", points: "43", movement: "+6", form: "2x active" },
  { rank: "03", name: "Nina Hofstad", points: "39", movement: "+7", form: "Streak 3" },
  { rank: "04", name: "Olivier Mensah", points: "34", movement: "+3", form: "Result hit" },
  { rank: "05", name: "Talia Okafor", points: "31", movement: "+1", form: "Locked in" },
];

const powerUps = [
  {
    name: "2x points",
    code: "double_points",
    description: "Double the points earned by one prediction.",
    count: "1",
    state: "Available",
  },
  {
    name: "Underdog boost",
    code: "underdog_boost",
    description: "Multiply points when the lower-ranked side gets a result.",
    count: "1",
    state: "Queued",
  },
  {
    name: "Safety net",
    code: "safety_net",
    description: "Protect one close miss from dropping to zero points.",
    count: "1",
    state: "Available",
  },
];

const rivals = [
  { name: "Mara De Wit", gap: "-4 pts", note: "Leader in Office Sweep" },
  { name: "Nina Hofstad", gap: "+4 pts", note: "Chasing your second spot" },
];

const scoringRules = [
  { label: "Exact score", value: "5 pts" },
  { label: "Correct result", value: "3 pts" },
  { label: "Goal difference", value: "1 pt" },
  { label: "2x power-up", value: "Double awarded points" },
];

const timeline = [
  { time: "14:20", event: "Brazil 2-1 Morocco draft saved", tone: "Prediction" },
  { time: "13:05", event: "2x points assigned to Brazil vs Morocco", tone: "Power-up" },
  { time: "Yesterday", event: "France vs Senegal opened for Matchday 1", tone: "Fixture" },
];

const toneClasses: Record<Tone, string> = {
  terracotta: "text-terracotta",
  green: "text-green",
  cream: "text-sage",
  navy: "text-navy",
};

const pillClasses: Record<PillIntent, string> = {
  neutral: "border-ink/12 bg-surface text-muted",
  good: "border-green/18 bg-mint text-green",
  warn: "border-terracotta/18 bg-warning text-warning-ink",
  dark: "border-cream/15 bg-cream/10 text-cream",
};

function SectionLabel({ children, tone = "terracotta" }: { children: React.ReactNode; tone?: Tone }) {
  return <p className={`eyebrow ${toneClasses[tone]}`}>{children}</p>;
}

function StatusPill({
  children,
  intent = "neutral",
}: {
  children: React.ReactNode;
  intent?: PillIntent;
}) {
  return (
    <span className={`ui-label w-fit rounded-full border px-3 py-1 ${pillClasses[intent]}`}>
      {children}
    </span>
  );
}

function DisabledAction({
  children,
  variant = "light",
}: {
  children: React.ReactNode;
  variant?: "light" | "dark";
}) {
  const variantClass =
    variant === "dark"
      ? "border-ink/15 bg-ink text-surface opacity-65"
      : "border-ink/12 bg-surface text-ink opacity-75";

  return (
    <button
      className={`cursor-not-allowed rounded-full border px-5 py-3 text-sm font-black transition-transform active:scale-[0.98] ${variantClass}`}
      disabled
      type="button"
    >
      {children}
    </button>
  );
}

export function HomeDashboard({ displayName, email }: HomeDashboardProps) {
  return (
    <main className="app-page px-4 py-5 text-ink sm:px-6 lg:px-8" id="main-content">
      <div className="mx-auto max-w-[1400px]">
        <DashboardHeader displayName={displayName} email={email} />
        <StatsGrid />
        <HeroPrediction />
        <PredictionAndPowerUps />
        <GroupsLeaderboardAndRivals />
        <ScoringAndBackendStatus />
      </div>
    </main>
  );
}

function DashboardHeader({ displayName, email }: HomeDashboardProps) {
  return (
    <header className="flex flex-col gap-4 rounded-shell border border-ink/12 bg-surface/82 px-4 py-4 shadow-dashboard sm:px-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-green font-mono text-sm font-black text-cream">
          PC
        </div>
        <div>
          <p className="eyebrow-xs text-navy">Prono Club dashboard</p>
          <h1 className="mt-1 text-2xl font-black tracking-display sm:text-3xl">
            Welcome back, {displayName}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="rounded-full border border-ink/10 bg-canvas px-4 py-2">
          <p className="ui-label text-muted">Signed in</p>
          <p className="max-w-[15rem] truncate text-sm font-bold text-ink">{email}</p>
        </div>
        <form action={logout}>
          <button
            className="w-full rounded-full border border-ink/15 bg-ink px-5 py-3 text-sm font-black text-surface transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}

function StatsGrid() {
  return (
    <section className="grid gap-4 py-6 sm:grid-cols-2 xl:grid-cols-4">
      {profileStats.map((stat) => (
        <article
          className="rounded-panel border border-ink/10 bg-surface p-5 shadow-stat"
          key={stat.label}
        >
          <p className="ui-label text-muted">{stat.label}</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="font-mono text-4xl font-black tracking-number">{stat.value}</p>
            <p className="max-w-28 text-right text-sm font-semibold leading-5 text-muted">
              {stat.detail}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}

function HeroPrediction() {
  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
      <article className="overflow-hidden rounded-shell bg-ink text-cream shadow-feature">
        <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_20rem]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <SectionLabel tone="cream">
                {focusMatch.stage} / {focusMatch.matchday}
              </SectionLabel>
              <StatusPill intent="dark">Locks {focusMatch.kickoff}</StatusPill>
            </div>
            <h2 className="mt-8 max-w-3xl text-5xl font-black leading-none tracking-hero sm:text-7xl">
              {focusMatch.homeTeam} vs {focusMatch.awayTeam}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-mint sm:text-lg">
              Your headline pick is staged here. The scoring engine is not connected yet, so these
              controls show the intended prediction and power-up flow without writing to Supabase.
            </p>
          </div>

          <aside className="rounded-panel bg-cream p-5 text-ink">
            <SectionLabel tone="navy">Prediction lock</SectionLabel>
            <p className="mt-3 font-mono text-5xl font-black tracking-number">
              {focusMatch.lockWindow}
            </p>
            <p className="mt-3 text-sm font-semibold leading-6 text-muted">
              Server-side lock rules should use `matches.kickoff_time` when prediction writes are
              connected.
            </p>
          </aside>
        </div>

        <div className="grid gap-px bg-cream/12 lg:grid-cols-[1fr_0.85fr_0.85fr]">
          <div className="bg-ink p-6 sm:p-8">
            <SectionLabel tone="cream">Score pick</SectionLabel>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <ScoreTile team={focusMatch.homeTeam} score={focusMatch.pick.home} />
              <span className="font-mono text-sm font-black text-sage">VS</span>
              <ScoreTile team={focusMatch.awayTeam} score={focusMatch.pick.away} />
            </div>
          </div>

          <div className="bg-ink p-6 sm:p-8">
            <SectionLabel tone="cream">Power-up</SectionLabel>
            <div className="mt-5 rounded-tile border border-cream/14 bg-cream/9 p-5">
              <p className="text-2xl font-black tracking-tight">{focusMatch.powerUp}</p>
              <p className="mt-3 text-sm leading-6 text-mint">
                Exact score would move from {focusMatch.basePoints} to {focusMatch.boostedPoints}{" "}
                points.
              </p>
            </div>
          </div>

          <div className="bg-ink p-6 sm:p-8">
            <SectionLabel tone="cream">Actions</SectionLabel>
            <div className="mt-5 grid gap-3">
              <button
                className="cursor-not-allowed rounded-full bg-terracotta px-5 py-3 text-sm font-black text-surface opacity-75"
                disabled
                type="button"
              >
                Save prediction soon
              </button>
              <p className="text-sm leading-6 text-sage">
                Prediction writes need authenticated profile mapping, match reads, and power-up
                transactions before this can be enabled.
              </p>
            </div>
          </div>
        </div>
      </article>

      <aside className="grid gap-5">
        <QuickSetupCard />
        <ActivityCard />
      </aside>
    </section>
  );
}

function ScoreTile({ team, score }: { team: string; score: string }) {
  return (
    <div className="rounded-tile bg-cream/9 p-4">
      <p className="text-sm font-bold text-sage">{team}</p>
      <p className="mt-3 font-mono text-5xl font-black tracking-number">{score}</p>
    </div>
  );
}

function QuickSetupCard() {
  return (
    <section className="rounded-shell bg-terracotta p-6 text-surface sm:p-7">
      <SectionLabel tone="cream">Quick setup</SectionLabel>
      <h2 className="mt-4 text-3xl font-black leading-none tracking-display">
        Group actions are next in the backend queue.
      </h2>
      <div className="mt-6 grid gap-3">
        <DisabledAction>Create group</DisabledAction>
        <button
          className="cursor-not-allowed rounded-full border border-surface/45 px-5 py-3 text-sm font-black text-surface opacity-75 transition-transform active:scale-[0.98]"
          disabled
          type="button"
        >
          Join with invite code
        </button>
      </div>
    </section>
  );
}

function ActivityCard() {
  return (
    <section className="rounded-shell border border-ink/10 bg-surface p-6 sm:p-7">
      <SectionLabel>Latest activity</SectionLabel>
      <div className="mt-5 divide-y divide-ink/10">
        {timeline.map((item) => (
          <div
            className="grid grid-cols-[4.5rem_1fr] gap-4 py-4 first:pt-0 last:pb-0"
            key={`${item.time}-${item.event}`}
          >
            <p className="font-mono text-xs font-black uppercase tracking-data text-navy">
              {item.time}
            </p>
            <div>
              <p className="font-semibold leading-6">{item.event}</p>
              <p className="mt-1 ui-label text-muted">{item.tone}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PredictionAndPowerUps() {
  return (
    <section className="grid gap-5 py-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(22rem,0.82fr)]">
      <OpenPredictionsCard />
      <PowerUpsCard />
    </section>
  );
}

function OpenPredictionsCard() {
  return (
    <article className="rounded-shell bg-muted-surface p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel tone="green">Open predictions</SectionLabel>
          <h2 className="mt-3 text-3xl font-black tracking-display">
            Make the next four calls before kickoff.
          </h2>
        </div>
        <StatusPill intent="neutral">Demo data</StatusPill>
      </div>

      <div className="mt-6 overflow-hidden rounded-panel border border-ink/10 bg-surface">
        {openPredictions.map((prediction) => (
          <div
            className="grid gap-4 border-b border-ink/10 px-5 py-5 last:border-b-0 lg:grid-cols-[1.15fr_0.55fr_0.5fr_0.6fr_auto] lg:items-center"
            key={prediction.id}
          >
            <div>
              <p className="ui-label text-navy">
                {prediction.stage} / {prediction.matchday}
              </p>
              <p className="mt-1 text-xl font-black tracking-tight">
                {prediction.homeTeam} vs {prediction.awayTeam}
              </p>
            </div>
            <div>
              <p className="text-sm font-black">{prediction.group}</p>
              <p className="ui-label mt-1 text-muted">{prediction.venue}</p>
            </div>
            <p className="font-mono text-sm font-black text-muted">{prediction.lock}</p>
            <div>
              <p className="text-sm font-black">{prediction.pick}</p>
              <p className="mt-1 text-xs font-semibold text-muted">{prediction.powerUp}</p>
            </div>
            <StatusPill intent={prediction.status === "Needs pick" ? "warn" : "good"}>
              {prediction.status}
            </StatusPill>
          </div>
        ))}
      </div>
    </article>
  );
}

function PowerUpsCard() {
  return (
    <article className="rounded-shell bg-surface p-5 shadow-stat sm:p-7">
      <SectionLabel>Power-up inventory</SectionLabel>
      <h2 className="mt-3 text-3xl font-black tracking-display">
        Single-use boosts for important picks.
      </h2>
      <div className="mt-6 grid gap-3">
        {powerUps.map((powerUp) => (
          <div className="rounded-tile border border-ink/10 bg-canvas p-4" key={powerUp.code}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black tracking-tight">{powerUp.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{powerUp.description}</p>
              </div>
              <p className="font-mono text-3xl font-black tracking-number">{powerUp.count}</p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="ui-label text-navy">{powerUp.code}</p>
              <StatusPill intent={powerUp.state === "Queued" ? "warn" : "good"}>
                {powerUp.state}
              </StatusPill>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function GroupsLeaderboardAndRivals() {
  return (
    <section className="grid gap-5 pb-6 xl:grid-cols-[0.72fr_1fr_0.72fr]">
      <GroupsCard />
      <LeaderboardCard />
      <RivalsCard />
    </section>
  );
}

function GroupsCard() {
  return (
    <article className="rounded-shell border border-ink/10 bg-surface p-5 sm:p-7">
      <SectionLabel>Your groups</SectionLabel>
      <div className="mt-6 grid gap-3">
        {groups.map((group) => (
          <div className="rounded-tile bg-canvas p-4" key={group.code}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight">{group.name}</h2>
                <p className="mt-2 text-sm text-muted">
                  {group.members} players, currently {group.rank}
                </p>
              </div>
              <p className="font-mono text-xs font-black text-navy">{group.code}</p>
            </div>
            <p className="mt-4 font-mono text-sm font-black text-green">
              {group.points} group points
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function LeaderboardCard() {
  return (
    <article className="rounded-shell bg-green p-5 text-cream sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel tone="cream">Group leaderboard</SectionLabel>
          <h2 className="mt-3 text-3xl font-black tracking-display">Office Sweep standings</h2>
        </div>
        <StatusPill intent="dark">After 7 matches</StatusPill>
      </div>

      <div className="mt-6 divide-y divide-cream/12 rounded-panel border border-cream/12">
        {leaderboard.map((player) => (
          <div
            className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-4 sm:grid-cols-[auto_1fr_auto_auto]"
            key={player.rank}
          >
            <span className="font-mono text-sm font-black text-sand">{player.rank}</span>
            <div>
              <p className="font-black">{player.name}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-data text-sage">
                {player.form}
              </p>
            </div>
            <span className="font-mono text-lg font-black">{player.points}</span>
            <span className="hidden rounded-full bg-cream px-2.5 py-1 font-mono text-xs font-black text-green sm:block">
              {player.movement}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function RivalsCard() {
  return (
    <article className="rounded-shell border border-ink/10 bg-surface p-5 sm:p-7">
      <SectionLabel tone="navy">Rivals</SectionLabel>
      <div className="mt-6 grid gap-3">
        {rivals.map((rival) => (
          <div className="rounded-tile bg-canvas p-4" key={rival.name}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">{rival.name}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{rival.note}</p>
              </div>
              <p className="font-mono text-sm font-black text-terracotta">{rival.gap}</p>
            </div>
          </div>
        ))}
      </div>
      <DisabledAction variant="dark">Add rival soon</DisabledAction>
    </article>
  );
}

function ScoringAndBackendStatus() {
  return (
    <section className="grid gap-5 pb-10 lg:grid-cols-[1fr_1fr]">
      <article className="rounded-shell bg-navy p-5 text-cream sm:p-7">
        <SectionLabel tone="cream">Scoring model</SectionLabel>
        <h2 className="mt-3 text-3xl font-black leading-none tracking-display">
          Points stay server-owned once scoring is connected.
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {scoringRules.map((rule) => (
            <div className="rounded-tile bg-cream/9 p-4" key={rule.label}>
              <p className="text-sm font-bold text-sage">{rule.label}</p>
              <p className="mt-2 text-xl font-black tracking-tight">{rule.value}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-shell border border-ink/10 bg-surface p-5 sm:p-7">
        <SectionLabel>Backend status</SectionLabel>
        <h2 className="mt-3 text-3xl font-black tracking-display">
          Ready for live data, blocked on profile and RLS decisions.
        </h2>
        <div className="mt-6 grid gap-3">
          {[
            "Map Supabase Auth users to public.users rows.",
            "Load matches and predictions from Supabase.",
            "Save predictions and consume power-ups in one trusted transaction.",
            "Calculate points from final match results on the server.",
          ].map((item) => (
            <div className="rounded-tile bg-canvas px-4 py-3 font-semibold" key={item}>
              {item}
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
