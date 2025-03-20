import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");
  const origin = requestUrl.origin;

  const supabase = await createClient();

  if (token && type === "signup") {
    // Handle email verification
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "signup",
    });

    if (error) {
      console.error("Verification error:", error.message);
      return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(error.message)}`);
    }

    return NextResponse.redirect(`${origin}/sign-in?success=${encodeURIComponent("Email verified successfully! Please sign in.")}`);
  }

  if (code) {
    // Handle code exchange
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Code exchange error:", error.message);
      return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(error.message)}`);
    }

    return NextResponse.redirect(`${origin}/protected`);
  }

  // If no token or code is present, redirect to sign-in
  return NextResponse.redirect(`${origin}/sign-in`);
}
