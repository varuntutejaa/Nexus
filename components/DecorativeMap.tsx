"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { generateTimelines } from "@/lib/mock-data";
import { STATUS_COLORS } from "@/lib/format";
import type { Timeline } from "@/lib/types";

function hash(str: string, seed: number) {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 2654435761) >>> 0;
  }
  return ((h % 1000) / 1000) * 2 - 1;
}

const CENTER = 500;

function nodePosition(tl: Timeline) {
  const r = tl.radius * 470;
  return { x: CENTER + r * Math.cos(tl.angle), y: CENTER + r * Math.sin(tl.angle) };
}

/** Purely decorative, non-interactive node-graph for the landing hero. No live data needed. */
export default function DecorativeMap() {
  const [timelines] = useState<Timeline[]>(() => generateTimelines(34));

  const positioned = useMemo(
    () =>
      timelines.map((tl) => {
        const { x, y } = nodePosition(tl);
        const dx = hash(tl.id, 17) * (16 + tl.depth * 3);
        const dy = hash(tl.id, 91) * (16 + tl.depth * 3);
        const duration = 10 + tl.driftSpeed * 26;
        return { tl, x, y, dx, dy, duration };
      }),
    [timelines]
  );

  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="landingNexusGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F2F6FA" stopOpacity={0.85} />
          <stop offset="35%" stopColor="#00D9FF" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#00D9FF" stopOpacity={0} />
        </radialGradient>
      </defs>

      {positioned.map(({ tl, x, y }) => {
        const colors = STATUS_COLORS[tl.status];
        return (
          <line
            key={`line-${tl.id}`}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke={colors.hex}
            strokeWidth={0.8}
            strokeOpacity={0.12}
          />
        );
      })}

      <circle cx={CENTER} cy={CENTER} r={80} fill="url(#landingNexusGlow)" />
      <circle cx={CENTER} cy={CENTER} r={20} fill="#F2F6FA" />
      <circle cx={CENTER} cy={CENTER} r={20} fill="none" stroke="#00D9FF" strokeWidth={1.5} />

      {positioned.map(({ tl, x, y, dx, dy, duration }) => {
        const colors = STATUS_COLORS[tl.status];
        const r = 5 + tl.depth * 0.7;
        return (
          <motion.g
            key={tl.id}
            animate={{ x: [0, dx, 0], y: [0, dy, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={colors.hex}
              opacity={0.7}
              className={tl.status === "critical" ? "animate-pulse-crit" : ""}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                filter: `drop-shadow(0 0 5px ${colors.hex})`,
              }}
            />
          </motion.g>
        );
      })}
    </svg>
  );
}
