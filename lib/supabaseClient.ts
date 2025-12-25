// Legacy export - use utils/supabase/client.ts or utils/supabase/server.ts instead
import { createClient as createBrowserClient } from '@/utils/supabase/client';

export const supabase = createBrowserClient();

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
