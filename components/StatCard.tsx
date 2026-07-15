"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";

export default function StatCard({
  label,
  value,
  decimals = 0,
  suffix = "",
  icon: Icon,
  accent = "violet",
  delay = 0,
}: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  icon: LucideIcon;
  accent?: "violet" | "cyan" | "amber" | "red";
  delay?: number;
}) {
  const accentMap: Record<string, string> = {
    violet: "text-violet border-violet/25 bg-violet/10",
    cyan: "text-cyan border-cyan/25 bg-cyan/10",
    amber: "text-amber border-amber/25 bg-amber/10",
    red: "text-red border-red/25 bg-red/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className="panel flex items-center gap-4 p-4"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${accentMap[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-[11px] tracking-wider text-lavender-dim">{label}</div>
        <div className="font-mono-data text-2xl font-semibold text-white">
          <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
        </div>
      </div>
    </motion.div>
  );
}
