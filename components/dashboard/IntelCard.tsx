"use client";

import type { ThreatResult } from "@/types/intel";
import { Shield, AlertTriangle, MapPin, Globe, CheckCircle, XCircle, WifiOff } from "lucide-react";

interface IntelCardProps {
  data: ThreatResult;
}

export default function IntelCard({ data }: IntelCardProps) {
  const getRiskColor = (score: number) => {
    if (score > 80) return "text-signal-red";
    if (score > 50) return "text-cyber-amber";
    return "text-safe-cyan";
  };

  const getRiskBorder = (score: number) => {
    if (score > 80) return "border-signal-red/50";
    if (score > 50) return "border-cyber-amber/50";
    return "border-safe-cyan/50";
  };

  // Extract data from new structure
  const vtAttributes = data.data.virusTotal?.data?.attributes;
  const isp = vtAttributes?.as_owner || "Unknown";
  const geo = vtAttributes ? {
    country: vtAttributes.country || "Unknown",
    countryCode: vtAttributes.country_code || "XX",
    city: vtAttributes.city || "Unknown",
  } : null;
  const domains = vtAttributes?.last_https_certificate?.extensions?.subject_alternative_name || [];
  const shodanPorts = data.data.shodan?.ports || [];
  const shodanVulns = data.data.shodan?.vulns || [];
  const abuseIPDBData = data.data.abuseIPDB;

  return (
    <div className={`glass-panel rounded-lg p-6 border-2 ${getRiskBorder(data.riskScore)}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {data.verdict === "MALICIOUS" ? (
            <XCircle className="w-6 h-6 text-signal-red" />
          ) : (
            <CheckCircle className="w-6 h-6 text-safe-cyan" />
          )}
          <h2 className="text-2xl font-bold tracking-wide">THREAT INTELLIGENCE</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-2xl font-bold font-mono ${data.verdict === "MALICIOUS" ? "text-signal-red" : "text-safe-cyan"}`}>
            {data.verdict}
          </div>
          <div className={`text-3xl font-bold font-mono ${getRiskColor(data.riskScore)}`}>
            {data.riskScore}/100
          </div>
        </div>
      </div>

      {/* IP Address */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-mono text-slate-400 uppercase">Target IOC</span>
        </div>
        <p className="text-xl font-mono text-white">{data.ip}</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* ISP */}
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase">ISP</span>
          <p className="text-sm font-mono text-white mt-1">{isp}</p>
        </div>

        {/* Verdict */}
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase">Verdict</span>
          <p className={`text-sm font-mono mt-1 ${data.verdict === "MALICIOUS" ? "text-signal-red" : "text-safe-cyan"}`}>
            {data.verdict}
          </p>
        </div>

        {/* Location */}
        {geo && (
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Location</span>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-mono text-white">
                {geo.city}, {geo.countryCode}
              </p>
            </div>
          </div>
        )}

        {/* Open Ports (from Shodan) */}
        {shodanPorts.length > 0 && (
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Open Ports</span>
            <p className="text-sm font-mono text-white mt-1">
              {shodanPorts.slice(0, 5).join(", ")}
              {shodanPorts.length > 5 ? ` +${shodanPorts.length - 5}` : ""}
            </p>
          </div>
        )}
      </div>

      {/* Module Status Indicators */}
      <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* VirusTotal Status */}
        <div className="glass-panel rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            {vtAttributes ? (
              <>
                <div className="w-2 h-2 bg-safe-cyan rounded-full animate-pulse" />
                <span className="text-xs font-mono text-slate-400 uppercase">VirusTotal</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-cyber-amber" />
                <span className="text-xs font-mono text-cyber-amber uppercase">VirusTotal</span>
              </>
            )}
          </div>
          <p className={`text-xs font-mono ${vtAttributes ? "text-safe-cyan" : "text-cyber-amber"}`}>
            {vtAttributes ? "ONLINE" : "MODULE OFFLINE"}
          </p>
        </div>

        {/* Shodan Status */}
        <div className="glass-panel rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            {data.data.shodan ? (
              <>
                <div className="w-2 h-2 bg-safe-cyan rounded-full animate-pulse" />
                <span className="text-xs font-mono text-slate-400 uppercase">Shodan</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-cyber-amber" />
                <span className="text-xs font-mono text-cyber-amber uppercase">Shodan</span>
              </>
            )}
          </div>
          <p className={`text-xs font-mono ${data.data.shodan ? "text-safe-cyan" : "text-cyber-amber"}`}>
            {data.data.shodan ? "ONLINE" : "MODULE OFFLINE"}
          </p>
        </div>

        {/* Safe Browsing Status */}
        <div className="glass-panel rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            {data.data.safeBrowsing ? (
              <>
                <div className="w-2 h-2 bg-safe-cyan rounded-full animate-pulse" />
                <span className="text-xs font-mono text-slate-400 uppercase">Safe Browsing</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-cyber-amber" />
                <span className="text-xs font-mono text-cyber-amber uppercase">Safe Browsing</span>
              </>
            )}
          </div>
          <p className={`text-xs font-mono ${data.data.safeBrowsing ? "text-safe-cyan" : "text-cyber-amber"}`}>
            {data.data.safeBrowsing ? "ONLINE" : "MODULE OFFLINE"}
          </p>
        </div>

        {/* AbuseIPDB Status */}
        <div className="glass-panel rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            {data.data.abuseIPDB ? (
              <>
                <div className="w-2 h-2 bg-safe-cyan rounded-full animate-pulse" />
                <span className="text-xs font-mono text-slate-400 uppercase">AbuseIPDB</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-cyber-amber" />
                <span className="text-xs font-mono text-cyber-amber uppercase">AbuseIPDB</span>
              </>
            )}
          </div>
          <p className={`text-xs font-mono ${data.data.abuseIPDB ? "text-safe-cyan" : "text-cyber-amber"}`}>
            {data.data.abuseIPDB ? "ONLINE" : "MODULE OFFLINE"}
          </p>
        </div>
      </div>

      {/* Vulnerabilities */}
      {shodanVulns.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-signal-red" />
            <span className="text-xs font-mono text-slate-400 uppercase">
              Vulnerabilities ({shodanVulns.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {shodanVulns.map((vuln: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-signal-red/20 border border-signal-red/50 rounded font-mono text-xs text-signal-red"
              >
                {vuln}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Associated Domains */}
      {domains.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-cyber-amber" />
            <span className="text-xs font-mono text-slate-400 uppercase">
              Associated Domains ({domains.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {domains.filter((d: string) => !d.startsWith("*")).slice(0, 5).map((domain: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-slate-300"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AbuseIPDB Details */}
      {abuseIPDBData && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-safe-cyan" />
            <span className="text-xs font-mono text-slate-400 uppercase">
              AbuseIPDB Intelligence
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Abuse Confidence Score */}
            <div className="glass-panel rounded-lg p-3 border border-white/10">
              <span className="text-xs font-mono text-slate-400 uppercase">Abuse Confidence</span>
              <p className={`text-lg font-bold font-mono mt-1 ${
                (abuseIPDBData.abuseConfidenceScore || 0) > 75 
                  ? "text-signal-red" 
                  : (abuseIPDBData.abuseConfidenceScore || 0) > 25
                  ? "text-cyber-amber"
                  : "text-safe-cyan"
              }`}>
                {abuseIPDBData.abuseConfidenceScore ?? 0}%
              </p>
            </div>

            {/* Reports */}
            <div className="glass-panel rounded-lg p-3 border border-white/10">
              <span className="text-xs font-mono text-slate-400 uppercase">Reports</span>
              <p className="text-sm font-mono text-white mt-1">
                {abuseIPDBData.totalReports ?? 0} reports from {abuseIPDBData.numDistinctUsers ?? 0} users
              </p>
            </div>

            {/* Country/ISP from AbuseIPDB */}
            {(abuseIPDBData.countryCode || abuseIPDBData.isp) && (
              <div className="glass-panel rounded-lg p-3 border border-white/10">
                <span className="text-xs font-mono text-slate-400 uppercase">Location</span>
                <p className="text-sm font-mono text-white mt-1">
                  {abuseIPDBData.countryName || abuseIPDBData.countryCode || "Unknown"}
                </p>
              </div>
            )}

            {/* Usage Type */}
            {abuseIPDBData.usageType && (
              <div className="glass-panel rounded-lg p-3 border border-white/10">
                <span className="text-xs font-mono text-slate-400 uppercase">Usage Type</span>
                <p className="text-sm font-mono text-white mt-1">
                  {abuseIPDBData.usageType}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

