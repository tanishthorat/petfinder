import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  // Read env vars at request-time (avoid top-level reads which can be undefined in Edge/middleware runtimes)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // In middleware/edge runtimes env vars may not be available depending on Next.js config.
    // Don't throw here (which breaks the whole request). Instead log and continue without updating Supabase session.
    console.warn('Supabase env vars missing in middleware runtime', { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey });
    return NextResponse.next({ request: { headers: request.headers } });
  }
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  try {
    await supabase.auth.getUser();
  } catch (err) {
    // If the Supabase client cannot be used in this runtime, log and continue.
    console.warn('Supabase client error in middleware:', err);
  }

  return supabaseResponse;
};
