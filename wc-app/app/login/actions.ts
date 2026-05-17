"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNextPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/home";
}

export async function login(formData: FormData) {
  const email = readFormValue(formData, "email");
  const password = readFormValue(formData, "password");
  const next = safeNextPath(readFormValue(formData, "next"));

  if (!email || !password) {
    redirect("/login?error=Enter%20your%20email%20and%20password");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(next);
}
