"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";
import RadialGauge from "./RadialGauge";
import HudCorners from "./HudCorners";

const ACCENT_HEX: Record<string, string> = {
  violet: "#00D9FF",
  cyan: "#00D9FF",
  amber: "#FFB84D",
  red: "#FF3B3B",
  teal: "#3FE0A0",
};

export default function StatCard({
  label,
  value,
  decimals = 0,
  suffix = "",
  icon: Icon,
  accent = "violet",
  gaugeValue,
  delay = 0,
}: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  icon: LucideIcon;
  accent?: "violet" | "cyan" | "amber" | "red" | "teal";
  gaugeValue?: number;
  delay?: number;
}) {
  const color = ACCENT_HEX[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className="panel hud-corners relative flex items-center gap-4 p-4 transition-shadow hover:glow-violet"
    >
      <HudCorners />
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        <RadialGauge
          value={gaugeValue ?? 70}
          size={44}
          strokeWidth={3}
          color={color}
          showValue={false}
        />
        <Icon className="absolute h-4 w-4" style={{ color }} />
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
