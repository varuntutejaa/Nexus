"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Wrench, X, Zap } from "lucide-react";
import { useSimulation } from "@/lib/simulation-context";
import { formatPopulation, TEAL_SUCCESS } from "@/lib/format";
import HudCorners from "./HudCorners";

export default function CrisisMode() {
  const { crisisTimelineId, getTimeline, dismissCrisis, performAction } = useSimulation();
  const timeline = getTimeline(crisisTimelineId);
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState(false);

  function handleStabilize() {
    if (!timeline || resolving) return;
    setResolving(true);
    setTimeout(() => {
      performAction(timeline.id, "patch", 70);
      setResolving(false);
      setResolved(true);
      setTimeout(() => {
        setResolved(false);
        dismissCrisis();
      }, 1600);
    }, 1400);
  }

  return (
    <AnimatePresence>
      {timeline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.85, 1] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-red/25 via-black to-amber/10"
          />
          <div className="absolute inset-0 bg-grid opacity-40" />
          <motion.div
            className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-red/20 to-transparent"
            style={{ top: "-6rem" }}
            animate={{ y: ["0vh", "110vh"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="relative z-10 mx-4 w-full max-w-2xl"
          >
            <button
              onClick={dismissCrisis}
              className="absolute -top-10 right-0 flex items-center gap-1 text-[11px] tracking-widest text-lavender-dim/80 transition hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" /> DISMISS
            </button>

            <div className="hud-corners animate-glitch-flicker relative rounded-xl border-2 border-red/50 bg-void/90 p-8 glow-red backdrop-blur-sm">
              <HudCorners />
              <div className="mb-5 flex items-center gap-3 animate-shake">
                <AlertTriangle className="h-9 w-9 text-red" />
                <div>
                  <div className="font-display text-2xl font-bold tracking-wide text-red">
                    CRITICAL COLLAPSE IMMINENT
                  </div>
                  <div className="text-[11px] tracking-[0.3em] text-amber">
                    CONTINUUM ALERT LEVEL — OMEGA
                  </div>
                </div>
              </div>

              {!resolved ? (
                <>
                  <p className="mb-5 text-sm leading-relaxed text-lavender">
                    Timeline <span className="font-semibold text-white">{timeline.name}</span>{" "}
                    (<span className="font-mono-data">{timeline.designation}</span>) has fallen
                    below survivable stability thresholds. Population of{" "}
                    <span className="font-mono-data text-white">
                      {formatPopulation(timeline.population)}
                    </span>{" "}
                    is at risk of catastrophic collapse or uncontrolled merge with an adjacent
                    branch. Immediate Continuum intervention is required.
                  </p>

                  <div className="mb-6 grid grid-cols-3 gap-3">
                    <Metric label="Stability" value={`${timeline.stability.toFixed(1)}%`} />
                    <Metric label="Risk Score" value={timeline.riskScore.toFixed(0)} />
                    <Metric
                      label="Risk Factors"
                      value={String(timeline.riskFactors.length)}
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleStabilize}
                      disabled={resolving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red to-amber py-3 text-sm font-bold tracking-wide text-void transition disabled:opacity-80 cursor-pointer"
                    >
                      {resolving ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 rounded-full border-2 border-void/40 border-t-void"
                        />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                      {resolving ? "PROCESSING..." : "EMERGENCY STABILIZE"}
                    </motion.button>
                    <button
                      onClick={dismissCrisis}
                      className="flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-3 text-sm text-lavender-dim transition hover:text-white cursor-pointer"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Handle Manually
                    </button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${TEAL_SUCCESS.border} ${TEAL_SUCCESS.bg}`}
                  >
                    <Wrench className={`h-7 w-7 ${TEAL_SUCCESS.text}`} />
                  </motion.div>
                  <div className="font-display text-lg font-semibold text-white">
                    Timeline Stabilized
                  </div>
                  <div className="text-xs text-lavender-dim">
                    Emergency patch deployed. Continuum monitoring resumed.
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-red/25 bg-red/5 px-3 py-2 text-center">
      <div className="text-[9px] tracking-widest text-lavender-dim">{label}</div>
      <div className="font-mono-data text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
