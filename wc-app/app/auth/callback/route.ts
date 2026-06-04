import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";

async function getOnboardingPath() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "/login";
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return "/onboarding/nickname";
  }

  const { data: membership } = await supabase
    .from("prediction_group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return "/onboarding/group";
  }

  return "/";
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next");
  const next = nextParam?.startsWith("/") && !nextParam.startsWith("//") ? nextParam : null;
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL("/login?error=callback", request.url));
    }
  }

  const fallbackPath = await getOnboardingPath();

  return NextResponse.redirect(new URL(next ?? fallbackPath, request.url));
}
