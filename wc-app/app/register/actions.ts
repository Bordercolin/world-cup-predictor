"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function register(formData: FormData) {
  const email = readFormValue(formData, "email");
  const password = readFormValue(formData, "password");
  const displayName = readFormValue(formData, "displayName");

  if (!email || !password || !displayName) {
    redirect("/register?error=Enter%20your%20name%2C%20email%2C%20and%20password");
  }

  if (password.length < 8) {
    redirect("/register?error=Use%20at%20least%208%20characters%20for%20your%20password");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    "/login?message=Account%20created.%20Check%20your%20email%20if%20confirmation%20is%20enabled.",
  );
}
