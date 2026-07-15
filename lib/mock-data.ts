import type {
  Anomaly,
  ActionType,
  HistoryPoint,
  Severity,
  StabilityStatus,
  Timeline,
} from "./types";
import { FIELD_NOTES } from "./lore";

let idCounter = 1;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter.toString(36)}`;
}

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

const PREFIXES = [
  "Ember",
  "Cobalt",
  "Hollow",
  "Gilded",
  "Vermilion",
  "Obsidian",
  "Wraith",
  "Cascade",
  "Fractured",
  "Silent",
  "Umbral",
  "Radiant",
  "Feral",
  "Glass",
  "Ashen",
  "Verdant",
  "Static",
  "Quiet",
  "Iron",
  "Pale",
  "Drowned",
  "Amber",
  "Violet",
  "Crimson",
  "Frozen",
  "Burning",
  "Distant",
  "Inverted",
  "Severed",
  "Wandering",
];

const NOUNS = [
  "Accord",
  "Recursion",
  "Meridian",
  "Divergence",
  "Continuum",
  "Echo",
  "Threshold",
  "Cradle",
  "Paradox",
  "Horizon",
  "Bloom",
  "Requiem",
  "Vestige",
  "Nocturne",
  "Ascendant",
  "Lattice",
  "Genesis",
  "Eclipse",
  "Rift",
  "Sanctum",
  "Wake",
  "Anomaly",
  "Chorus",
  "Drift",
  "Spire",
  "Vault",
  "Signal",
  "Reverie",
  "Fold",
  "Cipher",
];

const GREEK = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Sigma", "Omega"];

const RISK_FACTOR_POOL = [
  "Causal loop density exceeding safe threshold",
  "Divergence velocity accelerating from parent branch",
  "Unregistered convergence event with adjacent timeline",
  "Population memory-consensus drift",
  "Temporal signature decay in outer strata",
  "Recursive paradox unresolved for 40+ cycles",
  "Entropy gradient inverted near timeline anchor",
  "Unauthorized Continuum access detected",
  "Branch anchor point structurally weakened",
  "Quantum echo bleed from a collapsed sibling timeline",
  "Observer effect saturation in dense population zones",
  "Chronometric drift desynchronized from Nexus baseline",
  "Merge pressure building from two neighboring branches",
  "Residual instability from prior stabilization action",
  "Unexplained mass-memory gap across population centers",
];

const ANOMALY_TEMPLATES: { title: string; detail: string; severity: Severity }[] = [
  { title: "Causality Loop Detected", detail: "A closed causal loop has formed and is self-reinforcing.", severity: "high" },
  { title: "Population Divergence Spike", detail: "Population sentiment diverging sharply from baseline projection.", severity: "medium" },
  { title: "Temporal Signature Decay", detail: "Timeline's temporal signature is degrading faster than expected.", severity: "low" },
  { title: "Unregistered Convergence Event", detail: "Two branches are converging without Continuum authorization.", severity: "critical" },
  { title: "Entropy Gradient Inversion", detail: "Local entropy is flowing in reverse near the branch anchor.", severity: "high" },
  { title: "Chronometric Desync", detail: "Timeline clock has drifted from Nexus baseline by a measurable margin.", severity: "low" },
  { title: "Merge Pressure Building", detail: "Adjacent branches are exerting abnormal gravitational pull on this timeline.", severity: "medium" },
  { title: "Observer Saturation", detail: "Collective observation is destabilizing quantum branch states.", severity: "medium" },
  { title: "Anchor Point Fracture", detail: "Structural integrity of the branch anchor has dropped below nominal.", severity: "critical" },
  { title: "Echo Bleed Detected", detail: "Residual signal from a collapsed sibling timeline is leaking through.", severity: "high" },
  { title: "Recursive Paradox Flagged", detail: "A self-referential paradox remains unresolved across multiple cycles.", severity: "critical" },
  { title: "Memory Consensus Drift", detail: "Population-wide memory consensus is diverging from recorded history.", severity: "low" },
];

function statusFromStability(stability: number): StabilityStatus {
  if (stability < 35) return "critical";
  if (stability < 65) return "atrisk";
  return "stable";
}

function generateHistory(current: number): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  let v = current + rand(-15, 15);
  for (let i = 0; i < 24; i++) {
    v = Math.min(99, Math.max(2, v + rand(-4, 4)));
    points.push({ t: i, stability: Math.round(v) });
  }
  points[points.length - 1] = { t: 23, stability: Math.round(current) };
  return points;
}

export function generateTimeline(index: number): Timeline {
  const stability = Math.round(rand(4, 99));
  const depth = randInt(1, 6);
  const name = `${pick(PREFIXES)} ${pick(NOUNS)}`;
  const designation = `TL-${(1000 + index * 37 + randInt(0, 36)).toString()}-${pick(GREEK)}`;
  const riskFactorCount = stability < 35 ? randInt(3, 5) : stability < 65 ? randInt(2, 3) : randInt(0, 2);
  const riskFactors = shuffle([...RISK_FACTOR_POOL]).slice(0, riskFactorCount);

  return {
    id: nextId("tl"),
    name,
    designation,
    stability,
    population: Math.round(rand(0.02, 12.4) * 1000) / 1000,
    riskScore: Math.round(100 - stability + rand(-8, 8)),
    status: statusFromStability(stability),
    riskFactors,
    history: generateHistory(stability),
    angle: rand(0, Math.PI * 2),
    radius: 0.28 + (depth / 6) * 0.68 + rand(-0.03, 0.03),
    depth,
    driftSpeed: rand(0.15, 0.5),
    discovered: `Cycle ${randInt(1, 9999)}`,
    fieldNote: pick(FIELD_NOTES),
  };
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateTimelines(count: number): Timeline[] {
  return Array.from({ length: count }, (_, i) => generateTimeline(i));
}

export function generateAnomaly(timelines: Timeline[]): Anomaly {
  const timeline = pick(timelines);
  const template = pick(ANOMALY_TEMPLATES);
  return {
    id: nextId("an"),
    timelineId: timeline.id,
    timelineName: timeline.name,
    title: template.title,
    detail: template.detail,
    severity: template.severity,
    timestamp: Date.now(),
  };
}

export function generateInitialAnomalies(timelines: Timeline[], count: number): Anomaly[] {
  return Array.from({ length: count }, () => {
    const a = generateAnomaly(timelines);
    a.timestamp = Date.now() - randInt(1000, 1000 * 60 * 40);
    return a;
  }).sort((a, b) => b.timestamp - a.timestamp);
}

export const ACTION_LABELS: Record<ActionType, string> = {
  patch: "Patch",
  quarantine: "Quarantine",
  "merge-prevent": "Merge-Prevent",
};

export function newActionId() {
  return nextId("act");
}
