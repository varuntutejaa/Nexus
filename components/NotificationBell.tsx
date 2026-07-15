"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Bell, Wrench } from "lucide-react";
import { useSimulation } from "@/lib/simulation-context";
import { formatTimeAgo, SEVERITY_COLORS } from "@/lib/format";
import { ACTION_LABELS } from "@/lib/mock-data";

interface FeedItem {
  id: string;
  kind: "anomaly" | "action";
  title: string;
  subtitle: string;
  timelineId: string;
  timestamp: number;
  severity?: string;
}

export default function NotificationBell({
  onJumpToTimeline,
}: {
  onJumpToTimeline: (timelineId: string) => void;
}) {
  const { anomalies, actionLog } = useSimulation();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [unread, setUnread] = useState(0);
  const seenCount = useRef(anomalies.length);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (anomalies.length > seenCount.current && !open) {
      setUnread((u) => u + (anomalies.length - seenCount.current));
    }
    seenCount.current = anomalies.length;
  }, [anomalies.length, open]);

  function toggleOpen() {
    setOpen((o) => {
      if (!o) setUnread(0);
      return !o;
    });
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items: FeedItem[] = useMemo(() => {
    const anomalyItems: FeedItem[] = anomalies.slice(0, 10).map((a) => ({
      id: a.id,
      kind: "anomaly",
      title: a.title,
      subtitle: a.timelineName,
      timelineId: a.timelineId,
      timestamp: a.timestamp,
      severity: a.severity,
    }));
    const actionItems: FeedItem[] = actionLog.slice(0, 10).map((a) => ({
      id: a.id,
      kind: "action",
      title: `${ACTION_LABELS[a.action]} deployed`,
      subtitle: a.timelineName,
      timelineId: a.timelineId,
      timestamp: a.timestamp,
    }));
    return [...anomalyItems, ...actionItems].sort((a, b) => b.timestamp - a.timestamp).slice(0, 12);
  }, [anomalies, actionLog]);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={toggleOpen}
        className="relative flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-lavender-dim transition hover:border-violet/40 hover:text-white cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[9px] font-semibold text-white"
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="panel-solid absolute right-0 top-11 z-30 w-80 overflow-hidden"
          >
            <div className="border-b border-white/10 px-3 py-2 text-[10px] tracking-widest text-lavender-dim">
              CONTINUUM ACTIVITY
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 && (
                <div className="px-3 py-6 text-center text-xs text-lavender-dim">
                  No activity yet this session.
                </div>
              )}
              {items.map((item) => {
                const sev = item.severity ? SEVERITY_COLORS[item.severity] : null;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onJumpToTimeline(item.timelineId);
                      setOpen(false);
                    }}
                    className="flex w-full items-start gap-2.5 border-b border-white/5 px-3 py-2.5 text-left text-xs transition hover:bg-white/5 last:border-0 cursor-pointer"
                  >
                    {item.kind === "anomaly" ? (
                      <AlertCircle className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${sev?.text ?? "text-cyan"}`} />
                    ) : (
                      <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-lavender">{item.title}</div>
                      <div className="mt-0.5 flex items-center justify-between text-[10px] text-lavender-dim">
                        <span className="font-mono-data">{item.subtitle}</span>
                        <span className="font-mono-data">{formatTimeAgo(item.timestamp, now)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
