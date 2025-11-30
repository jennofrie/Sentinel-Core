"use client";

import { 
  Home, 
  Search, 
  Activity, 
  Shield, 
  Database,
  Settings,
  X,
  Menu
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Activity, label: "Threat Radar", href: "/threat-radar" },
  { icon: Shield, label: "Monitored Assets", href: "/monitored-assets" },
  { icon: Database, label: "History", href: "/history" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const NavButton = ({ item, isCollapsed }: { item: typeof navItems[0]; isCollapsed: boolean }) => {
    const Icon = item.icon;
    // Only highlight if on the exact route (or with trailing slash)
    const isActive = pathname === item.href || pathname === `${item.href}/`;

    if (isCollapsed) {
      return (
        <Link
          href={item.href}
          className={`p-2 rounded-lg transition-all ${
            isActive
              ? "bg-white/10 text-white border border-white/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
          title={item.label}
        >
          <Icon className="w-5 h-5" />
        </Link>
      );
    }

    return (
      <Link
        href={item.href}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? "bg-white/10 text-white border border-white/20"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium tracking-wide">{item.label}</span>
      </Link>
    );
  };

  if (!isOpen) {
    return (
      <aside className="w-16 glass-panel border-r border-white/10 flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors mb-4"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavButton key={item.label} item={item} isCollapsed={true} />
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-64 glass-panel border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-wider text-safe-cyan">NAVIGATION</h2>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavButton key={item.label} item={item} isCollapsed={false} />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="glass-panel rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-safe-cyan rounded-full animate-pulse" />
            <span className="text-xs font-mono text-slate-400">SYSTEM STATUS</span>
          </div>
          <div className="text-sm text-white font-mono">OPERATIONAL</div>
        </div>
      </div>
    </aside>
  );
}
