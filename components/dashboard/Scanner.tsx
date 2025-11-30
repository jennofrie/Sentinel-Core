"use client";

import { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import type { ThreatResult } from "@/types/intel";
import IntelCard from "./IntelCard";
import ThreatRadar from "@/components/visuals/ThreatRadar";
import { useSystemLogs } from "@/context/SystemLogContext";
import { addToHistory } from "@/lib/history-service";

export default function Scanner() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ThreatResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addLog } = useSystemLogs();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    // Log scan initiation
    addLog("Scanner", `Initiating scan for: ${query.trim()}`, "INFO");

    try {
      const response = await fetch(`/api/scan?query=${encodeURIComponent(query.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `API Error: ${response.statusText}`;
        
        // Log error to system log
        addLog("API", errorMessage, "ERROR");
        setError(errorMessage);
        return;
      }

      const result: ThreatResult = await response.json();
      
      // Debug: Log to browser console to verify data structure
      console.log("[Client] AbuseIPDB data received:", result.data.abuseIPDB);
      
      // Log system errors from Black Box Recorder (Airbag Pattern)
      if (result.systemErrors && result.systemErrors.length > 0) {
        result.systemErrors.forEach((errorMsg: string) => {
          addLog("API", errorMsg, "ERROR");
        });
        
        // Log partial success status
        addLog(
          "Scanner",
          `Partial success: Scan completed with ${result.systemErrors.length} error(s)`,
          "WARNING"
        );
      }
      
      // Log scan completion with verdict
      if (result.verdict) {
        addLog(
          "Scanner", 
          `Scan complete: ${query.trim()} - Verdict: ${result.verdict} (Risk: ${result.riskScore}/100)`, 
          result.systemErrors && result.systemErrors.length > 0 ? "WARNING" : "SUCCESS"
        );
      } else {
        // Log successful scan (no errors)
        addLog("Scanner", `Successfully scanned: ${query.trim()}`, "SUCCESS");
      }

      // Log module status
      if (!result.data.virusTotal) {
        addLog("Scanner", "VirusTotal module offline - no data available", "WARNING");
      }
      if (!result.data.shodan) {
        addLog("Scanner", "Shodan module offline - no data available", "WARNING");
      }
      if (!result.data.safeBrowsing) {
        addLog("Scanner", "Google Safe Browsing module offline - no data available", "WARNING");
      }
      
      // AbuseIPDB logging
      if (!result.data.abuseIPDB) {
        addLog("AbuseIPDB", "Module offline - no data available", "WARNING");
      } else {
        // Log detailed AbuseIPDB information
        const abuseData = result.data.abuseIPDB;
        
        addLog("AbuseIPDB", `API call successful for ${result.ip}`, "SUCCESS");
        
        const abuseScore = abuseData.abuseConfidenceScore ?? 0;
        const reportCount = abuseData.numDistinctUsers ?? 0;
        const totalReports = abuseData.totalReports ?? 0;
        const isWhitelisted = abuseData.isWhitelisted;
        
        // Log main result
        if (isWhitelisted) {
          addLog("AbuseIPDB", `IP ${result.ip}: Whitelisted (Safe) - Confidence: 0%`, "SUCCESS");
        } else if (abuseScore > 0) {
          addLog(
            "AbuseIPDB", 
            `IP ${result.ip}: Abuse Confidence ${abuseScore}% (${totalReports} reports from ${reportCount} users)`, 
            abuseScore > 75 ? "WARNING" : "INFO"
          );
        } else {
          addLog("AbuseIPDB", `IP ${result.ip}: No abuse reports - Confidence: 0% (Clean)`, "SUCCESS");
        }
        
        // Log location and ISP details
        if (abuseData.countryCode || abuseData.isp) {
          const location = abuseData.countryName || abuseData.countryCode || "Unknown";
          const isp = abuseData.isp || "Unknown";
          addLog("AbuseIPDB", `Location: ${location} | ISP: ${isp}`, "INFO");
        }
        
        // Log usage type
        if (abuseData.usageType) {
          addLog("AbuseIPDB", `Usage Type: ${abuseData.usageType}`, "INFO");
        }
        
        // Log IP version and public status
        if (abuseData.ipVersion) {
          addLog("AbuseIPDB", `IPv${abuseData.ipVersion} | Public: ${abuseData.isPublic ? "Yes" : "No"}`, "INFO");
        }
        
        // Log last reported date if available
        if (abuseData.lastReportedAt) {
          const lastReport = new Date(abuseData.lastReportedAt).toLocaleDateString();
          addLog("AbuseIPDB", `Last Reported: ${lastReport}`, "INFO");
        }
      }
      
      setData(result);
      
      // Store scan result in localStorage for Threat Radar page access
      if (typeof window !== "undefined") {
        localStorage.setItem("lastScanResult", JSON.stringify(result));
      }

      // Save to Supabase history (fire and forget)
      addToHistory(result).then(({ error }) => {
        if (error) {
          const errorMsg = error?.message || "Unknown error";
          console.error("History save error:", error);
          addLog("History", `Failed to save search to history: ${errorMsg}`, "WARNING");
        } else {
          addLog("History", "Search saved to history", "SUCCESS");
        }
      }).catch((err) => {
        console.error("History save exception:", err);
        addLog("History", "Failed to save search to history: Unexpected error", "WARNING");
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch threat intelligence";
      
      // Log error to system log
      addLog("Scanner", errorMessage, "ERROR");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">IOC SCANNER</h1>
        <p className="text-slate-400 font-mono text-sm">Threat Intelligence Query Interface</p>
      </div>

      {/* Search Input */}
      <div className="glass-panel rounded-lg p-6">
        <h2 className="text-xl font-bold tracking-wide mb-4">QUERY INTERFACE</h2>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter IP address or domain (e.g., 185.220.101.47)"
              className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg font-mono text-white placeholder-slate-500 focus:outline-none focus:border-safe-cyan/50 transition-colors"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-safe-cyan/20 border border-safe-cyan/50 rounded-lg text-safe-cyan font-bold tracking-wide hover:bg-safe-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                SCANNING...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                SCAN
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass-panel rounded-lg p-6 border-2 border-signal-red/50">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-signal-red" />
            <div>
              <h3 className="text-lg font-bold text-signal-red mb-1">SYSTEM OFFLINE</h3>
              <p className="text-sm text-slate-400 font-mono">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6">
          <IntelCard data={data} />
          <ThreatRadar data={data} />
        </div>
      )}
    </div>
  );
}

