export function formatPopulation(billions: number) {
  if (billions >= 1) return `${billions.toFixed(2)}B`;
  return `${Math.round(billions * 1000)}M`;
}

export function formatTimeAgo(timestamp: number, now: number) {
  const diff = Math.max(0, now - timestamp);
  const s = Math.floor(diff / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function formatClock(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export const STATUS_COLORS = {
  stable: { text: "text-cyan", ring: "ring-cyan-400/40", hex: "#22d3ee", glow: "glow-cyan" },
  atrisk: { text: "text-amber", ring: "ring-amber-400/40", hex: "#f59e0b", glow: "glow-amber" },
  critical: { text: "text-red", ring: "ring-red-400/40", hex: "#ef4444", glow: "glow-red" },
} as const;

export const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: "bg-cyan/10", text: "text-cyan", border: "border-cyan/30" },
  medium: { bg: "bg-amber/10", text: "text-amber", border: "border-amber/30" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-400/30" },
  critical: { bg: "bg-red/10", text: "text-red", border: "border-red/30" },
};
