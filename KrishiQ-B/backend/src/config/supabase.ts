import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "./env";

/**
 * Public Supabase Client (Anon Key)
 * Used for client-scoped operations and standard token verification.
 */
export const supabase: SupabaseClient = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Privileged Supabase Admin Client (Service Role Key)
 * Bypasses Row Level Security (RLS) for server-side user lookups and operations.
 * If service role key is not configured, safely falls back to standard client.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey || config.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
