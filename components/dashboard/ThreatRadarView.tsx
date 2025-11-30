"use client";

import { useState, useEffect } from "react";
import ThreatRadar from "@/components/visuals/ThreatRadar";
import type { ThreatResult } from "@/types/intel";
import { Activity } from "lucide-react";

export default function ThreatRadarView() {
  const [scanData, setScanData] = useState<ThreatResult | null>(null);

  // Check if there's scan data in localStorage from a previous scan
  // This allows viewing the radar from a scan done on the Dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("lastScanResult");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setScanData(parsed);
        } catch (e) {
          // Invalid data, ignore
        }
      }
    }
  }, []);

  if (!scanData) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">THREAT RADAR</h1>
          <p className="text-slate-400 font-mono text-sm">Visual Threat Intelligence Analysis</p>
        </div>

        <div className="glass-panel rounded-lg p-12 border border-white/10 text-center">
          <Activity className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-slate-300">No Scan Data Available</h2>
          <p className="text-slate-400 font-mono text-sm mb-6">
            Perform a scan on the Dashboard to view threat radar visualization
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-safe-cyan/20 border border-safe-cyan/50 rounded-lg text-safe-cyan font-bold tracking-wide hover:bg-safe-cyan/30 transition-colors"
          >
            GO TO DASHBOARD
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">THREAT RADAR</h1>
        <p className="text-slate-400 font-mono text-sm">Visual Threat Intelligence Analysis</p>
      </div>
      <ThreatRadar data={scanData} />
    </div>
  );
}

