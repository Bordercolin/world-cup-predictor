import ReactCountryFlag from "react-country-flag";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type PlayedMatch = {
  id: string;
  dateLabel: string;
  group: string;
  homeTeam: string | null;
  homeCountryCode: string | null;
  awayTeam: string | null;
  awayCountryCode: string | null;
  homeScore: number;
  awayScore: number;
  firstGoalscorerName: string | null;
  prediction?: {
    homeScore: number;
    awayScore: number;
    predictedFirstGoalscorerName: string | null;
    pointsAwarded: number | null;
    scoringReason: string | null;
  };
};

function TeamLabel({
  align = "left",
  countryCode,
  name,
}: {
  align?: "left" | "right";
  countryCode: string | null;
  name: string | null;
}) {
  const displayName = name ?? "To be decided";

  return (
    <div
      className={`flex min-w-0 items-center gap-2 sm:gap-3 ${
        align === "right" ? "justify-end" : ""
      }`}
    >
      {countryCode ? (
        <ReactCountryFlag
          aria-label={`${displayName} flag`}
          className="shrink-0 rounded-[0.2rem] text-2xl shadow-sm sm:text-3xl"
          countryCode={countryCode}
          svg
        />
      ) : (
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted font-mono text-xs font-bold text-muted-foreground sm:size-9">
          TBD
        </span>
      )}
      <p className="truncate text-base font-semibold tracking-tight sm:text-lg">{displayName}</p>
    </div>
  );
}

function ScoreBlock({
  awayScore,
  homeScore,
  label,
  muted = false,
}: {
  awayScore: number | null;
  homeScore: number | null;
  label: string;
  muted?: boolean;
}) {
  return (
    <div className="grid justify-items-center gap-2 text-center">
      <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <div
        className={`grid grid-cols-[2.75rem_auto_2.75rem] items-center gap-2 rounded-xl border px-3 py-2 ${
          muted
            ? "border-border/70 bg-muted/25 text-muted-foreground"
            : "border-primary/15 bg-primary/10 bg-[image:var(--gradient-score)] text-primary"
        }`}
      >
        <span className="font-mono text-2xl font-semibold tabular-nums">
          {homeScore ?? "-"}
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.16em]">vs</span>
        <span className="font-mono text-2xl font-semibold tabular-nums">
          {awayScore ?? "-"}
        </span>
      </div>
    </div>
  );
}

function GoalscorerResult({
  actualName,
  predictedName,
}: {
  actualName: string | null;
  predictedName?: string | null;
}) {
  const isCorrect = Boolean(actualName && predictedName && actualName === predictedName);

  return (
    <div className="rounded-xl border border-primary/10 bg-muted/25 p-3">
      <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        First goalscorer
      </p>
      <div className="mt-3 grid gap-2 text-sm">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Actual</p>
          <p className="truncate font-semibold text-foreground">
            {actualName ?? "None recorded"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Your prediction</p>
          <p
            className={`truncate font-semibold ${
              predictedName
                ? isCorrect
                  ? "text-primary"
                  : "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {predictedName ?? "No goalscorer predicted"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PlayedMatchesPage({
  loadError,
  matches,
}: {
  loadError?: string;
  matches: PlayedMatch[];
}) {
  const totalPoints = matches.reduce(
    (total, match) => total + (match.prediction?.pointsAwarded ?? 0),
    0,
  );
  const predictedMatches = matches.filter((match) => match.prediction).length;

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-5xl gap-6">
        <Card className="border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
          <CardHeader className="gap-4">
            <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
              Played matches
            </Badge>
            <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Results and your points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/10 bg-muted/25 p-4">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Your completed predictions
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">
                  {predictedMatches}/{matches.length}
                </p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-primary/10 bg-[image:var(--gradient-score)] p-4">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Points from played matches
                </p>
                <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">
                  {totalPoints}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {loadError ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent>
              <p className="font-semibold text-destructive">Could not load played matches.</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
            </CardContent>
          </Card>
        ) : null}

        <section aria-label="Played matches" className="grid gap-4">
          {matches.length > 0 ? (
            matches.map((match) => (
              <Card className="border-primary/10 bg-card" key={match.id}>
                <CardContent className="grid gap-5">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <TeamLabel countryCode={match.homeCountryCode} name={match.homeTeam} />
                    </div>
                    <ScoreBlock
                      awayScore={match.awayScore}
                      homeScore={match.homeScore}
                      label="Final score"
                    />
                    <div className="min-w-0 text-right">
                      <TeamLabel
                        align="right"
                        countryCode={match.awayCountryCode}
                        name={match.awayTeam}
                      />
                    </div>
                  </div>

                  <p className="text-center text-xs text-muted-foreground sm:text-left">
                    {match.dateLabel} · {match.group}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="grid justify-items-center gap-2 rounded-xl border border-border/70 bg-muted/25 px-4 py-3 text-center">
                      <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Your prediction
                      </p>
                      <div className="grid grid-cols-[2.5rem_auto_2.5rem] items-center gap-2 text-muted-foreground">
                        <span className="font-mono text-2xl font-semibold tabular-nums">
                          {match.prediction?.homeScore ?? "-"}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.16em]">vs</span>
                        <span className="font-mono text-2xl font-semibold tabular-nums">
                          {match.prediction?.awayScore ?? "-"}
                        </span>
                      </div>
                    </div>

                    <GoalscorerResult
                      actualName={match.firstGoalscorerName}
                      predictedName={match.prediction?.predictedFirstGoalscorerName}
                    />

                    <div className="grid content-start gap-1 rounded-xl border border-primary/15 bg-primary/10 bg-[image:var(--gradient-score)] px-4 py-3 text-primary">
                      <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em]">
                        Points
                      </p>
                      <p className="font-mono text-3xl font-semibold tabular-nums">
                        {match.prediction?.pointsAwarded ?? "-"}
                      </p>
                      {match.prediction?.scoringReason ? (
                        <p className="text-xs leading-5 text-muted-foreground">
                          {match.prediction.scoringReason}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {match.prediction ? "Scoring pending." : "No prediction submitted."}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent>
                <p className="font-semibold">No played matches yet.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Completed matches will appear here with your prediction and points.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
