/**
 * Get the site URL for redirects
 * Uses NEXT_PUBLIC_SITE_URL in production, falls back to window.location.origin in development
 */
export function getSiteUrl(): string {
  // Client-side: prefer environment variable, fallback to window.location.origin
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  }
  
  // Server-side: use environment variable or Vercel URL
  return process.env.NEXT_PUBLIC_SITE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
}

/**
 * Get the auth callback URL
 */
export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}

