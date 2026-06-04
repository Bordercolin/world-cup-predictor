"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function registerWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const repeatPassword = String(formData.get("repeatPassword") ?? "");
  const supabase = await createClient();

  if (!email || !password || !repeatPassword) {
    redirect("/register?error=missing");
  }

  if (password.length < 6) {
    redirect("/register?error=short-password");
  }

  if (password !== repeatPassword) {
    redirect("/register?error=password-match");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect("/register?error=register");
  }

  redirect("/onboarding/nickname");
}
