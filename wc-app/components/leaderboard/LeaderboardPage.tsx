import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeaderboardEntry } from "@/components/homepage";

export function LeaderboardPage({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  const groupName = leaderboard[0]?.groupName ?? "Your group";

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-4xl gap-6">
        <Card className="border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
          <CardHeader className="gap-4">
            <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
              Leaderboard
            </Badge>
            <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {groupName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Group rankings are based on awarded prediction points. Ties use submitted prediction
              count, then join order.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-card p-2 sm:p-4">
          <CardContent>
            {leaderboard.length > 0 ? (
              <div className="grid gap-2">
                {leaderboard.map((entry) => (
                  <Link
                    aria-label={`View completed predictions for ${entry.nickname}`}
                    className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border px-3 py-3 transition-colors sm:gap-4 sm:px-4 ${
                      entry.isCurrentUser
                        ? "border-primary/20 bg-primary/10 bg-[image:var(--gradient-score)] ring-1 ring-primary/20"
                        : "bg-muted/25 hover:bg-muted/40"
                    }`}
                    href={`/leaderboard/${entry.userId}`}
                    key={entry.userId}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary/10 bg-background font-mono text-sm font-bold text-primary">
                      {entry.rank}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold tracking-tight sm:text-lg">
                        {entry.nickname}
                        {entry.isCurrentUser ? " (you)" : ""}
                      </p>
                      <p className="truncate text-xs text-muted-foreground sm:text-sm">
                        {entry.predictionsSubmitted} predictions submitted
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-xl font-semibold tabular-nums sm:text-2xl">
                        {entry.points}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        points
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border bg-muted/25 px-4 py-3 text-sm text-muted-foreground">
                No leaderboard entries yet. Join or create a group to start competing.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
