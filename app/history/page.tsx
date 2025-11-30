"use client";

import LayoutShell from "@/components/LayoutShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { getHistory, type HistoryEntry } from "@/lib/history-service";
import { Database, RefreshCw, Search, Clock, Shield } from "lucide-react";
import IntelCard from "@/components/dashboard/IntelCard";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    const { data } = await getHistory();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <ProtectedRoute>
      <LayoutShell>
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">HISTORY</h1>
            <p className="text-slate-400 font-mono text-sm">
              Recent Scans (Latest 10)
            </p>
          </div>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm font-mono disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            REFRESH
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History List */}
          <div className="lg:col-span-1 space-y-4">
            {loading ? (
              <div className="text-center py-12 glass-panel rounded-lg border border-white/10">
                <RefreshCw className="w-8 h-8 text-safe-cyan animate-spin mx-auto mb-2" />
                <p className="text-slate-400 font-mono text-sm">Loading history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 glass-panel rounded-lg border border-white/10">
                <Database className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 font-mono text-sm">No history found</p>
              </div>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-4 glass-panel rounded-lg border border-white/10 cursor-pointer transition-all hover:bg-white/5 ${
                    selectedEntry?.id === entry.id ? "border-safe-cyan/50 bg-white/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <span className="font-mono text-white font-bold">
                        {entry.ip}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded ${
                        entry.verdict === "MALICIOUS"
                          ? "bg-signal-red/20 text-signal-red border border-signal-red/30"
                          : "bg-safe-cyan/20 text-safe-cyan border border-safe-cyan/30"
                      }`}
                    >
                      {entry.verdict}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Score: {entry.risk_score}/100
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Details View */}
          <div className="lg:col-span-2">
            {selectedEntry ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <IntelCard data={selectedEntry.details} />
              </div>
            ) : (
              <div className="h-full min-h-[400px] glass-panel rounded-lg border border-white/10 flex flex-col items-center justify-center text-center p-8">
                <Search className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">
                  Select a Scan
                </h3>
                <p className="text-slate-500 font-mono text-sm max-w-md">
                  Click on a history entry from the list to view the full threat intelligence report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </LayoutShell>
    </ProtectedRoute>
  );
}
