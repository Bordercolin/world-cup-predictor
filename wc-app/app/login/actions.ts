"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=credentials");
  }

  redirect("/onboarding/nickname");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
