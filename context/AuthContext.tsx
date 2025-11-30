"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured before trying to get session
    if (!isSupabaseConfigured()) {
      // Supabase not configured - skip auth initialization
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      // If session fetch fails, just set loading to false
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      return {
        error: {
          message: "Authentication is not configured. Supabase credentials are missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.",
        },
      };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Provide more helpful error messages
        if (error.message?.includes("Invalid login credentials")) {
          return { error: { ...error, message: "Invalid email or password. Please try again." } };
        }
        if (error.message?.includes("fetch") || error.message?.includes("network")) {
          return { error: { ...error, message: "Network error: Unable to connect to authentication service." } };
        }
      }
      
      return { error };
    } catch (err: any) {
      // Handle unexpected errors
      const errorMessage = err?.message || "An unexpected error occurred during sign in.";
      
      if (errorMessage.toLowerCase().includes("fetch") || errorMessage.toLowerCase().includes("network")) {
        return {
          error: {
            message: "Failed to connect to authentication service. This usually means Supabase is not properly configured or there's a network issue.",
          },
        };
      }
      
      return {
        error: {
          message: errorMessage,
        },
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

