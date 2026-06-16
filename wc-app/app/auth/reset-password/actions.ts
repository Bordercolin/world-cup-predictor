"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const resetPasswordPath = "/auth/reset-password?recovery=1";

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const repeatPassword = String(formData.get("repeatPassword") ?? "");

  if (!password || !repeatPassword) {
    redirect(`${resetPasswordPath}&error=missing`);
  }

  if (password.length < 6) {
    redirect(`${resetPasswordPath}&error=short-password`);
  }

  if (password !== repeatPassword) {
    redirect(`${resetPasswordPath}&error=password-match`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`${resetPasswordPath}&error=update`);
  }

  await supabase.auth.signOut();
  redirect("/login?message=password-updated");
}
