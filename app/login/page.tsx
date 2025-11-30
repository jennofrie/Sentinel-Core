"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import { Shield, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

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

