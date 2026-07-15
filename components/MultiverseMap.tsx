"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSimulation } from "@/lib/simulation-context";
import { STATUS_COLORS } from "@/lib/format";
import type { Timeline } from "@/lib/types";

function hash(str: string, seed: number) {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h ^ str.charCodeAt(i), 2654435761) >>> 0);
  }
  return ((h % 1000) / 1000) * 2 - 1;
}

const CENTER = 500;

function nodePosition(tl: Timeline) {
  const r = tl.radius * 460;
  const x = CENTER + r * Math.cos(tl.angle);
  const y = CENTER + r * Math.sin(tl.angle);
  return { x, y };
}

export default function MultiverseMap({ compact = false }: { compact?: boolean }) {
  const { timelines, selectTimeline, selectedTimelineId } = useSimulation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const positioned = useMemo(
    () =>
      timelines.map((tl) => {
        const { x, y } = nodePosition(tl);
        const dx = hash(tl.id, 17) * (14 + tl.depth * 2);
        const dy = hash(tl.id, 91) * (14 + tl.depth * 2);
        const duration = 8 + tl.driftSpeed * 22;
        return { tl, x, y, dx, dy, duration };
      }),
    [timelines]
  );

  return (
    <div className="relative aspect-square w-full max-w-[720px] mx-auto select-none">
      <svg viewBox="0 0 1000 1000" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="nexusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c7c2e6" stopOpacity={0.9} />
            <stop offset="35%" stopColor="#8b5cf6" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* branch lines */}
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
              strokeWidth={tl.status === "critical" ? 1.4 : 0.8}
              strokeOpacity={tl.status === "critical" ? 0.35 : 0.14}
              strokeDasharray={tl.status === "atrisk" ? "4 5" : undefined}
            />
          );
        })}

        {/* central nexus */}
        <circle cx={CENTER} cy={CENTER} r={70} fill="url(#nexusGlow)" />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={22}
          fill="#c7c2e6"
          className="animate-pulse-soft"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <circle cx={CENTER} cy={CENTER} r={22} fill="none" stroke="#8b5cf6" strokeWidth={1.5} />
        {!compact && (
          <text
            x={CENTER}
            y={CENTER + 46}
            textAnchor="middle"
            className="fill-white font-display"
            fontSize={13}
            letterSpacing={3}
          >
            NEXUS
          </text>
        )}

        {/* nodes */}
        {positioned.map(({ tl, x, y, dx, dy, duration }) => {
          const colors = STATUS_COLORS[tl.status];
          const isSelected = tl.id === selectedTimelineId;
          const isHovered = tl.id === hoveredId;
          const baseR = compact ? 5 + tl.depth * 0.6 : 6 + tl.depth * 0.8;
          return (
            <motion.g
              key={tl.id}
              animate={{ x: [0, dx, 0], y: [0, dy, 0] }}
              transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
              style={{ cursor: "pointer" }}
              onClick={() => selectTimeline(tl.id)}
              onMouseEnter={() => setHoveredId(tl.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {tl.status === "critical" && (
                <circle
                  cx={x}
                  cy={y}
                  r={baseR + 6}
                  fill="none"
                  stroke={colors.hex}
                  strokeWidth={1.5}
                  opacity={0.6}
                  className="animate-pulse-crit"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={baseR}
                fill={colors.hex}
                className={tl.status !== "critical" ? "animate-pulse-soft" : ""}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  filter: `drop-shadow(0 0 ${isHovered || isSelected ? 10 : 5}px ${colors.hex})`,
                }}
              />
              {(isSelected || isHovered) && (
                <circle
                  cx={x}
                  cy={y}
                  r={baseR + 6}
                  fill="none"
                  stroke={isSelected ? "#fff" : colors.hex}
                  strokeOpacity={0.7}
                  strokeWidth={1.5}
                />
              )}
              {(isHovered || isSelected) && (
                <g>
                  <rect
                    x={x + baseR + 8}
                    y={y - 16}
                    width={Math.max(120, tl.name.length * 6.5)}
                    height={32}
                    rx={6}
                    fill="#0f0c1f"
                    stroke="rgba(139,92,246,0.4)"
                  />
                  <text
                    x={x + baseR + 16}
                    y={y - 3}
                    className="fill-white font-display"
                    fontSize={11}
                  >
                    {tl.name}
                  </text>
                  <text
                    x={x + baseR + 16}
                    y={y + 10}
                    className="font-mono-data"
                    fontSize={10}
                    fill={colors.hex}
                  >
                    {tl.stability.toFixed(0)}% STABLE
                  </text>
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
