"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

function getBaseUrl(headersList: Headers) {
  const origin = headersList.get("origin");

  if (origin) {
    return origin;
  }

  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  return host ? `${protocol}://${host}` : "";
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/auth/forgot-password?error=missing");
  }

  const headersList = await headers();
  const baseUrl = getBaseUrl(headersList);
  const callbackUrl = new URL("/auth/callback", baseUrl);
  callbackUrl.searchParams.set("next", "/auth/reset-password?recovery=1");
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl.toString(),
  });

  if (error) {
    redirect("/auth/forgot-password?error=reset");
  }

  redirect("/auth/forgot-password?message=sent");
}
