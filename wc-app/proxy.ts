import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function redirectPreservingSession(
  request: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const response = NextResponse.redirect(url);

  supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPath = pathname.startsWith("/auth");
  const isAuthCallbackPath = pathname.startsWith("/auth/callback");
  const isResetPasswordPath = pathname.startsWith("/auth/reset-password");
  const isPasswordRecoveryPath =
    isResetPasswordPath && request.nextUrl.searchParams.get("recovery") === "1";
  const isLoginPath = pathname.startsWith("/login");
  const isRegisterPath = pathname.startsWith("/register");
  const isNicknamePath = pathname.startsWith("/onboarding/nickname");
  const isGroupPath = pathname.startsWith("/onboarding/group");

  if (!user) {
    if (isLoginPath || isRegisterPath || isAuthPath) {
      return supabaseResponse;
    }

    return redirectPreservingSession(request, supabaseResponse, "/login");
  }

  if (isAuthPath && !isAuthCallbackPath && !isPasswordRecoveryPath) {
    return redirectPreservingSession(request, supabaseResponse, "/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    if (isNicknamePath || isAuthCallbackPath || isPasswordRecoveryPath) {
      return supabaseResponse;
    }

    return redirectPreservingSession(request, supabaseResponse, "/onboarding/nickname");
  }

  const { data: membership } = await supabase
    .from("prediction_group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    if (isGroupPath || isAuthCallbackPath || isPasswordRecoveryPath) {
      return supabaseResponse;
    }

    return redirectPreservingSession(request, supabaseResponse, "/onboarding/group");
  }

  const isShowingCreatedGroupCode =
    isGroupPath && request.nextUrl.searchParams.has("created");

  if (
    (isLoginPath || isRegisterPath || isNicknamePath || isGroupPath) &&
    !isShowingCreatedGroupCode
  ) {
    return redirectPreservingSession(request, supabaseResponse, "/");
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
