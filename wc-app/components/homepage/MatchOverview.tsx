"use client";

import { useState } from "react";
import ReactCountryFlag from "react-country-flag";

import { savePrediction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TeamSide = "homeScore" | "awayScore";

export type Match = {
  id: string;
  matchDate: string;
  dateLabel: string;
  group: string;
  round: string;
  kickoffUtc: string;
  kickoffTime: string;
  homeTeamId: number | null;
  homeTeam: string | null;
  homeCountryCode: string | null;
  awayTeamId: number | null;
  awayTeam: string | null;
  awayCountryCode: string | null;
  venue: string;
  city: string;
  status: "Upcoming" | "Live" | "Final";
  prediction?: {
    homeScore: number;
    awayScore: number;
    predictedWinnerTeamId?: number | null;
    pointsAwarded?: number | null;
    scoringReason?: string | null;
    scoredAt?: string | null;
    submittedAt?: string;
  };
};

export type LeaderboardEntry = {
  groupId: string;
  groupName: string;
  userId: string;
  nickname: string;
  points: number;
  predictionsSubmitted: number;
  rank: number;
  isCurrentUser: boolean;
};

type SaveState = {
  status: "idle" | "saving" | "saved" | "error";
  message?: string;
};

const statusDetails: Record<
  Match["status"],
  {
    label: string;
    badgeClass: string;
    dotClass: string;
  }
> = {
  Upcoming: {
    label: "Starts later",
    badgeClass: "border-primary/20 bg-primary/10 text-primary",
    dotClass: "bg-primary",
  },
  Live: {
    label: "Live now",
    badgeClass: "border-destructive/20 bg-destructive/10 text-destructive",
    dotClass: "bg-red-500",
  },
  Final: {
    label: "Full time",
    badgeClass: "border-muted-foreground/20 bg-muted text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
};

function isMatchLocked(match: Match) {
  return match.status !== "Upcoming" || new Date(match.kickoffUtc) <= new Date();
}

function isKnockoutMatch(match: Match) {
  return match.round !== "group";
}

function needsKnockoutWinner(match: Match) {
  return (
    isKnockoutMatch(match) &&
    match.prediction !== undefined &&
    match.prediction.homeScore === match.prediction.awayScore
  );
}

function getSaveButtonLabel(match: Match, saveState?: SaveState) {
  if (saveState?.status === "saving") {
    return "Saving...";
  }

  if (match.prediction?.scoredAt) {
    return "Scored";
  }

  if (isMatchLocked(match)) {
    return "Locked";
  }

  if (saveState?.status === "saved" || match.prediction?.submittedAt) {
    return "Saved";
  }

  return "Save prediction";
}

function PredictionStepper({
  label,
  match,
  scoreKey,
  updatePrediction,
  disabled,
}: {
  label: string;
  match: Match;
  scoreKey: TeamSide;
  updatePrediction: (matchId: string, team: TeamSide, change: -1 | 1) => void;
  disabled?: boolean;
}) {
  const score = match.prediction?.[scoreKey];

  return (
    <div className="flex items-center justify-center gap-1 rounded-xl border border-primary/10 bg-background p-1">
      <Button
        aria-label={`Decrease ${label} prediction`}
        className="text-base"
        disabled={disabled || score === undefined || score === 0}
        onClick={() => updatePrediction(match.id, scoreKey, -1)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        -
      </Button>
      <span className="grid size-10 place-items-center rounded-lg bg-accent/60 bg-[image:var(--gradient-score)] font-mono text-2xl font-semibold tabular-nums text-primary">
        {score ?? "-"}
      </span>
      <Button
        aria-label={`Increase ${label} prediction`}
        className="text-base"
        disabled={disabled}
        onClick={() => updatePrediction(match.id, scoreKey, 1)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        +
      </Button>
    </div>
  );
}

function TeamName({
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
      className={`flex items-center gap-3 ${
        align === "right" ? "justify-start sm:justify-end" : ""
      }`}
    >
      {countryCode ? (
        <ReactCountryFlag
          aria-label={`${displayName} flag`}
          className="rounded-[0.2rem] text-3xl shadow-sm"
          countryCode={countryCode}
          svg
        />
      ) : (
        <span className="grid size-9 place-items-center rounded-md bg-muted font-mono text-xs font-bold text-muted-foreground">
          TBD
        </span>
      )}
      <p className="text-xl font-semibold tracking-tight">{displayName}</p>
    </div>
  );
}

export function MatchOverview({
  initialMatches,
  leaderboard,
  loadError,
}: {
  initialMatches: Match[];
  leaderboard: LeaderboardEntry[];
  loadError?: string;
}) {
  const [matches, setMatches] = useState(initialMatches);
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});
  const currentPlayer = leaderboard.find((entry) => entry.isCurrentUser);
  const leader = leaderboard[0];
  const pointsBehindLeader =
    currentPlayer && leader ? Math.max(0, leader.points - currentPlayer.points) : 0;
  const userStats = [
    {
      label: "Points",
      value: String(currentPlayer?.points ?? 0),
      detail: "Total awarded so far",
    },
    {
      label: "Group placement",
      value: currentPlayer ? `#${currentPlayer.rank}` : "-",
      detail:
        currentPlayer && pointsBehindLeader > 0
          ? `${pointsBehindLeader} points behind the leader`
          : "Top of the table",
    },
    {
      label: "Predictions",
      value: String(currentPlayer?.predictionsSubmitted ?? 0),
      detail: "Submitted picks",
    },
  ];
  const matchGroups = matches.reduce<
    {
      matchDate: string;
      dateLabel: string;
      matches: Match[];
    }[]
  >((groups, match) => {
    const existingGroup = groups.find((group) => group.matchDate === match.matchDate);

    if (existingGroup) {
      existingGroup.matches.push(match);
    } else {
      groups.push({
        matchDate: match.matchDate,
        dateLabel: match.dateLabel,
        matches: [match],
      });
    }

    return groups;
  }, []);

  function updatePrediction(
    matchId: string,
    team: TeamSide,
    change: -1 | 1,
  ) {
    setMatches((currentMatches) =>
      currentMatches.map((match) => {
        if (match.id !== matchId) {
          return match;
        }

        if (!match.prediction && change < 0) {
          return match;
        }

        const currentPrediction = match.prediction ?? {
          homeScore: 0,
          awayScore: 0,
        };
        const nextScore = Math.max(0, currentPrediction[team] + change);
        const nextPrediction = {
          ...currentPrediction,
          [team]: nextScore,
        };
        const shouldKeepWinner =
          isKnockoutMatch(match) && nextPrediction.homeScore === nextPrediction.awayScore;

        return {
          ...match,
          prediction: {
            ...nextPrediction,
            predictedWinnerTeamId: shouldKeepWinner
              ? currentPrediction.predictedWinnerTeamId
              : null,
            pointsAwarded: null,
            scoringReason: null,
            scoredAt: null,
            submittedAt: undefined,
          },
        };
      }),
    );
    setSaveStates((currentStates) => ({
      ...currentStates,
      [matchId]: {
        status: "idle",
      },
    }));
  }

  function updatePredictionWinner(matchId: string, predictedWinnerTeamId: number) {
    setMatches((currentMatches) =>
      currentMatches.map((match) => {
        if (match.id !== matchId || !match.prediction || isMatchLocked(match)) {
          return match;
        }

        return {
          ...match,
          prediction: {
            ...match.prediction,
            predictedWinnerTeamId,
            pointsAwarded: null,
            scoringReason: null,
            scoredAt: null,
            submittedAt: undefined,
          },
        };
      }),
    );
    setSaveStates((currentStates) => ({
      ...currentStates,
      [matchId]: {
        status: "idle",
      },
    }));
  }

  async function handleSavePrediction(match: Match) {
    if (!match.prediction) {
      return;
    }

    if (needsKnockoutWinner(match) && !match.prediction.predictedWinnerTeamId) {
      setSaveStates((currentStates) => ({
        ...currentStates,
        [match.id]: {
          status: "error",
          message: "Choose who advances before saving.",
        },
      }));
      return;
    }

    setSaveStates((currentStates) => ({
      ...currentStates,
      [match.id]: {
        status: "saving",
      },
    }));

    const result = await savePrediction({
      matchId: match.id,
      homeScore: match.prediction.homeScore,
      awayScore: match.prediction.awayScore,
      predictedWinnerTeamId: match.prediction.predictedWinnerTeamId ?? undefined,
    });

    if (result.status === "error") {
      setSaveStates((currentStates) => ({
        ...currentStates,
        [match.id]: {
          status: "error",
          message: result.message,
        },
      }));
      return;
    }

    setMatches((currentMatches) =>
      currentMatches.map((currentMatch) => {
        if (currentMatch.id !== match.id || !currentMatch.prediction) {
          return currentMatch;
        }

        return {
          ...currentMatch,
          prediction: {
            ...currentMatch.prediction,
            pointsAwarded: null,
            scoringReason: null,
            scoredAt: null,
            submittedAt: result.submittedAt,
          },
        };
      }),
    );
    setSaveStates((currentStates) => ({
      ...currentStates,
      [match.id]: {
        status: "saved",
      },
    }));
  }

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <Card className="border-primary/15 bg-card bg-[image:var(--gradient-panel)] p-2 shadow-[0_24px_70px_-48px_var(--shadow-panel-color)] sm:p-4">
          <CardHeader className="gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
                  World Cup 2026
                </Badge>
                <CardTitle className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Your group form
                </CardTitle>
              </div>
              <Badge variant="outline" className="w-fit uppercase tracking-[0.18em]">
                Live standings
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {userStats.map((stat) => (
                <div
                  className="rounded-xl border border-primary/10 bg-accent/35 bg-[image:linear-gradient(135deg,oklch(0.36_0.065_230/0.34),transparent)] p-4 transition hover:-translate-y-0.5 hover:bg-accent/55"
                  key={stat.label}
                >
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {loadError ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent>
              <p className="font-semibold text-destructive">Could not load matches from Supabase.</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
            </CardContent>
          </Card>
        ) : null}

        <section aria-label="Matches by date" className="grid gap-8">
          {matchGroups.length > 0 ? (
            matchGroups.map((matchGroup) => (
            <section className="grid gap-4" key={matchGroup.matchDate}>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="uppercase tracking-[0.18em]">
                  Match day
                </Badge>
                <h2 className="text-2xl font-semibold tracking-tight">{matchGroup.dateLabel}</h2>
              </div>

              <div className="grid gap-4">
                {matchGroup.matches.map((match) => {
                  const locked = isMatchLocked(match);
                  const saveState = saveStates[match.id];
                  const requiresWinner = needsKnockoutWinner(match);
                  const hasWinner = Boolean(match.prediction?.predictedWinnerTeamId);
                  const scored = Boolean(match.prediction?.scoredAt);
                  const saveDisabled =
                    !match.prediction ||
                    locked ||
                    scored ||
                    saveState?.status === "saving" ||
                    saveState?.status === "saved" ||
                    Boolean(match.prediction?.submittedAt) ||
                    (requiresWinner && !hasWinner);

                  return (
                  <Card
                    key={match.id}
                    className="border-primary/10 bg-card transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
                  >
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                        <div className="min-w-0">
                          <TeamName countryCode={match.homeCountryCode} name={match.homeTeam} />
                          <p className="mt-1 text-sm text-muted-foreground">{match.group}</p>
                        </div>

                        <div className="grid justify-items-center gap-3 text-center">
                          <div>
                            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                              {match.dateLabel} - {match.kickoffTime}
                            </p>
                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                              Prediction
                            </p>
                          </div>

                          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                            <PredictionStepper
                              label={match.homeTeam ?? "home team"}
                              match={match}
                              scoreKey="homeScore"
                              disabled={locked || scored}
                              updatePrediction={updatePrediction}
                            />
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                              vs
                            </span>
                            <PredictionStepper
                              label={match.awayTeam ?? "away team"}
                              match={match}
                              scoreKey="awayScore"
                              disabled={locked || scored}
                              updatePrediction={updatePrediction}
                            />
                          </div>

                          {requiresWinner ? (
                            <div className="grid gap-2">
                              <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                Who advances?
                              </p>
                              <div className="flex flex-wrap justify-center gap-2">
                                {match.homeTeamId ? (
                                  <Button
                                    aria-pressed={
                                      match.prediction?.predictedWinnerTeamId === match.homeTeamId
                                    }
                                    disabled={locked || scored}
                                    onClick={() =>
                                      updatePredictionWinner(match.id, match.homeTeamId!)
                                    }
                                    size="xs"
                                    type="button"
                                    variant={
                                      match.prediction?.predictedWinnerTeamId === match.homeTeamId
                                        ? "default"
                                        : "outline"
                                    }
                                  >
                                    {match.homeTeam ?? "Home team"}
                                  </Button>
                                ) : null}
                                {match.awayTeamId ? (
                                  <Button
                                    aria-pressed={
                                      match.prediction?.predictedWinnerTeamId === match.awayTeamId
                                    }
                                    disabled={locked || scored}
                                    onClick={() =>
                                      updatePredictionWinner(match.id, match.awayTeamId!)
                                    }
                                    size="xs"
                                    type="button"
                                    variant={
                                      match.prediction?.predictedWinnerTeamId === match.awayTeamId
                                        ? "default"
                                        : "outline"
                                    }
                                  >
                                    {match.awayTeam ?? "Away team"}
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          ) : null}

                          <Badge
                            variant="outline"
                            className={`gap-2 ${statusDetails[match.status].badgeClass}`}
                          >
                            <span
                              aria-hidden="true"
                              className={`size-2.5 rounded-full ${statusDetails[match.status].dotClass}`}
                            />
                            <span>{statusDetails[match.status].label}</span>
                          </Badge>

                          <div className="grid justify-items-center gap-2">
                            <Button
                              aria-label={`Save prediction for ${match.homeTeam ?? "home team"} vs ${match.awayTeam ?? "away team"}`}
                              disabled={saveDisabled}
                              onClick={() => void handleSavePrediction(match)}
                              size="sm"
                              type="button"
                            >
                              {getSaveButtonLabel(match, saveState)}
                            </Button>
                            {requiresWinner && !hasWinner && !locked ? (
                              <p className="max-w-52 text-center text-xs text-muted-foreground">
                                Pick the team that advances if this score stays tied.
                              </p>
                            ) : null}
                            {match.prediction?.pointsAwarded !== null &&
                            match.prediction?.pointsAwarded !== undefined ? (
                              <div className="max-w-64 rounded-xl border border-primary/15 bg-primary/10 bg-[image:var(--gradient-score)] p-3 text-center shadow-[0_18px_40px_-34px_var(--shadow-panel-color)]">
                                <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary">
                                  {match.prediction.pointsAwarded} points
                                </p>
                                {match.prediction.scoringReason ? (
                                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    {match.prediction.scoringReason}
                                  </p>
                                ) : null}
                              </div>
                            ) : null}
                            {saveState?.status === "error" ? (
                              <p className="max-w-52 text-center text-xs text-destructive">
                                {saveState.message}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="min-w-0 text-left sm:text-right">
                          <TeamName
                            align="right"
                            countryCode={match.awayCountryCode}
                            name={match.awayTeam}
                          />
                          <p className="mt-1 text-sm text-muted-foreground">
                            {match.venue}, {match.city}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </section>
            ))
          ) : (
            <Card>
              <CardContent>
                <p className="font-semibold">No matches found.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Import fixture data into Supabase to populate the schedule.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}
