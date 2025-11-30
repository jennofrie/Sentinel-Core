import LayoutShell from "@/components/LayoutShell";
import LogTerminal from "@/components/settings/LogTerminal";

export default function SettingsPage() {
  return (
    <LayoutShell>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">SETTINGS</h1>
          <p className="text-slate-400 font-mono text-sm">System Configuration & Logs</p>
        </div>

        <div className="space-y-6">
          {/* System Log Terminal */}
          <div>
            <h2 className="text-xl font-bold tracking-wide mb-4 text-safe-cyan">
              SYSTEM LOG TERMINAL
            </h2>
            <LogTerminal />
          </div>

          {/* Future Settings Sections */}
          <div className="glass-panel rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-bold tracking-wide mb-4">CONFIGURATION</h2>
            <p className="text-slate-400 font-mono text-sm">
              Additional settings options will be added here...
            </p>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}

