export type StabilityStatus = "stable" | "atrisk" | "critical";

export type Severity = "low" | "medium" | "high" | "critical";

export type ActionType = "patch" | "quarantine" | "merge-prevent";

export interface HistoryPoint {
  t: number;
  stability: number;
}

export interface Timeline {
  id: string;
  name: string;
  designation: string;
  stability: number;
  population: number;
  riskScore: number;
  status: StabilityStatus;
  riskFactors: string[];
  history: HistoryPoint[];
  angle: number;
  radius: number;
  depth: number;
  driftSpeed: number;
  discovered: string;
  fieldNote: string;
}

export interface Anomaly {
  id: string;
  timelineId: string;
  timelineName: string;
  title: string;
  detail: string;
  severity: Severity;
  timestamp: number;
}

export interface ActionLogEntry {
  id: string;
  timelineId: string;
  timelineName: string;
  action: ActionType;
  timestamp: number;
  intensity: number;
}
