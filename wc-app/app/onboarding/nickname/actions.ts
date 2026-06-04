"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function saveNickname(formData: FormData) {
  const nickname = String(formData.get("nickname") ?? "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (nickname.length < 2 || nickname.length > 32) {
    redirect("/onboarding/nickname?error=length");
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      nickname,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    redirect("/onboarding/nickname?error=save");
  }

  redirect("/onboarding/group");
}
