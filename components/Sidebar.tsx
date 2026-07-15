"use client";

import { LayoutDashboard, Network, AlertCircle, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

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
            className={`relative flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-xs font-medium tracking-wide transition cursor-pointer ${
              isActive
                ? "text-white"
                : "text-lavender-dim hover:bg-white/5 hover:text-lavender"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="sidebar-active-pill"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="glow-violet absolute inset-0 rounded-md bg-violet/20"
              />
            )}
            <Icon className="relative z-10 h-4 w-4 shrink-0" />
            <span className="relative z-10 whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
