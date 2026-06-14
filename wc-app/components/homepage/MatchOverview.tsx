"use client";

import { useState } from "react";
import ReactCountryFlag from "react-country-flag";

import {
  getMatchSquads,
  savePrediction,
  type MatchSquads,
  type SquadPlayer,
  type SquadTeam,
} from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  odds?: {
    homeWin: number;
    draw: number;
    awayWin: number;
    homeImpliedProbability: number;
    drawImpliedProbability: number;
    awayImpliedProbability: number;
    lastSyncedAt: string | null;
  };
  prediction?: {
    homeScore: number;
    awayScore: number;
    predictedWinnerTeamId?: number | null;
    predictedFirstGoalscorerPlayerId?: string | null;
    predictedFirstGoalscorerName?: string | null;
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

type SquadState = {
  status: "idle" | "loading" | "loaded" | "error";
  squads?: MatchSquads;
  message?: string;
};

type GoalscorerDraft = {
  playerId: string | null;
  playerName: string | null;
};

function LoadingSpinner({ className = "size-3.5" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`${className} inline-block animate-spin rounded-full border-2 border-current border-r-transparent`}
    />
  );
}

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

function formatProbability(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
    style: "percent",
  }).format(value);
}

function formatOddsSyncedAt(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    timeZone: "Europe/Brussels",
  }).format(new Date(value));
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

function OddsPanel({ match }: { match: Match }) {
  if (!match.odds) {
    return null;
  }

  const updatedAt = formatOddsSyncedAt(match.odds.lastSyncedAt);
  const odds = [
    {
      label: match.homeTeam ?? "Home",
      shortLabel: match.homeTeam ?? "Home",
      probability: match.odds.homeImpliedProbability,
      segmentClass: "bg-primary",
      dotClass: "bg-primary",
      alignClass: "justify-self-start text-left",
    },
    {
      label: "Draw",
      shortLabel: "Draw",
      probability: match.odds.drawImpliedProbability,
      segmentClass: "bg-muted-foreground/70",
      dotClass: "bg-muted-foreground/70",
      alignClass: "justify-self-center text-center",
    },
    {
      label: match.awayTeam ?? "Away",
      shortLabel: match.awayTeam ?? "Away",
      probability: match.odds.awayImpliedProbability,
      segmentClass: "bg-secondary-foreground/70",
      dotClass: "bg-secondary-foreground/70",
      alignClass: "justify-self-end text-right",
    },
  ];

  return (
    <div className="rounded-xl border border-primary/10 bg-muted/25 p-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Match odds
        </p>
        {updatedAt ? (
          <p className="text-xs text-muted-foreground">Updated {updatedAt}</p>
        ) : null}
      </div>
      <div
        aria-label={`Win chances: ${odds
          .map((entry) => `${entry.label} ${formatProbability(entry.probability)}`)
          .join(", ")}`}
        className="mt-3 flex h-2 overflow-hidden rounded-full bg-background"
        role="img"
      >
        {odds.map((entry) => (
          <span
            aria-hidden="true"
            className={entry.segmentClass}
            key={entry.label}
            style={{ width: `${entry.probability * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {odds.map((entry) => (
          <div className={`min-w-0 ${entry.alignClass}`} key={entry.label}>
            <div className="inline-grid gap-1 text-xs">
              <div className="flex max-w-32 items-center gap-1.5">
                <span aria-hidden="true" className={`size-2 rounded-full ${entry.dotClass}`} />
                <p className="truncate font-semibold text-muted-foreground">{entry.shortLabel}</p>
              </div>
              <p className="font-mono font-semibold tabular-nums text-foreground">
                {formatProbability(entry.probability)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalscorerSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {["Home squad", "Away squad"].map((label) => (
        <section
          className="rounded-xl border border-primary/10 bg-background/70 p-4"
          key={label}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-2">
              <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-5 grid gap-3">
            <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </p>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="rounded-lg border border-border/60 bg-muted/25 px-3 py-2"
                key={index}
              >
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function GoalscorerColumn({
  onSelectPlayer,
  players,
  selectedPlayerId,
  team,
}: {
  onSelectPlayer: (player: SquadPlayer) => void;
  players: SquadPlayer[];
  selectedPlayerId?: string | null;
  team: SquadTeam;
}) {
  const playersByPosition = players.reduce<Record<string, SquadPlayer[]>>((groups, player) => {
    const position = player.position ?? "Squad";
    groups[position] = [...(groups[position] ?? []), player];
    return groups;
  }, {});

  return (
    <section className="rounded-xl border border-primary/10 bg-background/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {team.code ?? "TBD"}
          </p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">
            {team.name ?? "To be decided"}
          </h3>
        </div>
        <Badge variant="outline">{players.length} players</Badge>
      </div>

      <div className="mt-4 grid gap-4">
        {players.length > 0 ? (
          Object.entries(playersByPosition).map(([position, positionPlayers]) => (
            <div className="grid gap-2" key={position}>
              <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-primary">
                {position}
              </p>
              <div className="grid gap-2">
                {positionPlayers.map((player) => (
                  <button
                    aria-pressed={selectedPlayerId === player.id}
                    className={`rounded-lg border px-3 py-2 text-left transition hover:border-primary/30 hover:bg-primary/10 ${
                      selectedPlayerId === player.id
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-border/60 bg-muted/25"
                    }`}
                    key={player.id}
                    onClick={() => onSelectPlayer(player)}
                    type="button"
                  >
                    <p className="font-semibold leading-5">{player.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[player.nationality, player.dateOfBirth].filter(Boolean).join(" - ")}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
            No squad data synced for this team yet.
          </p>
        )}
      </div>
    </section>
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
  const [squadStates, setSquadStates] = useState<Record<string, SquadState>>({});
  const [goalscorerDialogMatchId, setGoalscorerDialogMatchId] = useState<string | null>(null);
  const [goalscorerDrafts, setGoalscorerDrafts] = useState<Record<string, GoalscorerDraft>>({});
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
            predictedFirstGoalscorerPlayerId: currentPrediction.predictedFirstGoalscorerPlayerId,
            predictedFirstGoalscorerName: currentPrediction.predictedFirstGoalscorerName,
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

  function getSavedGoalscorerDraft(match: Match): GoalscorerDraft {
    return {
      playerId: match.prediction?.predictedFirstGoalscorerPlayerId ?? null,
      playerName: match.prediction?.predictedFirstGoalscorerName ?? null,
    };
  }

  function getGoalscorerDraft(match: Match) {
    return goalscorerDrafts[match.id] ?? getSavedGoalscorerDraft(match);
  }

  function hasGoalscorerDraftChanged(match: Match) {
    const draft = getGoalscorerDraft(match);
    const saved = getSavedGoalscorerDraft(match);

    return draft.playerId !== saved.playerId;
  }

  function prepareGoalscorerDialog(match: Match) {
    setGoalscorerDrafts((currentDrafts) => ({
      ...currentDrafts,
      [match.id]: getSavedGoalscorerDraft(match),
    }));
    setGoalscorerDialogMatchId(match.id);
    void handleLoadSquads(match);
  }

  function updateGoalscorerDraft(matchId: string, player: SquadPlayer | null) {
    setGoalscorerDrafts((currentDrafts) => ({
      ...currentDrafts,
      [matchId]: {
        playerId: player?.id ?? null,
        playerName: player?.name ?? null,
      },
    }));
  }

  function resetGoalscorerDraft(match: Match) {
    setGoalscorerDrafts((currentDrafts) => ({
      ...currentDrafts,
      [match.id]: getSavedGoalscorerDraft(match),
    }));
  }

  function getGoalscorerCloseConfirmationMessage(match: Match) {
    const draft = getGoalscorerDraft(match);
    const saved = getSavedGoalscorerDraft(match);

    if (draft.playerId !== saved.playerId) {
      return "You have not saved this goalscorer change yet. Close and discard it?";
    }

    if (!saved.playerId && !draft.playerId) {
      return "You have not chosen a first goalscorer yet. Are you sure you want to close?";
    }

    return null;
  }

  function handleGoalscorerDialogOpenChange(
    match: Match,
    open: boolean,
    eventDetails: { cancel: () => void },
  ) {
    if (open) {
      prepareGoalscorerDialog(match);
      return;
    }

    const confirmationMessage = getGoalscorerCloseConfirmationMessage(match);

    if (confirmationMessage && !window.confirm(confirmationMessage)) {
      eventDetails.cancel();
      return;
    }

    resetGoalscorerDraft(match);
    setGoalscorerDialogMatchId(null);
  }

  async function saveGoalscorerDraft(match: Match) {
    const draft = getGoalscorerDraft(match);
    const nextPrediction = {
      ...(match.prediction ?? {
        homeScore: 0,
        awayScore: 0,
      }),
      predictedFirstGoalscorerPlayerId: draft.playerId,
      predictedFirstGoalscorerName: draft.playerName,
      pointsAwarded: null,
      scoringReason: null,
      scoredAt: null,
      submittedAt: undefined,
    };
    const nextMatch = {
      ...match,
      prediction: nextPrediction,
    };

    if (needsKnockoutWinner(nextMatch) && !nextPrediction.predictedWinnerTeamId) {
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
      homeScore: nextPrediction.homeScore,
      awayScore: nextPrediction.awayScore,
      predictedFirstGoalscorerPlayerId: draft.playerId ?? undefined,
      predictedWinnerTeamId: nextPrediction.predictedWinnerTeamId ?? undefined,
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
        if (currentMatch.id !== match.id) {
          return currentMatch;
        }

        return {
          ...currentMatch,
          prediction: {
            ...nextPrediction,
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
    setGoalscorerDialogMatchId(null);
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
      predictedFirstGoalscorerPlayerId:
        match.prediction.predictedFirstGoalscorerPlayerId ?? undefined,
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

  async function handleLoadSquads(match: Match) {
    const existingState = squadStates[match.id];

    if (existingState?.status === "loading" || existingState?.status === "loaded") {
      return;
    }
    
    if (!match.homeTeamId || !match.awayTeamId) {
      setSquadStates((currentStates) => ({
        ...currentStates,
        [match.id]: {
          status: "error",
          message: "Both teams need to be known before choosing a goalscorer.",
        },
      }));
      return;
    }

    setSquadStates((currentStates) => ({
      ...currentStates,
      [match.id]: {
        status: "loading",
      },
    }));

    const result = await getMatchSquads(match.id);

    if (result.status === "error") {
      setSquadStates((currentStates) => ({
        ...currentStates,
        [match.id]: {
          status: "error",
          message: result.message,
        },
      }));
      return;
    }

    setSquadStates((currentStates) => ({
      ...currentStates,
      [match.id]: {
        status: "loaded",
        squads: result.squads,
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
                  {currentPlayer?.groupName ?? "Your group"}
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
                  className="rounded-xl border border-primary/10 bg-accent/35 bg-[image:linear-gradient(135deg,oklch(0.36_0.065_230/0.34),transparent)] p-4"
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
                  const canPredictGoalscorer = Boolean(match.homeTeamId && match.awayTeamId);
                  const squadState = squadStates[match.id] ?? { status: "idle" };
                  const goalscorerDraft = getGoalscorerDraft(match);
                  const goalscorerDraftChanged = hasGoalscorerDraftChanged(match);
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
                    className="border-primary/10 bg-card"
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
                              aria-busy={saveState?.status === "saving"}
                              disabled={saveDisabled}
                              onClick={() => void handleSavePrediction(match)}
                              size="sm"
                              type="button"
                            >
                              {saveState?.status === "saving" ? <LoadingSpinner /> : null}
                              {getSaveButtonLabel(match, saveState)}
                            </Button>
                            <Dialog
                              onOpenChange={(open, eventDetails) =>
                                handleGoalscorerDialogOpenChange(match, open, eventDetails)
                              }
                              open={goalscorerDialogMatchId === match.id}
                            >
                              <DialogTrigger
                                render={
                                  <Button
                                    aria-label={`Predict first goalscorer for ${match.homeTeam ?? "home team"} vs ${match.awayTeam ?? "away team"}`}
                                    aria-busy={squadState.status === "loading"}
                                    disabled={!canPredictGoalscorer || locked || scored}
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                  />
                                }
                              >
                                {squadState.status === "loading" ? <LoadingSpinner /> : null}
                                {squadState.status === "loading" ? "Loading players..." : "Predict goalscorer"}
                              </DialogTrigger>
                              <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Predict first goalscorer</DialogTitle>
                                  <DialogDescription>
                                    Pick the player you think will score first in{" "}
                                    {match.homeTeam ?? "home team"} vs{" "}
                                    {match.awayTeam ?? "away team"}. Correct pick is worth 5 bonus
                                    points.
                                  </DialogDescription>
                                </DialogHeader>

                                {squadState.status === "loading" ? (
                                  <div className="grid gap-4">
                                    <div className="flex items-center gap-2 rounded-xl border border-primary/10 bg-muted/30 p-4 text-sm text-muted-foreground">
                                      <LoadingSpinner />
                                      Loading player lists...
                                    </div>
                                    <GoalscorerSkeleton />
                                  </div>
                                ) : null}

                                {squadState.status === "error" ? (
                                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                                    {squadState.message}
                                  </div>
                                ) : null}

                                {squadState.status === "loaded" && squadState.squads ? (
                                  <div className="grid gap-4">
                                    <div className="flex flex-col gap-2 rounded-xl border border-primary/10 bg-primary/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                                      <p className="text-sm text-muted-foreground">
                                        {goalscorerDraft.playerName
                                          ? `Selected: ${goalscorerDraft.playerName}`
                                          : "No first goalscorer selected yet."}
                                      </p>
                                      <Button
                                        disabled={!goalscorerDraft.playerId}
                                        onClick={() => updateGoalscorerDraft(match.id, null)}
                                        size="sm"
                                        type="button"
                                        variant="outline"
                                      >
                                        Clear pick
                                      </Button>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                      <GoalscorerColumn
                                        onSelectPlayer={(player) =>
                                          updateGoalscorerDraft(match.id, player)
                                        }
                                        players={squadState.squads.homePlayers}
                                        selectedPlayerId={goalscorerDraft.playerId}
                                        team={squadState.squads.homeTeam}
                                      />
                                      <GoalscorerColumn
                                        onSelectPlayer={(player) =>
                                          updateGoalscorerDraft(match.id, player)
                                        }
                                        players={squadState.squads.awayPlayers}
                                        selectedPlayerId={goalscorerDraft.playerId}
                                        team={squadState.squads.awayTeam}
                                      />
                                    </div>
                                  </div>
                                ) : null}
                                <DialogFooter>
                                  <Button
                                    onClick={() =>
                                      handleGoalscorerDialogOpenChange(match, false, {
                                        cancel: () => undefined,
                                      })
                                    }
                                    type="button"
                                    variant="outline"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    aria-busy={saveState?.status === "saving"}
                                    disabled={
                                      !goalscorerDraftChanged || saveState?.status === "saving"
                                    }
                                    onClick={() => void saveGoalscorerDraft(match)}
                                    type="button"
                                  >
                                    {saveState?.status === "saving" ? <LoadingSpinner /> : null}
                                    {saveState?.status === "saving"
                                      ? "Saving..."
                                      : "Save goalscorer"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            {match.prediction?.predictedFirstGoalscorerName ? (
                              <p className="max-w-56 text-center text-xs text-muted-foreground">
                                First goalscorer:{" "}
                                <span className="font-semibold text-foreground">
                                  {match.prediction.predictedFirstGoalscorerName}
                                </span>
                              </p>
                            ) : match.prediction?.predictedFirstGoalscorerPlayerId ? (
                              <p className="max-w-56 text-center text-xs text-muted-foreground">
                                First goalscorer selected
                              </p>
                            ) : null}
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
                      <div className="mt-4">
                        <OddsPanel match={match} />
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
