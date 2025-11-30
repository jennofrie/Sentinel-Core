"use client";

import { 
  Search, 
  Radar, 
  Globe, 
  Shield, 
  Zap, 
  BarChart3,
  MapPin,
  AlertTriangle
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Multi-Source Intelligence",
    description: "Aggregate threat data from VirusTotal, AbuseIPDB, Google Safe Browsing, and Shodan in one unified interface.",
    color: "text-safe-cyan",
    borderColor: "border-safe-cyan/50",
  },
  {
    icon: Radar,
    title: "Threat Radar Visualization",
    description: "Multi-dimensional risk analysis with interactive radar charts showing malicious, spam, phishing, and vulnerability vectors.",
    color: "text-cyber-amber",
    borderColor: "border-cyber-amber/50",
  },
  {
    icon: Globe,
    title: "Geographic Intelligence",
    description: "World map visualization with animated connection paths showing threat origins and attack vectors from your location.",
    color: "text-signal-red",
    borderColor: "border-signal-red/50",
  },
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description: "Rapid IOC triage with instant risk scoring and automated threat detection for faster incident response.",
    color: "text-safe-cyan",
    borderColor: "border-safe-cyan/50",
  },
  {
    icon: BarChart3,
    title: "Historical Tracking",
    description: "Maintain search history and monitor assets over time for pattern analysis and threat hunting.",
    color: "text-cyber-amber",
    borderColor: "border-cyber-amber/50",
  },
  {
    icon: Shield,
    title: "Secure Architecture",
    description: "Server-side API proxy protects credentials with enterprise-grade security best practices.",
    color: "text-signal-red",
    borderColor: "border-signal-red/50",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">
            POWERFUL FEATURES FOR{" "}
            <span className="text-safe-cyan">BLUE TEAM</span> OPERATIONS
          </h2>
          <p className="text-slate-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            Everything you need for rapid threat intelligence analysis and incident response
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`glass-panel rounded-lg p-6 border ${feature.borderColor} hover:border-opacity-100 transition-all group`}
              >
                <div className={`${feature.color} mb-4`}>
                  <Icon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 font-mono leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

