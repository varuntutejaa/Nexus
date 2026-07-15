"use client";

import { LayoutDashboard, Network, AlertCircle, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Tab = "overview" | "map" | "anomalies" | "console";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "map", label: "Multiverse Map", icon: Network },
  { id: "anomalies", label: "Anomaly Feed", icon: AlertCircle },
  { id: "console", label: "Stabilization", icon: SlidersHorizontal },
];

export default function Sidebar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <nav className="panel mx-4 mb-4 flex shrink-0 gap-2 overflow-x-auto p-2 md:mb-0 md:mr-0 md:w-52 md:flex-col md:overflow-visible">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-xs font-medium tracking-wide transition cursor-pointer ${
              isActive
                ? "bg-violet/20 text-white glow-violet"
                : "text-lavender-dim hover:bg-white/5 hover:text-lavender"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
