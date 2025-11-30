import LayoutShell from "@/components/LayoutShell";
import Scanner from "@/components/dashboard/Scanner";

export default function ScannerPage() {
  return (
    <LayoutShell>
      <div className="p-8">
        <Scanner />
      </div>
    </LayoutShell>
  );
}

