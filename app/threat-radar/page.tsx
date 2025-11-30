import LayoutShell from "@/components/LayoutShell";
import ThreatRadarView from "@/components/dashboard/ThreatRadarView";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ThreatRadarPage() {
  return (
    <ProtectedRoute>
      <LayoutShell>
        <div className="p-8">
          <ThreatRadarView />
        </div>
      </LayoutShell>
    </ProtectedRoute>
  );
}

