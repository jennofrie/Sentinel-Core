import LayoutShell from "@/components/LayoutShell";
import { Shield } from "lucide-react";

export default function MonitoredAssetsPage() {
  return (
    <LayoutShell>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">MONITORED ASSETS</h1>
          <p className="text-slate-400 font-mono text-sm">Track and monitor your critical assets</p>
        </div>

        <div className="glass-panel rounded-lg p-12 border border-white/10 text-center">
          <Shield className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-slate-300">Coming Soon</h2>
          <p className="text-slate-400 font-mono text-sm">
            Asset monitoring features are under development
          </p>
        </div>
      </div>
    </LayoutShell>
  );
}

