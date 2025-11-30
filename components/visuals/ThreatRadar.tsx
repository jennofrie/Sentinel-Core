"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { ThreatResult } from "@/types/intel";
import WorldMapVisualization from "./WorldMapVisualization";

interface ThreatRadarProps {
  data: ThreatResult;
}

export default function ThreatRadar({ data }: ThreatRadarProps) {
  // Extract data from new structure
  const vtStats = data.data.virusTotal?.data?.attributes?.last_analysis_stats;
  const maliciousCount = vtStats?.malicious || 0;
  const suspiciousCount = vtStats?.suspicious || 0;
  const totalEngines = (vtStats?.harmless || 0) + maliciousCount + suspiciousCount + (vtStats?.undetected || 0);
  const maliciousScore = totalEngines > 0 
    ? Math.round((maliciousCount / totalEngines) * 100) 
    : 0;
  
  const domains = data.data.virusTotal?.data?.attributes?.last_https_certificate?.extensions?.subject_alternative_name || [];
  const phishingScore = Math.min(100, domains.filter((d: string) => !d.startsWith("*")).length * 20);
  
  const vulns = data.data.shodan?.vulns || [];
  const vulnerabilityScore = Math.min(100, vulns.length * 15);

  // Map ThreatResult to radar chart data
  // Using risk vectors: Malicious, Spam, Phishing, Vulnerability
  const radarData = [
    {
      category: "Malicious",
      value: Math.max(maliciousScore, Math.min(100, data.riskScore)),
      fullMark: 100,
    },
    {
      category: "Spam",
      value: Math.min(100, suspiciousCount * 10), // Derived from suspicious engines
      fullMark: 100,
    },
    {
      category: "Phishing",
      value: phishingScore,
      fullMark: 100,
    },
    {
      category: "Vulnerability",
      value: vulnerabilityScore || Math.min(100, data.riskScore * 0.7),
      fullMark: 100,
    },
  ];

  const strokeColor = data.riskScore > 80 ? "#FF0033" : data.riskScore < 50 ? "#00F0FF" : "#FFBF00";
  const fillColor = data.riskScore > 80 ? "#FF0033" : data.riskScore < 50 ? "#00F0FF" : "#FFBF00";

  return (
    <div className="glass-panel rounded-lg p-6">
      <h2 className="text-xl font-bold tracking-wide mb-6">THREAT RADAR</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Radar Chart */}
        <div className="h-[400px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="transparent" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "Rajdhani" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Threat Level"
                dataKey="value"
                stroke={strokeColor}
                fill={fillColor}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Right Column: World Map Visualization */}
        <div className="h-[400px] w-full">
          <WorldMapVisualization data={data} />
        </div>
      </div>
    </div>
  );
}

