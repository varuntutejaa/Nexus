"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUp } from "lucide-react";
import { useSimulation } from "@/lib/simulation-context";

export default function RankUpToast() {
  const { operatorRank } = useSimulation();
  const [visible, setVisible] = useState(false);
  const prevRank = useRef(operatorRank.title);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      prevRank.current = operatorRank.title;
      return;
    }
    if (operatorRank.title !== prevRank.current) {
      prevRank.current = operatorRank.title;
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3200);
      return () => clearTimeout(t);
    }
  }, [operatorRank.title]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed left-1/2 top-20 z-[110] -translate-x-1/2"
        >
          <div className="glow-violet flex items-center gap-3 rounded-lg border border-violet/50 bg-void-raised/95 px-5 py-3 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-violet/40 bg-violet/15"
            >
              <ChevronsUp className="h-5 w-5 text-violet" />
            </motion.div>
            <div>
              <div className="text-[9px] tracking-widest text-lavender-dim">
                CONTINUUM CLEARANCE UPGRADED
              </div>
              <div className="font-display text-sm font-semibold text-white">
                {operatorRank.title}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
