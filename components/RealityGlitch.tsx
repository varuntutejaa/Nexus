"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Rare, brief ambient distortion sweeping the whole console — a nod to the
 * "simulation theory" premise that Nexus itself is watching a reality that
 * can glitch. Fires on a random 25-50s cadence, never during other overlays.
 */
export default function RealityGlitch() {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function scheduleNext() {
      const delay = 25000 + Math.random() * 25000;
      timeoutRef.current = setTimeout(() => {
        setActive(true);
        setTimeout(() => setActive(false), 260);
        scheduleNext();
      }, delay);
    }
    scheduleNext();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden mix-blend-screen">
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: [0, 0.5, 0, 0.35, 0], x: [0, -6, 4, -2, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeInOut" }}
            className="absolute inset-x-0 top-[20%] h-[12%] bg-cyan/60"
          />
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: [0, 0.4, 0, 0.3, 0], x: [0, 8, -5, 3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeInOut" }}
            className="absolute inset-x-0 top-[55%] h-[8%] bg-violet/60"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeInOut" }}
            className="absolute inset-0 bg-red/40"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
