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

// Create a safe Supabase client that handles missing env vars gracefully
// This prevents build errors when env vars are not set during prerender/build
// Use valid placeholder values that Supabase will accept but won't work at runtime
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTY4MDAsImV4cCI6MTk2MDc3MjgwMH0.placeholder";

// Create client with fallback to prevent build crashes
// If env vars are missing, use placeholder values that won't throw during build
export const supabase: SupabaseClient = createClient(
  supabaseUrl || PLACEHOLDER_URL,
  supabaseAnonKey || PLACEHOLDER_KEY,
  {
    auth: {
      persistSession: supabaseUrl ? true : false, // Only persist if properly configured
      autoRefreshToken: supabaseUrl ? true : false,
    },
  }
);

// Export a helper to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes("placeholder") && 
    supabaseUrl.startsWith("https://")
  );
}

/**
 * Get the current user session
 * Useful for checking authentication status
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  return session;
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error);
    return null;
  }
  return user;
}
