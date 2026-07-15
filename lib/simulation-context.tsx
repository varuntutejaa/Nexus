"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ActionLogEntry,
  ActionType,
  Anomaly,
  HistoryPoint,
  Timeline,
} from "./types";
import {
  ACTION_LABELS,
  generateAnomaly,
  generateInitialAnomalies,
  generateTimelines,
  newActionId,
  rand,
  randInt,
} from "./mock-data";

const MAX_ANOMALIES = 60;
const MAX_TREND_POINTS = 40;

function statusFromStability(stability: number): Timeline["status"] {
  if (stability < 35) return "critical";
  if (stability < 65) return "atrisk";
  return "stable";
}

function clamp(v: number, min = 1, max = 99) {
  return Math.min(max, Math.max(min, v));
}

interface SimulationState {
  operatorName: string;
  timelines: Timeline[];
  anomalies: Anomaly[];
  actionLog: ActionLogEntry[];
  overallHistory: HistoryPoint[];
  overallStability: number;
  selectedTimelineId: string | null;
  crisisTimelineId: string | null;
  crisisDismissedAt: number;
  actionsToday: number;
}

interface SimulationContextValue extends SimulationState {
  selectTimeline: (id: string | null) => void;
  performAction: (timelineId: string, action: ActionType, intensity: number) => void;
  triggerCrisis: (timelineId?: string) => void;
  dismissCrisis: () => void;
  getTimeline: (id: string | null) => Timeline | undefined;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({
  operatorName,
  children,
}: {
  operatorName: string;
  children: React.ReactNode;
}) {
  const [timelines, setTimelines] = useState<Timeline[]>(() => generateTimelines(42));
  const [anomalies, setAnomalies] = useState<Anomaly[]>(() =>
    generateInitialAnomalies(timelines, 14)
  );
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [overallHistory, setOverallHistory] = useState<HistoryPoint[]>(() => {
    const avg =
      timelines.reduce((s, t) => s + t.stability, 0) / Math.max(1, timelines.length);
    return Array.from({ length: 16 }, (_, i) => ({
      t: i,
      stability: Math.round(clamp(avg + rand(-6, 6))),
    }));
  });
  const [selectedTimelineId, setSelectedTimelineId] = useState<string | null>(null);
  const [crisisTimelineId, setCrisisTimelineId] = useState<string | null>(null);
  const [crisisDismissedAt, setCrisisDismissedAt] = useState(0);
  const tRef = useRef(0);
  const mountedAtRef = useRef<number | null>(null);

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  const overallStability = useMemo(() => {
    if (timelines.length === 0) return 0;
    const avg = timelines.reduce((s, t) => s + t.stability, 0) / timelines.length;
    return Math.round(avg * 10) / 10;
  }, [timelines]);

  // Drift timeline stability
  useEffect(() => {
    const id = setInterval(() => {
      setTimelines((prev) =>
        prev.map((tl) => {
          if (Math.random() > 0.35) return tl;
          const delta = rand(-3.2, 2.6) * tl.driftSpeed * 2;
          const stability = clamp(tl.stability + delta);
          const status = statusFromStability(stability);
          return { ...tl, stability, status, riskScore: clamp(100 - stability + rand(-6, 6), 0, 100) };
        })
      );
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // Push overall stability trend point
  useEffect(() => {
    const id = setInterval(() => {
      tRef.current += 1;
      setOverallHistory((prev) => {
        const next = [...prev, { t: tRef.current, stability: overallStability }];
        return next.slice(-MAX_TREND_POINTS);
      });
    }, 3000);
    return () => clearInterval(id);
  }, [overallStability]);

  // Spawn anomalies
  useEffect(() => {
    const id = setInterval(() => {
      if (timelines.length === 0) return;
      if (Math.random() > 0.55) return;
      setAnomalies((prev) => {
        const anomaly = generateAnomaly(timelines);
        return [anomaly, ...prev].slice(0, MAX_ANOMALIES);
      });
    }, 3400);
    return () => clearInterval(id);
  }, [timelines]);

  // Organic crisis trigger — rare and dramatic, not a constant interruption.
  useEffect(() => {
    const critical = timelines.find((t) => t.stability < 5);
    const sessionAge = mountedAtRef.current === null ? 0 : Date.now() - mountedAtRef.current;
    const cooldownOk = Date.now() - crisisDismissedAt > 90000;
    if (critical && !crisisTimelineId && sessionAge > 20000 && cooldownOk && Math.random() < 0.2) {
      setCrisisTimelineId(critical.id);
    }
  }, [timelines, crisisTimelineId, crisisDismissedAt]);

  const selectTimeline = useCallback((id: string | null) => {
    setSelectedTimelineId(id);
  }, []);

  const performAction = useCallback(
    (timelineId: string, action: ActionType, intensity: number) => {
      setTimelines((prev) =>
        prev.map((tl) => {
          if (tl.id !== timelineId) return tl;
          let stability = tl.stability;
          if (action === "patch") stability = clamp(tl.stability + intensity * 0.35);
          if (action === "quarantine") stability = clamp(tl.stability + intensity * 0.18);
          if (action === "merge-prevent") stability = clamp(tl.stability + intensity * 0.22);
          return {
            ...tl,
            stability,
            status: statusFromStability(stability),
            riskScore: clamp(100 - stability, 0, 100),
          };
        })
      );
      setActionLog((prev) => [
        {
          id: newActionId(),
          timelineId,
          timelineName: timelines.find((t) => t.id === timelineId)?.name ?? "Unknown",
          action,
          timestamp: Date.now(),
          intensity,
        },
        ...prev,
      ]);
      setCrisisTimelineId((cur) => (cur === timelineId ? null : cur));
      if (crisisTimelineId === timelineId) {
        setCrisisDismissedAt(Date.now());
      }
    },
    [timelines, crisisTimelineId]
  );

  const triggerCrisis = useCallback(
    (timelineId?: string) => {
      const target =
        (timelineId && timelines.find((t) => t.id === timelineId)) ||
        [...timelines].sort((a, b) => a.stability - b.stability)[0];
      if (target) setCrisisTimelineId(target.id);
    },
    [timelines]
  );

  const dismissCrisis = useCallback(() => {
    setCrisisTimelineId(null);
    setCrisisDismissedAt(Date.now());
  }, []);

  const getTimeline = useCallback(
    (id: string | null) => timelines.find((t) => t.id === id),
    [timelines]
  );

  const actionsToday = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return actionLog.filter((a) => a.timestamp >= startOfDay.getTime()).length;
  }, [actionLog]);

  const value: SimulationContextValue = {
    operatorName,
    timelines,
    anomalies,
    actionLog,
    overallHistory,
    overallStability,
    selectedTimelineId,
    crisisTimelineId,
    crisisDismissedAt,
    actionsToday,
    selectTimeline,
    performAction,
    triggerCrisis,
    dismissCrisis,
    getTimeline,
  };

  return (
    <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used within SimulationProvider");
  return ctx;
}

export { ACTION_LABELS };
export type { ActionType };
export const randomIntensity = () => randInt(20, 60);
