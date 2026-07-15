"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, GitMerge, ShieldAlert, Sliders, Wrench, Zap } from "lucide-react";
import { useSimulation } from "@/lib/simulation-context";
import { STATUS_COLORS, TEAL_SUCCESS } from "@/lib/format";
import { formatTimeAgo } from "@/lib/format";
import { ACTION_LABELS } from "@/lib/mock-data";
import type { ActionType } from "@/lib/types";
import HudCorners from "./HudCorners";

const ACTION_ICONS: Record<ActionType, typeof Wrench> = {
  patch: Wrench,
  quarantine: ShieldAlert,
  "merge-prevent": GitMerge,
};

export default function StabilizationConsole() {
  const { timelines, performAction, actionLog, operatorRank, nextRank } = useSimulation();
  const [timelineId, setTimelineId] = useState<string>("");
  const [action, setAction] = useState<ActionType>("patch");
  const [intensity, setIntensity] = useState(50);
  const [radius, setRadius] = useState(40);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [now] = useState(() => Date.now());

  const sorted = useMemo(
    () => [...timelines].sort((a, b) => a.stability - b.stability),
    [timelines]
  );
  const selected = timelines.find((t) => t.id === timelineId);

  function handleConfirm() {
    if (!selected || confirming) return;
    setConfirming(true);
    setTimeout(() => {
      performAction(selected.id, action, intensity * (0.6 + radius / 200));
      setConfirming(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1800);
    }, 900);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
      <div className="panel hud-corners relative p-4">
        <HudCorners />
        <div className="mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-violet" />
          <h3 className="font-display text-sm font-semibold text-white">Select Timeline</h3>
        </div>
        <div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
          {sorted.map((tl) => {
            const colors = STATUS_COLORS[tl.status];
            const isSelected = tl.id === timelineId;
            return (
              <button
                key={tl.id}
                onClick={() => setTimelineId(tl.id)}
                className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition cursor-pointer ${
                  isSelected
                    ? "border-violet/60 bg-violet/15"
                    : "border-white/5 hover:border-violet/30 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: colors.hex, boxShadow: `0 0 6px ${colors.hex}` }}
                  />
                  <span className="truncate text-xs text-lavender">{tl.name}</span>
                </div>
                <span className={`font-mono-data text-xs shrink-0 ${colors.text}`}>
                  {tl.stability.toFixed(0)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="panel hud-corners relative p-4">
          <HudCorners />
          <div className="mb-3 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan" />
            <h3 className="font-display text-sm font-semibold text-white">
              Configure Intervention
            </h3>
          </div>

          {!selected ? (
            <div className="rounded-md border border-white/10 bg-white/5 px-3 py-6 text-center text-xs text-lavender-dim">
              Select a timeline to begin configuring a stabilization action.
            </div>
          ) : (
            <>
              <div className="mb-4 text-xs text-lavender-dim">
                TARGET: <span className="text-white">{selected.name}</span> ·{" "}
                <span className={STATUS_COLORS[selected.status].text}>
                  {selected.stability.toFixed(0)}% stable
                </span>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {(Object.keys(ACTION_LABELS) as ActionType[]).map((type) => {
                  const Icon = ACTION_ICONS[type];
                  const isActive = action === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setAction(type)}
                      className={`flex flex-col items-center gap-1.5 rounded-md border py-2.5 text-[11px] transition cursor-pointer ${
                        isActive
                          ? "border-cyan/60 bg-cyan/15 text-white"
                          : "border-white/10 text-lavender-dim hover:border-cyan/30"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {ACTION_LABELS[type]}
                    </button>
                  );
                })}
              </div>

              <SliderField
                label="Intervention Intensity"
                value={intensity}
                onChange={setIntensity}
                color="#00D9FF"
              />
              <SliderField
                label="Containment Radius"
                value={radius}
                onChange={setRadius}
                color="#1E5FFF"
              />

              <motion.button
                whileTap={{ scale: 0.97 }}
                animate={confirming ? { boxShadow: ["0 0 0px rgba(0,217,255,0)", "0 0 24px rgba(0,217,255,0.6)", "0 0 0px rgba(0,217,255,0)"] } : {}}
                transition={confirming ? { duration: 0.9, repeat: Infinity } : {}}
                onClick={handleConfirm}
                disabled={confirming}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-deep-blue to-cyan py-2.5 text-sm font-semibold text-void transition disabled:opacity-90 cursor-pointer"
              >
                {confirming ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-void/40 border-t-void"
                  />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                {confirming ? "PROCESSING..." : "CONFIRM ACTION"}
              </motion.button>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`mt-3 flex items-center gap-2 rounded-md border ${TEAL_SUCCESS.border} ${TEAL_SUCCESS.bg} px-3 py-2 text-xs ${TEAL_SUCCESS.text}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Stabilization action applied successfully.
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <div className="panel hud-corners relative p-4">
          <HudCorners />
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[9px] tracking-widest text-lavender-dim">
                CONTINUUM CLEARANCE
              </div>
              <div className="font-display text-sm font-semibold text-violet">
                {operatorRank.title}
              </div>
            </div>
            {nextRank && (
              <div className="text-right text-[10px] text-lavender-dim">
                {nextRank.threshold - actionLog.length} action
                {nextRank.threshold - actionLog.length === 1 ? "" : "s"} to{" "}
                <span className="text-lavender">{nextRank.title}</span>
              </div>
            )}
          </div>
          <div className="mb-3 text-[10px] tracking-widest text-lavender-dim">
            RECENT ACTION LOG
          </div>
          <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
            {actionLog.length === 0 && (
              <div className="py-3 text-center text-xs text-lavender-dim">
                No actions taken this session.
              </div>
            )}
            {actionLog.slice(0, 8).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-md border border-white/5 bg-white/5 px-3 py-1.5 text-[11px]"
              >
                <span className="text-lavender">
                  {ACTION_LABELS[entry.action]} · {entry.timelineName}
                </span>
                <span className="font-mono-data text-lavender-dim/70">
                  {formatTimeAgo(entry.timestamp, now)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex justify-between text-[10px] tracking-widest text-lavender-dim">
        <span>{label}</span>
        <span className="font-mono-data text-white">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-violet"
        style={{ accentColor: color }}
      />
    </div>
  );
}
