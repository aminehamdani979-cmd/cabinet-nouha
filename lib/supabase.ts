import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Browser/client-side Supabase client.
 * Uses the anon key — respects RLS policies (public read on available_slots,
 * insert-only on appointments).
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Server-side Supabase admin client.
 * Uses the service role key — bypasses RLS. NEVER expose this client or its
 * key to the browser. Only use inside API routes / server components.
 */
export function createAdminSupabaseClient(): SupabaseClient {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations require this environment variable."
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
