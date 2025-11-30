import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Get environment variables (available on both client and server)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only log on client side to avoid server console spam
if (typeof window !== "undefined") {
  console.log("Supabase Config Check:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "MISSING",
  });
}

// Create and export the Supabase client
// Use empty strings as fallback - the history-service will check and handle gracefully
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "",
  supabaseAnonKey || "",
  {
    auth: {
      persistSession: false, // Don't persist auth sessions for this use case
      autoRefreshToken: false,
    },
  }
);
