"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Radio } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";
import { formatClock, STATUS_COLORS } from "@/lib/format";
import { useSimulation } from "@/lib/simulation-context";

export default function Header({ onCrisis }: { onCrisis: () => void }) {
  const { operatorName, overallStability, timelines } = useSimulation();
  const [now, setNow] = useState<Date | null>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const status =
    overallStability < 35 ? "critical" : overallStability < 65 ? "atrisk" : "stable";
  const colors = STATUS_COLORS[status];
  const criticalCount = timelines.filter((t) => t.status === "critical").length;

  return (
    <header className="panel relative z-20 mx-4 mt-4 flex flex-wrap items-center justify-between gap-4 px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet/40 bg-violet/10">
          <span className="font-display text-sm font-bold text-violet">N</span>
        </div>
        <div>
          <div className="font-display text-sm font-semibold tracking-[0.2em] text-white">
            NEXUS
          </div>
          <div className="text-[10px] tracking-widest text-lavender-dim">
            CONTINUUM CONSOLE
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Radio className="h-3.5 w-3.5 text-cyan animate-pulse-soft" />
        <span className="font-mono-data text-[11px] tracking-wider text-lavender-dim">
          MULTIVERSE STABILITY
        </span>
        <span className={`font-mono-data text-lg font-semibold ${colors.text}`}>
          <AnimatedNumber value={overallStability} decimals={1} suffix="%" />
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onCrisis}
          className="flex items-center gap-1.5 rounded-md border border-red/40 bg-red/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-red transition hover:bg-red/20 cursor-pointer"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          SIMULATE CRISIS
          {criticalCount > 0 && (
            <span className="ml-1 rounded-full bg-red px-1.5 text-[10px] text-void">
              {criticalCount}
            </span>
          )}
        </button>

        <div className="hidden text-right md:block">
          <div className="font-mono-data text-sm text-white tabular-nums">
            {now ? formatClock(now) : "--:--:--"}
          </div>
          <div className="text-[10px] tracking-widest text-lavender-dim">
            OPERATOR: {operatorName}
          </div>
        </div>
      </div>
    </header>
  );
}
