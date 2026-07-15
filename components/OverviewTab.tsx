"use client";

import { AlertCircle, AlertTriangle, Orbit, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { useSimulation } from "@/lib/simulation-context";
import StatCard from "./StatCard";
import StabilityTrendChart from "./StabilityTrendChart";
import MultiverseMap from "./MultiverseMap";
import AnomalyFeed from "./AnomalyFeed";
import HudCorners from "./HudCorners";
import type { Tab } from "./Sidebar";

export default function OverviewTab({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { timelines, anomalies, overallHistory, actionsToday } = useSimulation();
  const criticalCount = timelines.filter((t) => t.status === "critical").length;
  const stableCount = timelines.filter((t) => t.status === "stable").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Monitored Timelines"
          value={timelines.length}
          icon={Orbit}
          accent="cyan"
          gaugeValue={(stableCount / Math.max(1, timelines.length)) * 100}
          delay={0}
        />
        <StatCard
          label="Active Anomalies"
          value={anomalies.length}
          icon={AlertCircle}
          accent="amber"
          gaugeValue={Math.min(100, (anomalies.length / 30) * 100)}
          delay={0.05}
        />
        <StatCard
          label="Critical Alerts"
          value={criticalCount}
          icon={AlertTriangle}
          accent="red"
          gaugeValue={(criticalCount / Math.max(1, timelines.length)) * 100}
          delay={0.1}
        />
        <StatCard
          label="Actions Taken Today"
          value={actionsToday}
          icon={Wrench}
          accent="teal"
          gaugeValue={Math.min(100, (actionsToday / 10) * 100)}
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="panel hud-corners relative p-4"
        >
          <HudCorners />
          <div className="mb-1 text-[10px] tracking-widest text-lavender-dim">
            MULTIVERSE STABILITY TREND
          </div>
          <div className="mb-3 text-xs text-lavender-dim">Live rolling average across all timelines</div>
          <StabilityTrendChart data={overallHistory} color="#00D9FF" height={260} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="panel hud-corners relative flex flex-col items-center justify-center p-4"
        >
          <HudCorners />
          <div className="mb-2 flex w-full items-center justify-between">
            <span className="text-[10px] tracking-widest text-lavender-dim">MULTIVERSE MAP</span>
            <button
              onClick={() => onNavigate("map")}
              className="text-[10px] tracking-wide text-violet transition hover:text-white cursor-pointer"
            >
              VIEW FULL MAP →
            </button>
          </div>
          <MultiverseMap compact />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="h-80"
      >
        <AnomalyFeed limit={6} />
      </motion.div>
    </div>
  );
}
