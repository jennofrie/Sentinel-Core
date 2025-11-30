import LayoutShell from "@/components/LayoutShell";
import CommandCenter from "@/components/dashboard/CommandCenter";

export default function Home() {
  return (
    <LayoutShell>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">DASHBOARD</h1>
          <p className="text-slate-400 font-mono text-sm">Threat Intelligence & Analysis Center</p>
        </div>
        <CommandCenter />
      </div>
    </LayoutShell>
  );
}

