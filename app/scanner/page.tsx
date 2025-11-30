import LayoutShell from "@/components/LayoutShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Scanner from "@/components/dashboard/Scanner";

export default function ScannerPage() {
  return (
    <ProtectedRoute>
      <LayoutShell>
        <div className="p-8">
          <Scanner />
        </div>
      </LayoutShell>
    </ProtectedRoute>
  );
}

