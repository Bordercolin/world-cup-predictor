import { MatchOverview, type LeaderboardEntry, type Match } from "@/components/homepage";
import { AppShell } from "@/components/navigation/AppShell";
import { createClient } from "@/utils/supabase/server";

type MatchRow = {
  id: number;
  match_number: number;
  round: string;
  group_name: string | null;
  home_team_id: number | null;
  home_team: string | null;
  home_team_code: string | null;
  away_team_id: number | null;
  away_team: string | null;
  away_team_code: string | null;
  stadium: string;
  stadium_city: string;
  stadium_country: string;
  kickoff_utc: string;
  status: "scheduled" | "live" | "completed";
  odds_home_win: number | null;
  odds_draw: number | null;
  odds_away_win: number | null;
  odds_home_implied_probability: number | null;
  odds_draw_implied_probability: number | null;
  odds_away_implied_probability: number | null;
  odds_last_synced_at: string | null;
};

type LeaderboardRow = {
  group_id: string;
  group_name: string;
  user_id: string;
  nickname: string;
  points: number;
  predictions_submitted: number;
  rank: number;
  is_current_user: boolean;
};

type PredictionRow = {
  match_id: number;
  predicted_home_score: number;
  predicted_away_score: number;
  predicted_winner_team_id: number | null;
  predicted_first_goalscorer_player_id: string | null;
  points_awarded: number | null;
  scoring_reason: string | null;
  scored_at: string | null;
  submitted_at: string;
};

type GoalscorerPlayerRow = {
  id: string;
  name: string;
};

const fifaCodeToCountryCode: Record<string, string> = {
  ALG: "DZ",
  ARG: "AR",
  AUS: "AU",
  AUT: "AT",
  BEL: "BE",
  BIH: "BA",
  BRA: "BR",
  CAN: "CA",
  CIV: "CI",
  COD: "CD",
  COL: "CO",
  CPV: "CV",
  CRO: "HR",
  CUW: "CW",
  CZE: "CZ",
  ECU: "EC",
  EGY: "EG",
  ENG: "GB-ENG",
  ESP: "ES",
  FRA: "FR",
  GER: "DE",
  GHA: "GH",
  HAI: "HT",
  IRN: "IR",
  IRQ: "IQ",
  JOR: "JO",
  JPN: "JP",
  KOR: "KR",
  KSA: "SA",
  MAR: "MA",
  MEX: "MX",
  NED: "NL",
  NOR: "NO",
  NZL: "NZ",
  PAN: "PA",
  PAR: "PY",
  POR: "PT",
  QAT: "QA",
  RSA: "ZA",
  SCO: "GB-SCT",
  SEN: "SN",
  SUI: "CH",
  SWE: "SE",
  TUN: "TN",
  TUR: "TR",
  URU: "UY",
  USA: "US",
  UZB: "UZ",
};

function formatDateLabel(kickoffUtc: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(kickoffUtc));
}

function formatKickoffTime(kickoffUtc: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Brussels",
  }).format(new Date(kickoffUtc));
}

function mapStatus(status: MatchRow["status"]): Match["status"] {
  if (status === "live") {
    return "Live";
  }

  if (status === "completed") {
    return "Final";
  }

  return "Upcoming";
}

function mapMatchRow(
  match: MatchRow,
  prediction?: PredictionRow,
  goalscorerNamesById = new Map<string, string>(),
): Match {
  const kickoffDate = new Date(match.kickoff_utc);

  return {
    id: String(match.id),
    matchDate: kickoffDate.toISOString().slice(0, 10),
    dateLabel: formatDateLabel(match.kickoff_utc),
    group: match.group_name ? `Group ${match.group_name}` : match.round.toUpperCase(),
    round: match.round,
    kickoffUtc: match.kickoff_utc,
    kickoffTime: formatKickoffTime(match.kickoff_utc),
    homeTeamId: match.home_team_id,
    homeTeam: match.home_team,
    homeCountryCode: match.home_team_code ? fifaCodeToCountryCode[match.home_team_code] ?? null : null,
    awayTeamId: match.away_team_id,
    awayTeam: match.away_team,
    awayCountryCode: match.away_team_code ? fifaCodeToCountryCode[match.away_team_code] ?? null : null,
    venue: match.stadium,
    city: `${match.stadium_city}, ${match.stadium_country}`,
    status: mapStatus(match.status),
    odds:
      match.odds_home_win &&
      match.odds_draw &&
      match.odds_away_win &&
      match.odds_home_implied_probability &&
      match.odds_draw_implied_probability &&
      match.odds_away_implied_probability
        ? {
            homeWin: match.odds_home_win,
            draw: match.odds_draw,
            awayWin: match.odds_away_win,
            homeImpliedProbability: match.odds_home_implied_probability,
            drawImpliedProbability: match.odds_draw_implied_probability,
            awayImpliedProbability: match.odds_away_implied_probability,
            lastSyncedAt: match.odds_last_synced_at,
          }
        : undefined,
    prediction: prediction
      ? {
          homeScore: prediction.predicted_home_score,
          awayScore: prediction.predicted_away_score,
          predictedWinnerTeamId: prediction.predicted_winner_team_id,
          predictedFirstGoalscorerPlayerId: prediction.predicted_first_goalscorer_player_id,
          predictedFirstGoalscorerName: prediction.predicted_first_goalscorer_player_id
            ? goalscorerNamesById.get(prediction.predicted_first_goalscorer_player_id) ?? null
            : null,
          pointsAwarded: prediction.points_awarded,
          scoringReason: prediction.scoring_reason,
          scoredAt: prediction.scored_at,
          submittedAt: prediction.submitted_at,
        }
      : undefined,
  };
}

function mapLeaderboardRow(entry: LeaderboardRow): LeaderboardEntry {
  return {
    groupId: entry.group_id,
    groupName: entry.group_name,
    userId: entry.user_id,
    nickname: entry.nickname,
    points: entry.points,
    predictionsSubmitted: entry.predictions_submitted,
    rank: entry.rank,
    isCurrentUser: entry.is_current_user,
  };
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("matches")
    .select(
      "id, match_number, round, group_name, home_team_id, home_team, home_team_code, away_team_id, away_team, away_team_code, stadium, stadium_city, stadium_country, kickoff_utc, status, odds_home_win, odds_draw, odds_away_win, odds_home_implied_probability, odds_draw_implied_probability, odds_away_implied_probability, odds_last_synced_at",
    )
    .order("kickoff_utc", { ascending: true })
    .order("match_number", { ascending: true })
    .returns<MatchRow[]>();
  const { data: leaderboardData } = await supabase
    .rpc("get_current_group_leaderboard")
    .returns<LeaderboardRow[]>();
  const { data: predictionData } = user
    ? await supabase
        .from("predictions")
        .select(
          "match_id, predicted_home_score, predicted_away_score, predicted_winner_team_id, predicted_first_goalscorer_player_id, points_awarded, scoring_reason, scored_at, submitted_at",
        )
        .eq("user_id", user.id)
        .returns<PredictionRow[]>()
    : { data: [] };
  const goalscorerPlayerIds = Array.from(
    new Set(
      (predictionData ?? [])
        .map((prediction) => prediction.predicted_first_goalscorer_player_id)
        .filter((playerId): playerId is string => Boolean(playerId)),
    ),
  );
  const { data: goalscorerPlayerData } =
    goalscorerPlayerIds.length > 0
      ? await supabase
          .from("team_players")
          .select("id, name")
          .in("id", goalscorerPlayerIds)
          .returns<GoalscorerPlayerRow[]>()
      : { data: [] };
  const leaderboardRows = Array.isArray(leaderboardData) ? leaderboardData : [];
  const predictionsByMatch = new Map(
    (predictionData ?? []).map((prediction) => [prediction.match_id, prediction]),
  );
  const goalscorerNamesById = new Map(
    (goalscorerPlayerData ?? []).map((player) => [player.id, player.name]),
  );

  return (
    <AppShell>
      <MatchOverview
        initialMatches={
          error
            ? []
            : (data ?? []).map((match) =>
                mapMatchRow(match, predictionsByMatch.get(match.id), goalscorerNamesById),
              )
        }
        leaderboard={leaderboardRows.map(mapLeaderboardRow)}
        loadError={error?.message}
      />
    </AppShell>
  );
}
