"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSimulation } from "@/lib/simulation-context";
import { STATUS_COLORS } from "@/lib/format";
import type { StabilityStatus, Timeline } from "@/lib/types";

const LEGEND: { status: StabilityStatus; label: string }[] = [
  { status: "stable", label: "Stable" },
  { status: "atrisk", label: "At Risk" },
  { status: "critical", label: "Critical" },
];

const CENTER = 500;
const MAX_R = 460;
const RING_FRACTIONS = [0.25, 0.5, 0.75, 1];

function nodePosition(tl: Timeline) {
  const r = tl.radius * MAX_R;
  const x = CENTER + r * Math.cos(tl.angle);
  const y = CENTER + r * Math.sin(tl.angle);
  return { x, y };
}

function polar(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

function sweepWedgePath(halfAngle = 16, r = MAX_R + 20) {
  const a = polar(-halfAngle, r);
  const b = polar(halfAngle, r);
  return `M ${CENTER} ${CENTER} L ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y} Z`;
}

function TravelingPulse({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.circle
      r={3}
      fill={color}
      initial={{ cx: CENTER, cy: CENTER, opacity: 0 }}
      animate={{ cx: [CENTER, x], cy: [CENTER, y], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    />
  );
}

export default function MultiverseMap({ compact = false }: { compact?: boolean }) {
  const { timelines, selectTimeline, selectedTimelineId } = useSimulation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StabilityStatus | "all">("all");

  const positioned = useMemo(
    () =>
      timelines.map((tl) => {
        const { x, y } = nodePosition(tl);
        return { tl, x, y };
      }),
    [timelines]
  );

  return (
    <div className="relative aspect-square w-full max-w-[720px] mx-auto select-none">
      <svg viewBox="0 0 1000 1000" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="nexusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F2F6FA" stopOpacity={0.9} />
            <stop offset="35%" stopColor="#00D9FF" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="sweepFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity={0} />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity={0.14} />
          </linearGradient>
        </defs>

        {/* orbital rings */}
        {RING_FRACTIONS.map((f) => (
          <circle
            key={f}
            cx={CENTER}
            cy={CENTER}
            r={MAX_R * f}
            fill="none"
            stroke="rgba(0,217,255,0.14)"
            strokeWidth={1}
            strokeDasharray={f === 1 ? undefined : "2 6"}
          />
        ))}

        {/* radar sweep */}
        <g
          className="animate-radar-sweep"
          style={{ transformBox: "view-box", transformOrigin: `${CENTER}px ${CENTER}px` }}
        >
          <path d={sweepWedgePath()} fill="url(#sweepFade)" />
        </g>

        {/* branch lines */}
        {positioned.map(({ tl, x, y }) => {
          const colors = STATUS_COLORS[tl.status];
          const dimmed = filter !== "all" && tl.status !== filter;
          const baseOpacity = tl.status === "critical" ? 0.4 : 0.16;
          return (
            <line
              key={`line-${tl.id}`}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke={colors.hex}
              strokeWidth={tl.status === "critical" ? 1.4 : 0.7}
              strokeOpacity={dimmed ? baseOpacity * 0.25 : baseOpacity}
            />
          );
        })}

        {/* traveling light pulse — critical connectors only */}
        {positioned
          .filter(({ tl }) => tl.status === "critical" && (filter === "all" || filter === "critical"))
          .map(({ tl, x, y }) => (
            <TravelingPulse key={`pulse-${tl.id}`} x={x} y={y} color={STATUS_COLORS.critical.hex} />
          ))}

        {/* central nexus */}
        <circle cx={CENTER} cy={CENTER} r={70} fill="url(#nexusGlow)" />
        <circle cx={CENTER} cy={CENTER} r={20} fill="#F2F6FA" />
        <circle cx={CENTER} cy={CENTER} r={20} fill="none" stroke="#00D9FF" strokeWidth={1.5} />
        <circle cx={CENTER} cy={CENTER} r={30} fill="none" stroke="#00D9FF" strokeWidth={1} opacity={0.4} />
        {!compact && (
          <text
            x={CENTER}
            y={CENTER + 46}
            textAnchor="middle"
            className="fill-white font-hud"
            fontSize={13}
            letterSpacing={3}
          >
            NEXUS
          </text>
        )}

        {/* nodes */}
        {positioned.map(({ tl, x, y }) => {
          const colors = STATUS_COLORS[tl.status];
          const isSelected = tl.id === selectedTimelineId;
          const isHovered = tl.id === hoveredId;
          const baseR = compact ? 5 + tl.depth * 0.6 : 6 + tl.depth * 0.8;
          const dimmed = filter !== "all" && tl.status !== filter;
          const isCritical = tl.status === "critical";
          return (
            <motion.g
              key={tl.id}
              initial={{ opacity: 1 }}
              animate={{ opacity: dimmed ? 0.18 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ cursor: "pointer" }}
              onClick={() => selectTimeline(tl.id)}
              onMouseEnter={() => setHoveredId(tl.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {isCritical && (
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
                style={{
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
                    rx={4}
                    fill="#0a1628"
                    stroke="rgba(0,217,255,0.4)"
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

      {!compact && (
        <div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-1.5 rounded-md border border-white/10 bg-void-raised/80 px-2.5 py-1.5 backdrop-blur-sm">
          <button
            onClick={() => setFilter("all")}
            className={`rounded px-2 py-0.5 text-[9px] tracking-wide transition cursor-pointer ${
              filter === "all" ? "bg-white/15 text-white" : "text-lavender-dim hover:text-lavender"
            }`}
          >
            ALL
          </button>
          {LEGEND.map(({ status, label }) => {
            const colors = STATUS_COLORS[status];
            const isActive = filter === status;
            return (
              <button
                key={status}
                onClick={() => setFilter(isActive ? "all" : status)}
                className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-[9px] tracking-wide transition cursor-pointer ${
                  isActive ? "bg-white/15 text-white" : "text-lavender-dim hover:text-lavender"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: colors.hex, boxShadow: `0 0 4px ${colors.hex}` }}
                />
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
