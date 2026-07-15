"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Orbit, Radar, ShieldCheck, Target, X } from "lucide-react";
import { useSimulation } from "@/lib/simulation-context";

export default function MissionBriefing({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { operatorName, cycleNumber } = useSimulation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="fixed left-1/2 top-1/2 z-[91] w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2"
          >
            <div className="panel glow-violet max-h-[85vh] overflow-y-auto p-7">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <div className="text-[10px] tracking-[0.35em] text-violet">
                    UNIVERSE CARD
                  </div>
                  <h1 className="font-display text-2xl font-bold text-white text-glow-violet">
                    NEXUS
                  </h1>
                  <span className="mt-1 inline-block rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-[10px] tracking-widest text-lavender">
                    REALITY REIMAGINED — BEYOND REALITY
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md p-1.5 text-lavender-dim transition hover:bg-white/5 hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 rounded-md border border-cyan/20 bg-cyan/5 px-3 py-2 font-mono-data text-[11px] text-cyan">
                UPLINK ESTABLISHED — Operator {operatorName} · Continuum Cycle {cycleNumber}
              </div>

              <p className="mb-6 text-sm leading-relaxed text-lavender">
                Every choice ever made splits reality into a new timeline. Trillions of
                parallel universes now exist, all anchored to one convergence point —{" "}
                <span className="text-white">Nexus</span> — where they can be observed and
                corrected. Some timelines destabilize, bleed into neighbors, or collide,
                risking multiverse collapse.
              </p>

              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field icon={Target} label="Core Concept">
                  A control dashboard for monitoring live timeline stability, detecting
                  anomalies, and intervening before catastrophic collapse or merge.
                </Field>
                <Field icon={ShieldCheck} label="Your Role">
                  You are a <span className="text-white">Continuum Operator</span> — a
                  specialist at Nexus who monitors timelines and authorizes emergency
                  stabilization.
                </Field>
              </div>

              <div className="mb-6 rounded-lg border border-cyan/20 bg-cyan/5 px-4 py-3">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] tracking-widest text-cyan">
                  <Radar className="h-3 w-3" />
                  DASHBOARD PURPOSE
                </div>
                <p className="text-xs text-lavender">
                  One interface for Continuum Operators to monitor multiverse stability
                  and respond fast when timelines destabilize, bleed, or drift toward
                  collapse.
                </p>
              </div>

              <div className="mb-6">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] tracking-widest text-lavender-dim">
                  <Orbit className="h-3 w-3" />
                  KEY FEATURES
                </div>
                <ul className="grid grid-cols-1 gap-1.5 text-xs text-lavender sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-violet" /> Live multiverse map
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-violet" /> Stability, population
                    &amp; risk telemetry
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-violet" /> Real-time anomaly
                    feed
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-violet" /> Stabilization
                    console &amp; crisis mode
                  </li>
                </ul>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-violet to-cyan py-2.5 text-sm font-semibold text-void transition cursor-pointer"
              >
                BEGIN OPERATIONS →
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Target;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-[10px] tracking-widest text-lavender-dim">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="text-xs leading-relaxed text-lavender">{children}</p>
    </div>
  );
}
