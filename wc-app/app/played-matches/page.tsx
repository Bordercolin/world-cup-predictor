import {
  PlayedMatchesPage,
  type PlayedMatch,
} from "@/components/played-matches/PlayedMatchesPage";
import { AppShell } from "@/components/navigation/AppShell";
import { createClient } from "@/utils/supabase/server";

type CompletedMatchRow = {
  id: number;
  match_number: number;
  round: string;
  group_name: string | null;
  home_team: string | null;
  home_team_code: string | null;
  away_team: string | null;
  away_team_code: string | null;
  kickoff_utc: string;
  home_score: number;
  away_score: number;
  first_goalscorer_player_id: string | null;
};

type PredictionRow = {
  match_id: number;
  predicted_home_score: number;
  predicted_away_score: number;
  predicted_first_goalscorer_player_id: string | null;
  points_awarded: number | null;
  scoring_reason: string | null;
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

function mapCompletedMatchRow(
  match: CompletedMatchRow,
  prediction?: PredictionRow,
  goalscorerNamesById = new Map<string, string>(),
): PlayedMatch {
  return {
    id: String(match.id),
    dateLabel: formatDateLabel(match.kickoff_utc),
    group: match.group_name ? `Group ${match.group_name}` : match.round.toUpperCase(),
    homeTeam: match.home_team,
    homeCountryCode: match.home_team_code ? fifaCodeToCountryCode[match.home_team_code] ?? null : null,
    awayTeam: match.away_team,
    awayCountryCode: match.away_team_code ? fifaCodeToCountryCode[match.away_team_code] ?? null : null,
    homeScore: match.home_score,
    awayScore: match.away_score,
    firstGoalscorerName: match.first_goalscorer_player_id
      ? goalscorerNamesById.get(match.first_goalscorer_player_id) ?? null
      : null,
    prediction: prediction
      ? {
          homeScore: prediction.predicted_home_score,
          awayScore: prediction.predicted_away_score,
          predictedFirstGoalscorerName: prediction.predicted_first_goalscorer_player_id
            ? goalscorerNamesById.get(prediction.predicted_first_goalscorer_player_id) ?? null
            : null,
          pointsAwarded: prediction.points_awarded,
          scoringReason: prediction.scoring_reason,
        }
      : undefined,
  };
}

export default async function PlayedMatchesRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("matches")
    .select(
      "id, match_number, round, group_name, home_team, home_team_code, away_team, away_team_code, kickoff_utc, home_score, away_score, first_goalscorer_player_id",
    )
    .eq("status", "completed")
    .not("home_score", "is", null)
    .not("away_score", "is", null)
    .order("kickoff_utc", { ascending: false })
    .order("match_number", { ascending: false })
    .returns<CompletedMatchRow[]>();
  const { data: predictionData } = user
    ? await supabase
        .from("predictions")
        .select(
          "match_id, predicted_home_score, predicted_away_score, predicted_first_goalscorer_player_id, points_awarded, scoring_reason",
        )
        .eq("user_id", user.id)
        .returns<PredictionRow[]>()
    : { data: [] };
  const goalscorerPlayerIds = Array.from(
    new Set(
      [
        ...(data ?? []).map((match) => match.first_goalscorer_player_id),
        ...(predictionData ?? []).map(
          (prediction) => prediction.predicted_first_goalscorer_player_id,
        ),
      ].filter((playerId): playerId is string => Boolean(playerId)),
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
  const predictionsByMatch = new Map(
    (predictionData ?? []).map((prediction) => [prediction.match_id, prediction]),
  );
  const goalscorerNamesById = new Map(
    (goalscorerPlayerData ?? []).map((player) => [player.id, player.name]),
  );

  return (
    <AppShell>
      <PlayedMatchesPage
        loadError={error?.message}
        matches={
          error
            ? []
            : (data ?? []).map((match) =>
                mapCompletedMatchRow(match, predictionsByMatch.get(match.id), goalscorerNamesById),
              )
        }
      />
    </AppShell>
  );
}
