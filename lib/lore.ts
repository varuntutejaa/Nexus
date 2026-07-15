export const BROADCAST_LINES = [
  "CONTINUUM BROADCAST // Nexus anchor holding steady — convergence point stable across all observed cycles",
  "ARCHIVE NOTE // Timeline collapse events peaked during the Second Convergence, Cycle 4021 — protocols since revised",
  "FIELD LOG // Operator Kessler-3: \"The bleed didn't stop at the anchor. It never does.\"",
  "CONTINUUM DIRECTIVE 7 // No operator may authorize a merge-prevent without confirmation above risk score 80",
  "TRANSMISSION // Nexus Ops: quiet sectors reporting nominal drift, no action required",
  "ARCHIVE NOTE // The Nexus anchor has never gone fully dark. Not once. Not yet.",
  "FIELD LOG // Operator Aris-6: \"You stop thinking of them as numbers. Then you stop sleeping.\"",
  "CONTINUUM DIRECTIVE 12 // Quarantine before merge-prevent when risk score exceeds population confidence",
  "ARCHIVE NOTE // First recorded timeline bleed traced to an unauthorized observation, Cycle 0091",
  "TRANSMISSION // Continuum Authority: operator clearance renewed automatically at shift rotation",
  "FIELD LOG // Operator Devraj-1: \"Every collapse sounds the same. Like a held breath finally let go.\"",
  "ARCHIVE NOTE // No two timelines destabilize the same way twice — pattern-matching is a trap",
  "CONTINUUM DIRECTIVE 3 // Patch before quarantine unless anchor fracture exceeds 60% structural loss",
  "TRANSMISSION // Nexus Ops: multiverse census holding above nine trillion observed branches",
  "FIELD LOG // Operator Kessler-3: \"Reality reimagined isn't a slogan down here. It's a shift log.\"",
  "ARCHIVE NOTE // The Continuum Authority does not choose which timelines survive. It only slows the ones that won't.",
];

export const FIELD_NOTES = [
  "Operators report a persistent hum near the branch anchor, source unconfirmed.",
  "Last cycle's patch held. Barely.",
  "Population shows early signs of collective déjà vu — expected at this divergence depth.",
  "Continuum Archive flags this branch as a repeat offender for merge pressure.",
  "First observed during a routine sweep. Nothing routine about it since.",
  "Anchor telemetry has been inconsistent for three shift rotations running.",
  "No prior incidents on record. That is, in itself, slightly concerning.",
  "Flagged for observation after an unregistered convergence attempt nearby.",
  "Operator consensus: stable, but worth a second look before shift end.",
  "Population memory-consensus has drifted twice this cycle. Watching closely.",
  "This branch has outlived three neighboring timelines. Draw your own conclusions.",
  "Recommended for priority patching if stability drops below 40%.",
  "Anchor point resurveyed last cycle — no structural change since.",
  "One of the older branches on record. It has seen worse than this.",
  "Recently split from a since-collapsed parent. Still finding its footing.",
];

export interface RankTier {
  threshold: number;
  title: string;
}

export const RANKS: RankTier[] = [
  { threshold: 0, title: "Cadet Operator" },
  { threshold: 3, title: "Continuum Sentinel" },
  { threshold: 7, title: "Senior Stabilizer" },
  { threshold: 15, title: "Continuum Warden" },
  { threshold: 30, title: "Nexus Custodian" },
];

export function rankForActionCount(count: number): RankTier {
  let current = RANKS[0];
  for (const tier of RANKS) {
    if (count >= tier.threshold) current = tier;
  }
  return current;
}
