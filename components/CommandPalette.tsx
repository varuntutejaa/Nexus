"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  LayoutDashboard,
  Network,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useSimulation } from "@/lib/simulation-context";
import { STATUS_COLORS } from "@/lib/format";
import type { Timeline } from "@/lib/types";
import type { Tab } from "./Sidebar";

interface Command {
  id: string;
  label: string;
  icon: typeof Search;
  run: () => void;
}

function PaletteBody({
  timelines,
  commands,
  onClose,
  onJumpToTimeline,
}: {
  timelines: Timeline[];
  commands: Command[];
  onClose: () => void;
  onJumpToTimeline: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.trim().toLowerCase();

  const matchedCommands = q
    ? commands.filter((c) => c.label.toLowerCase().includes(q))
    : commands;

  const matchedTimelines = q
    ? timelines
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q) || t.designation.toLowerCase().includes(q)
        )
        .slice(0, 8)
    : [];

  function runCommand(fn: () => void) {
    fn();
    onClose();
  }

  return (
    <div className="panel-solid glow-violet overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
        <Search className="h-4 w-4 text-lavender-dim" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search timelines or jump to a screen…"
          className="flex-1 bg-transparent font-mono-data text-sm text-white outline-none placeholder:text-lavender-dim/50"
        />
        <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-lavender-dim">
          ESC
        </kbd>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {matchedTimelines.length > 0 && (
          <div className="mb-1">
            <div className="px-2 py-1 text-[9px] tracking-widest text-lavender-dim">
              TIMELINES
            </div>
            {matchedTimelines.map((tl) => {
              const colors = STATUS_COLORS[tl.status];
              return (
                <button
                  key={tl.id}
                  onClick={() => onJumpToTimeline(tl.id)}
                  className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs text-lavender transition hover:bg-white/5 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: colors.hex }}
                    />
                    {tl.name}
                    <span className="font-mono-data text-[10px] text-lavender-dim">
                      {tl.designation}
                    </span>
                  </span>
                  <span className={`font-mono-data text-[11px] ${colors.text}`}>
                    {tl.stability.toFixed(0)}%
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div>
          {(matchedTimelines.length > 0 || matchedCommands.length > 0) && (
            <div className="px-2 py-1 text-[9px] tracking-widest text-lavender-dim">
              COMMANDS
            </div>
          )}
          {matchedCommands.map(({ id, label, icon: Icon, run }) => (
            <button
              key={id}
              onClick={() => runCommand(run)}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs text-lavender transition hover:bg-white/5 cursor-pointer"
            >
              <Icon className="h-3.5 w-3.5 text-violet" />
              {label}
            </button>
          ))}
          {matchedCommands.length === 0 && matchedTimelines.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-lavender-dim">
              No matches for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommandPalette({
  open,
  onClose,
  onNavigate,
  onMission,
  onCrisis,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (t: Tab) => void;
  onMission: () => void;
  onCrisis: () => void;
}) {
  const { timelines, selectTimeline } = useSimulation();

  const commands = useMemo<Command[]>(
    () => [
      { id: "nav-overview", label: "Go to Overview", icon: LayoutDashboard, run: () => onNavigate("overview") },
      { id: "nav-map", label: "Go to Multiverse Map", icon: Network, run: () => onNavigate("map") },
      { id: "nav-anomalies", label: "Go to Anomaly Feed", icon: AlertCircle, run: () => onNavigate("anomalies") },
      { id: "nav-console", label: "Go to Stabilization Console", icon: SlidersHorizontal, run: () => onNavigate("console") },
      { id: "mission", label: "Open Mission Briefing", icon: BookOpen, run: onMission },
      { id: "crisis", label: "Simulate Crisis", icon: AlertTriangle, run: onCrisis },
    ],
    [onNavigate, onMission, onCrisis]
  );

  function jumpToTimeline(id: string) {
    selectTimeline(id);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed left-1/2 top-[16%] z-[121] w-[92vw] max-w-lg -translate-x-1/2"
          >
            <PaletteBody
              timelines={timelines}
              commands={commands}
              onClose={onClose}
              onJumpToTimeline={jumpToTimeline}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
