"use client";

import { Menu, Shield, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [time, setTime] = useState<string>("--:--:--");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    setMounted(true);
    
    const formatTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    // Set initial time
    setTime(formatTime());

    const timer = setInterval(() => {
      setTime(formatTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="glass-panel border-b border-white/10 h-16 flex items-center px-6">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors mr-4"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-safe-cyan" />
        <h1 className="text-xl font-bold tracking-wide">SENTINEL</h1>
      </div>

      <div className="ml-auto flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">SOC ACTIVE</span>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div className="text-sm text-slate-400 font-mono">
          {time}
        </div>
      </div>
    </nav>
  );
}

