"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "INITIALIZING CONTINUUM AUTHORITY KERNEL...",
  "ESTABLISHING NEXUS UPLINK...",
  "CALIBRATING TIMELINE RESONANCE SENSORS...",
  "LOADING MULTIVERSE TOPOLOGY MAP...",
  "SYNCING STABILITY TELEMETRY...",
  "VERIFYING OPERATOR CLEARANCE PROTOCOLS...",
  "CONTINUUM AUTHORITY ONLINE.",
];

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) {
      const t = setTimeout(onComplete, 550);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 260);
    return () => clearTimeout(t);
  }, [visibleLines, onComplete]);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 9 + 3));
    }, 180);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, filter: "brightness(3)" }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void font-mono-data text-cyan"
    >
      <div className="bg-starfield" />
      <div className="bg-grid" />
      <div className="relative z-10 w-full max-w-xl px-6">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold tracking-[0.3em] text-white font-display text-glow-violet"
          >
            NEXUS
          </motion.div>
          <div className="mt-1 text-xs tracking-[0.4em] text-lavender-dim">
            CONTINUUM AUTHORITY
          </div>
        </div>

        <div className="min-h-[210px] space-y-1.5 text-xs md:text-sm">
          <AnimatePresence>
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-2 ${
                  i === BOOT_LINES.length - 1 ? "text-violet" : "text-cyan/80"
                }`}
              >
                <span className="text-lavender-dim">[{String(i + 1).padStart(2, "0")}]</span>
                <span>{line}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[10px] tracking-widest text-lavender-dim">
            <span>SYSTEM INTEGRITY</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onComplete}
            className="rounded border border-violet/30 px-4 py-1.5 text-[11px] tracking-widest text-lavender-dim transition hover:border-violet/60 hover:text-white cursor-pointer"
          >
            SKIP BOOT SEQUENCE →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
