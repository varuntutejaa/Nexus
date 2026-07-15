"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HistoryPoint } from "@/lib/types";

export default function StabilityTrendChart({
  data,
  color = "#8b5cf6",
  height = 220,
}: {
  data: HistoryPoint[];
  color?: string;
  height?: number;
}) {
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
        <YAxis domain={[0, 100]} hide />
        <Tooltip
          cursor={{ stroke: color, strokeOpacity: 0.3 }}
          contentStyle={{
            background: "#0f0c1f",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 8,
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
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
