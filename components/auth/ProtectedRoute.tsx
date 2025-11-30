"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    // Only enforce authentication if Supabase is configured
    if (supabaseConfigured && !loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router, supabaseConfigured]);

  if (loading && supabaseConfigured) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="glass-panel rounded-lg p-8 border border-white/10">
          <Loader2 className="w-8 h-8 animate-spin text-safe-cyan mx-auto mb-4" />
          <p className="text-sm text-slate-400 font-mono text-center">AUTHENTICATING...</p>
        </div>
      </div>
    );
  }

  // If Supabase is not configured, allow access without authentication
  if (!supabaseConfigured) {
    return <>{children}</>;
  }

  // If Supabase is configured, require authentication
  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}

