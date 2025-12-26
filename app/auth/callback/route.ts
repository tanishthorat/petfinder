import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Use the request origin (should be production URL in production)
  // This ensures we redirect to the correct domain
  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? new URL("/swipe", process.env.NEXT_PUBLIC_SITE_URL)
    : new URL("/swipe", requestUrl.origin);

  return NextResponse.redirect(redirectUrl);
}
