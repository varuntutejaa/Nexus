"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useSimulation } from "@/lib/simulation-context";
import { formatTimeAgo, SEVERITY_COLORS } from "@/lib/format";
import type { Severity } from "@/lib/types";
import HudCorners from "./HudCorners";

const SEVERITIES: (Severity | "all")[] = ["all", "low", "medium", "high", "critical"];
const SEVERITY_RANK: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export default function AnomalyFeed({ limit }: { limit?: number }) {
  const { anomalies, timelines, selectTimeline } = useSimulation();
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [sortBySeverity, setSortBySeverity] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    let list = filter === "all" ? anomalies : anomalies.filter((a) => a.severity === filter);
    if (sortBySeverity) {
      list = [...list].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
    }
    return limit ? list.slice(0, limit) : list;
  }, [anomalies, filter, sortBySeverity, limit]);

  function jumpToTimeline(timelineId: string) {
    const exists = timelines.find((t) => t.id === timelineId);
    if (exists) selectTimeline(timelineId);
  }

  return (
    <div className="panel hud-corners relative flex h-full flex-col p-4">
      <HudCorners />
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-violet" />
          <h3 className="font-display text-sm font-semibold text-white">Anomaly Feed</h3>
        </div>
        <button
          onClick={() => setSortBySeverity((s) => !s)}
          className={`rounded px-2 py-1 text-[10px] tracking-wide transition cursor-pointer ${
            sortBySeverity
              ? "bg-violet/20 text-violet"
              : "text-lavender-dim hover:text-white"
          }`}
        >
          SORT BY SEVERITY
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {SEVERITIES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wide transition cursor-pointer ${
              filter === s
                ? "border-violet/60 bg-violet/20 text-white"
                : "border-white/10 text-lavender-dim hover:border-violet/30 hover:text-lavender"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {filtered.map((a) => {
            const c = SEVERITY_COLORS[a.severity];
            return (
              <motion.button
                key={a.id}
                layout
                initial={{ opacity: 0, x: 24, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -24, height: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={() => jumpToTimeline(a.timelineId)}
                className={`block w-full rounded-md border ${c.border} ${c.bg} px-3 py-2 text-left transition hover:brightness-125 cursor-pointer`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold ${c.text}`}>{a.title}</span>
                  <span
                    className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-wide ${c.border} ${c.text}`}
                  >
                    {a.severity}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-lavender-dim">{a.detail}</div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-lavender-dim/70">
                  <span className="font-mono-data">{a.timelineName}</span>
                  <span className="font-mono-data">{formatTimeAgo(a.timestamp, now)}</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-lavender-dim">
            No anomalies match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
