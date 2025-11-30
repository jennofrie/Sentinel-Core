"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-safe-cyan" />
            <span className="text-2xl font-bold tracking-wide">SENTINEL</span>
          </div>
          <Link
            href="/login"
            className="px-6 py-2 bg-safe-cyan/20 border border-safe-cyan/50 rounded-lg text-safe-cyan font-bold tracking-wide hover:bg-safe-cyan/30 transition-colors"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </nav>
  );
}

