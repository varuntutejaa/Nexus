"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Wrench, ShieldAlert, GitMerge, CheckCircle2, Users, Activity } from "lucide-react";
import { useSimulation } from "@/lib/simulation-context";
import { STATUS_COLORS, TEAL_SUCCESS } from "@/lib/format";
import { formatPopulation } from "@/lib/format";
import StabilityTrendChart from "./StabilityTrendChart";
import HudCorners from "./HudCorners";
import type { ActionType } from "@/lib/types";

const ACTIONS: { type: ActionType; label: string; icon: typeof Wrench; hint: string }[] = [
  { type: "patch", label: "Patch", icon: Wrench, hint: "Repair local instabilities" },
  { type: "quarantine", label: "Quarantine", icon: ShieldAlert, hint: "Isolate from adjacent branches" },
  { type: "merge-prevent", label: "Merge-Prevent", icon: GitMerge, hint: "Block unauthorized convergence" },
];

export default function TimelineDetailPanel() {
  const { selectedTimelineId, selectTimeline, getTimeline, performAction } = useSimulation();
  const [flash, setFlash] = useState<ActionType | null>(null);
  const [pending, setPending] = useState<ActionType | null>(null);
  const timeline = getTimeline(selectedTimelineId);

  function handleAction(action: ActionType) {
    if (!timeline || pending) return;
    setPending(action);
    setTimeout(() => {
      performAction(timeline.id, action, 32);
      setPending(null);
      setFlash(action);
      setTimeout(() => setFlash(null), 1600);
    }, 700);
  }

  return (
    <AnimatePresence>
      {timeline && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => selectTimeline(null)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="hud-corners fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-violet/20 bg-void-raised p-6"
          >
            <HudCorners />
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="font-mono-data text-[11px] tracking-widest text-lavender-dim">
                  {timeline.designation}
                </div>
                <h2 className="font-display text-xl font-semibold text-white">
                  {timeline.name}
                </h2>
              </div>
              <button
                onClick={() => selectTimeline(null)}
                className="rounded-md p-1.5 text-lavender-dim transition hover:bg-white/5 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5 border-l-2 border-violet/30 pl-3">
              <div className="text-[9px] tracking-widest text-lavender-dim">
                FIELD NOTE — {timeline.discovered}
              </div>
              <p className="mt-0.5 text-xs italic leading-relaxed text-lavender/90">
                &ldquo;{timeline.fieldNote}&rdquo;
              </p>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-3">
              <Metric
                label="Stability"
                value={`${timeline.stability.toFixed(0)}%`}
                color={STATUS_COLORS[timeline.status].text}
              />
              <Metric
                label="Population"
                value={formatPopulation(timeline.population)}
                icon={<Users className="h-3 w-3" />}
              />
              <Metric
                label="Risk Score"
                value={timeline.riskScore.toFixed(0)}
                icon={<Activity className="h-3 w-3" />}
              />
            </div>

            <div className="panel hud-corners relative mb-5 p-3">
              <HudCorners />
              <div className="mb-2 text-[10px] tracking-widest text-lavender-dim">
                STABILITY — LAST 24 CYCLES
              </div>
              <StabilityTrendChart
                data={timeline.history}
                color={STATUS_COLORS[timeline.status].hex}
                height={130}
              />
            </div>

            <div className="mb-5">
              <div className="mb-2 text-[10px] tracking-widest text-lavender-dim">
                RISK FACTORS ({timeline.riskFactors.length})
              </div>
              {timeline.riskFactors.length === 0 ? (
                <div className="rounded-md border border-cyan/20 bg-cyan/5 px-3 py-2 text-xs text-cyan">
                  No active risk factors detected.
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {timeline.riskFactors.map((factor) => (
                    <li
                      key={factor}
                      className="flex items-start gap-2 rounded-md border border-amber/15 bg-amber/5 px-3 py-2 text-xs text-lavender"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      {factor}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <div className="mb-2 text-[10px] tracking-widest text-lavender-dim">
                STABILIZATION ACTIONS
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ACTIONS.map(({ type, label, icon: Icon }) => {
                  const isPending = pending === type;
                  return (
                    <motion.button
                      key={type}
                      whileTap={{ scale: 0.94 }}
                      animate={
                        isPending
                          ? {
                              boxShadow: [
                                "0 0 0px rgba(0,217,255,0)",
                                "0 0 18px rgba(0,217,255,0.55)",
                                "0 0 0px rgba(0,217,255,0)",
                              ],
                            }
                          : {}
                      }
                      transition={isPending ? { duration: 0.8, repeat: Infinity } : {}}
                      onClick={() => handleAction(type)}
                      disabled={pending !== null}
                      className="flex flex-col items-center gap-1.5 rounded-md border border-violet/25 bg-violet/5 py-3 text-[11px] text-lavender transition hover:border-violet/60 hover:bg-violet/15 hover:text-white disabled:opacity-70 cursor-pointer"
                    >
                      {isPending ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 rounded-full border-2 border-cyan/30 border-t-cyan"
                        />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      {isPending ? "Processing..." : label}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {flash && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`mt-3 flex items-center gap-2 rounded-md border ${TEAL_SUCCESS.border} ${TEAL_SUCCESS.bg} px-3 py-2 text-xs ${TEAL_SUCCESS.text}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Action complete — stability response registered.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Metric({
  label,
  value,
  color = "text-white",
  icon,
}: {
  label: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="panel px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1 text-[9px] tracking-widest text-lavender-dim">
        {icon}
        {label}
      </div>
      <div className={`font-mono-data text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}
