import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type CompletedPrediction = {
  groupId: string;
  groupName: string;
  userId: string;
  nickname: string;
  matchId: number;
  matchNumber: number;
  round: string;
  groupLabel: string;
  kickoffUtc: string;
  homeTeam: string | null;
  homeTeamCode: string | null;
  awayTeam: string | null;
  awayTeamCode: string | null;
  predictedHomeScore: number;
  predictedAwayScore: number;
  predictedWinnerTeamId: number | null;
  pointsAwarded: number;
  scoringReason: string | null;
  scoredAt: string | null;
};

function formatMatchDate(kickoffUtc: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(kickoffUtc));
}

export function UserPredictionsPage({
  predictions,
  targetNickname,
}: {
  predictions: CompletedPrediction[];
  targetNickname?: string;
}) {
  const firstPrediction = predictions[0];
  const nickname = firstPrediction?.nickname ?? targetNickname ?? "Player";
  const groupName = firstPrediction?.groupName ?? "Your group";
  const totalPoints = predictions.reduce(
    (points, prediction) => points + prediction.pointsAwarded,
    0,
  );

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-4xl gap-6">
        <Card className="border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
                  Completed predictions
                </Badge>
                <div>
                  <CardTitle className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {nickname}
                  </CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{groupName}</p>
                </div>
              </div>
              <Button render={<Link href="/leaderboard" />} variant="outline">
                Back to leaderboard
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-end">
              <p className="font-mono text-5xl font-semibold tracking-tight text-primary tabular-nums">
                {totalPoints}
              </p>
              <p className="pb-1 text-sm leading-6 text-muted-foreground">
                Points shown here only come from finished matches. Upcoming and live predictions stay
                hidden.
              </p>
            </div>
          </CardContent>
        </Card>

        {predictions.length > 0 ? (
          <div className="grid gap-3">
            {predictions.map((prediction) => (
              <Card key={prediction.matchId} className="border-primary/10 bg-card p-2">
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="uppercase tracking-[0.16em]">
                          Match {prediction.matchNumber}
                        </Badge>
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          {prediction.groupLabel}
                        </span>
                      </div>
                      <p className="mt-3 text-xl font-semibold tracking-tight">
                        {prediction.homeTeam ?? "Home team"} vs {prediction.awayTeam ?? "Away team"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatMatchDate(prediction.kickoffUtc)}
                      </p>
                      {prediction.scoringReason ? (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                          {prediction.scoringReason}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid justify-items-start gap-2 sm:justify-items-end">
                      <div className="rounded-xl border border-primary/10 bg-muted/35 px-4 py-3 text-center">
                        <p className="font-mono text-3xl font-semibold tabular-nums">
                          {prediction.predictedHomeScore}-{prediction.predictedAwayScore}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          prediction
                        </p>
                      </div>
                      <div className="rounded-xl border border-primary/15 bg-primary/10 bg-[image:var(--gradient-score)] px-4 py-3 text-center text-primary shadow-[0_18px_40px_-34px_var(--shadow-panel-color)]">
                        <p className="font-mono text-2xl font-semibold tabular-nums">
                          {prediction.pointsAwarded}
                        </p>
                        <p className="text-xs uppercase tracking-[0.16em]">points</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-2">
            <CardContent>
              <p className="font-semibold">No finished predictions visible yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This page will show predictions after matches have ended and points have been
                awarded.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
