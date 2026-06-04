import type { LeaderboardEntry } from "@/components/homepage";
import { LeaderboardPage } from "@/components/leaderboard/LeaderboardPage";
import { AppShell } from "@/components/navigation/AppShell";
import { createClient } from "@/utils/supabase/server";

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

export default async function LeaderboardRoute() {
  const supabase = await createClient();
  const { data } = await supabase
    .rpc("get_current_group_leaderboard")
    .returns<LeaderboardRow[]>();
  const leaderboardRows = Array.isArray(data) ? data : [];

  return (
    <AppShell>
      <LeaderboardPage leaderboard={leaderboardRows.map(mapLeaderboardRow)} />
    </AppShell>
  );
}
