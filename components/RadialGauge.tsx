"use client";

import { motion } from "framer-motion";

export default function RadialGauge({
  value,
  size = 56,
  strokeWidth = 4,
  color = "#00D9FF",
  showValue = true,
  ticks = true,
  decimals = 0,
  className = "",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showValue?: boolean;
  ticks?: boolean;
  decimals?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - clamped / 100);

  const tickCount = 12;
  const tickMarks = ticks
    ? Array.from({ length: tickCount }, (_, i) => {
        const angle = (i / tickCount) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const outerR = radius + strokeWidth / 2 + 2;
        const innerR = outerR - 3;
        return {
          x1: center + innerR * Math.cos(rad),
          y1: center + innerR * Math.sin(rad),
          x2: center + outerR * Math.cos(rad),
          y2: center + outerR * Math.sin(rad),
        };
      })
    : [];

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {tickMarks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="var(--lavender-dim)"
            strokeWidth={1}
            opacity={0.35}
          />
        ))}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(122,147,168,0.18)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono-data font-semibold tabular-nums"
            style={{ fontSize: size * 0.24, color }}
          >
            {clamped.toFixed(decimals)}
          </span>
        </div>
      )}
    </div>
  );
}
