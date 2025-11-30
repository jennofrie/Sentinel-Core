"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import LoginForm from "@/components/auth/LoginForm";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    // If Supabase is not configured, redirect to dashboard (bypass auth)
    if (!supabaseConfigured && !loading) {
      router.push("/dashboard");
      return;
    }

    // Redirect to dashboard if already logged in
    if (supabaseConfigured && !loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router, supabaseConfigured]);

  // If Supabase not configured, show redirecting message
  if (!supabaseConfigured) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="glass-panel rounded-lg p-8 border border-white/10 max-w-md">
          <Loader2 className="w-8 h-8 animate-spin text-safe-cyan mx-auto mb-4" />
          <p className="text-sm text-slate-400 font-mono text-center">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="glass-panel rounded-lg p-8 border border-white/10">
          <Loader2 className="w-8 h-8 animate-spin text-safe-cyan mx-auto mb-4" />
          <p className="text-sm text-slate-400 font-mono text-center">LOADING...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-safe-cyan" />
            <h1 className="text-4xl font-bold tracking-wide">SENTINEL</h1>
          </div>
          <p className="text-slate-400 font-mono text-sm">Threat Intelligence Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="glass-panel rounded-lg p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 text-center tracking-wide">SIGN IN</h2>
          
          {!supabaseConfigured && (
            <div className="mb-6 glass-panel rounded-lg p-4 border-2 border-cyber-amber/50 bg-cyber-amber/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-cyber-amber flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-cyber-amber mb-1">AUTHENTICATION NOT CONFIGURED</p>
                  <p className="text-xs text-slate-400 font-mono">
                    Supabase credentials are missing. Authentication features are disabled. 
                    <Link href="/dashboard" className="text-safe-cyan hover:underline ml-1">
                      Continue to Dashboard →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 font-mono mt-6">
          Blue Team Threat Intelligence Platform
        </p>
      </div>
    </div>
  );
}

