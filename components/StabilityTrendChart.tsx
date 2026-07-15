"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HistoryPoint } from "@/lib/types";

export default function StabilityTrendChart({
  data,
  color = "#00D9FF",
  height = 220,
}: {
  data: HistoryPoint[];
  color?: string;
  height?: number;
}) {
  const domain = useMemo<[number, number]>(() => {
    if (data.length === 0) return [0, 100];
    const values = data.map((d) => d.stability);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = Math.max(4, (max - min) * 0.25);
    return [Math.max(0, Math.floor(min - padding)), Math.min(100, Math.ceil(max + padding))];
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="stabilityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="t" hide />
        <YAxis domain={domain} hide />
        <Tooltip
          cursor={{ stroke: color, strokeOpacity: 0.3 }}
          contentStyle={{
            background: "#0a1628",
            border: "1px solid rgba(0,217,255,0.3)",
            borderRadius: 6,
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 12,
          }}
          labelFormatter={() => ""}
          formatter={(value) => [`${value}%`, "Stability"]}
        />
        <Area
          type="monotone"
          dataKey="stability"
          stroke={color}
          strokeWidth={2}
          fill="url(#stabilityFill)"
          isAnimationActive
          animationDuration={600}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
