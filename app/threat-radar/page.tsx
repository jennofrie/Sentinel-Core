import LayoutShell from "@/components/LayoutShell";
import ThreatRadarView from "@/components/dashboard/ThreatRadarView";

export default function ThreatRadarPage() {
  return (
    <LayoutShell>
      <div className="p-8">
        <ThreatRadarView />
      </div>
    </LayoutShell>
  );
}

