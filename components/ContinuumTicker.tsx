"use client";

import { useMemo } from "react";
import { Radio } from "lucide-react";
import { BROADCAST_LINES } from "@/lib/lore";

export default function ContinuumTicker() {
  const content = useMemo(() => BROADCAST_LINES.join("     •     "), []);

  return (
    <div className="panel mx-4 mt-3 flex items-center gap-3 overflow-hidden px-4 py-1.5">
      <Radio className="h-3 w-3 shrink-0 text-violet animate-pulse-soft" />
      <div className="relative flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee whitespace-nowrap font-mono-data text-[10px] tracking-wide text-cyan/70">
          <span className="pr-16">{content}</span>
          <span className="pr-16">{content}</span>
        </div>
      </div>
    </div>
  );
}
