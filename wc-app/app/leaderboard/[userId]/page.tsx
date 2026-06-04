import { notFound } from "next/navigation";

import {
  UserPredictionsPage,
  type CompletedPrediction,
} from "@/components/leaderboard/UserPredictionsPage";
import { AppShell } from "@/components/navigation/AppShell";
import { createClient } from "@/utils/supabase/server";

type LeaderboardRow = {
  user_id: string;
  nickname: string;
};

type CompletedPredictionRow = {
  group_id: string;
  group_name: string;
  user_id: string;
  nickname: string;
  match_id: number;
  match_number: number;
  round: string;
  group_label: string;
  kickoff_utc: string;
  home_team: string | null;
  home_team_code: string | null;
  away_team: string | null;
  away_team_code: string | null;
  predicted_home_score: number;
  predicted_away_score: number;
  predicted_winner_team_id: number | null;
  points_awarded: number;
  scoring_reason: string | null;
  scored_at: string | null;
};

function mapCompletedPrediction(row: CompletedPredictionRow): CompletedPrediction {
  return {
    groupId: row.group_id,
    groupName: row.group_name,
    userId: row.user_id,
    nickname: row.nickname,
    matchId: row.match_id,
    matchNumber: row.match_number,
    round: row.round,
    groupLabel: row.group_label,
    kickoffUtc: row.kickoff_utc,
    homeTeam: row.home_team,
    homeTeamCode: row.home_team_code,
    awayTeam: row.away_team,
    awayTeamCode: row.away_team_code,
    predictedHomeScore: row.predicted_home_score,
    predictedAwayScore: row.predicted_away_score,
    predictedWinnerTeamId: row.predicted_winner_team_id,
    pointsAwarded: row.points_awarded,
    scoringReason: row.scoring_reason,
    scoredAt: row.scored_at,
  };
}

export default async function LeaderboardUserPredictionsRoute({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();
  const { data: leaderboardData } = await supabase
    .rpc("get_current_group_leaderboard")
    .returns<LeaderboardRow[]>();
  const leaderboardRows = Array.isArray(leaderboardData) ? leaderboardData : [];
  const targetPlayer = leaderboardRows.find((entry) => entry.user_id === userId);

  if (!targetPlayer) {
    notFound();
  }

  const { data } = await supabase
    .rpc("get_group_member_completed_predictions", {
      target_user_id: userId,
    })
    .returns<CompletedPredictionRow[]>();
  const predictionRows = Array.isArray(data) ? data : [];

  return (
    <AppShell>
      <UserPredictionsPage
        predictions={predictionRows.map(mapCompletedPrediction)}
        targetNickname={targetPlayer.nickname}
      />
    </AppShell>
  );
}
