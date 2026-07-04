import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured");
  }
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "flunora-admin-auth",
      },
    });
  }
  return supabase;
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
