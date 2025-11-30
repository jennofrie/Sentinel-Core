"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || "Failed to sign in. Please check your credentials.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="glass-panel rounded-lg p-4 border-2 border-signal-red/50 bg-signal-red/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-signal-red flex-shrink-0" />
            <p className="text-sm text-signal-red font-mono">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-bold tracking-wide text-slate-300 block">
          EMAIL
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full pl-10 pr-4 py-3 glass-panel border border-white/20 rounded-lg bg-slate-900/50 text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-safe-cyan/50 focus:ring-2 focus:ring-safe-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            placeholder="analyst@company.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-bold tracking-wide text-slate-300 block">
          PASSWORD
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full pl-10 pr-4 py-3 glass-panel border border-white/20 rounded-lg bg-slate-900/50 text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-safe-cyan/50 focus:ring-2 focus:ring-safe-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-safe-cyan/20 border-2 border-safe-cyan/50 rounded-lg text-safe-cyan font-bold tracking-wide hover:bg-safe-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            AUTHENTICATING...
          </>
        ) : (
          "SIGN IN"
        )}
      </button>
    </form>
  );
}

