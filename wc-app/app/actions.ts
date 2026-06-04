"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export type SavePredictionResult =
  | {
      status: "saved";
      submittedAt: string;
    }
  | {
      status: "error";
      message: string;
    };

export async function savePrediction({
  awayScore,
  homeScore,
  matchId,
  predictedWinnerTeamId,
}: {
  awayScore: number;
  homeScore: number;
  matchId: string;
  predictedWinnerTeamId?: number;
}): Promise<SavePredictionResult> {
  const matchIdNumber = Number(matchId);

  if (
    !Number.isInteger(matchIdNumber) ||
    !Number.isInteger(homeScore) ||
    !Number.isInteger(awayScore) ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    return {
      status: "error",
      message: "Choose a valid score before saving.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, round, home_team_id, away_team_id, kickoff_utc, status")
    .eq("id", matchIdNumber)
    .single<{
      id: number;
      round: string;
      home_team_id: number | null;
      away_team_id: number | null;
      kickoff_utc: string;
      status: "scheduled" | "live" | "completed";
    }>();

  if (matchError || !match) {
    return {
      status: "error",
      message: "Could not find this match.",
    };
  }

  if (match.status !== "scheduled" || new Date(match.kickoff_utc) <= new Date()) {
    return {
      status: "error",
      message: "This match is locked.",
    };
  }

  const isKnockoutMatch = match.round !== "group";
  const isTiedPrediction = homeScore === awayScore;
  const validWinnerIds = [match.home_team_id, match.away_team_id].filter(
    (teamId): teamId is number => teamId !== null,
  );
  const normalizedWinnerTeamId =
    predictedWinnerTeamId && validWinnerIds.includes(predictedWinnerTeamId)
      ? predictedWinnerTeamId
      : null;

  if (isKnockoutMatch && isTiedPrediction && normalizedWinnerTeamId === null) {
    return {
      status: "error",
      message: "Choose who advances for a tied knockout prediction.",
    };
  }

  if (predictedWinnerTeamId && normalizedWinnerTeamId === null) {
    return {
      status: "error",
      message: "Choose one of the teams in this match as the winner.",
    };
  }

  const submittedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("predictions")
    .upsert(
      {
        user_id: user.id,
        match_id: matchIdNumber,
        predicted_home_score: homeScore,
        predicted_away_score: awayScore,
        predicted_winner_team_id: isKnockoutMatch ? normalizedWinnerTeamId : null,
        submitted_at: submittedAt,
        points_awarded: null,
        scoring_reason: null,
        scored_at: null,
      },
      {
        onConflict: "user_id,match_id",
      },
    )
    .select("submitted_at")
    .single();

  if (error) {
    return {
      status: "error",
      message: "Could not save this prediction. The match may already be locked.",
    };
  }

  return {
    status: "saved",
    submittedAt: data.submitted_at,
  };
}
