# NEXUS — Continuum Authority Console

> "Every choice that was ever made still exists, somewhere, as its own timeline. Nexus is where they all converge — and where we keep them from tearing each other apart."

## The story

Nexus is the convergence point of the multiverse: a single fixed anchor where every branching timeline still touches the source. Continuum Operators — you — work from this console to watch over thousands of parallel timelines in real time, tracking their stability, spotting anomalies as they emerge, and stepping in before a timeline collapses under its own instability or merges catastrophically into a neighboring branch.

Timelines drift constantly. Left unattended, causal loops compound, entropy inverts, populations lose consensus with their own recorded history, and branch anchors weaken until a timeline falls below the threshold of survivability. When that happens, Nexus doesn't wait for you to notice — Continuum Alert Level Omega triggers automatically, and the console goes to full crisis footing until the timeline is stabilized.

This build is a monitoring and stabilization console for that job: live telemetry, a branching node-map of the monitored multiverse, a running feed of detected anomalies, and a stabilization console for deploying Patch, Quarantine, and Merge-Prevent interventions.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Skip the boot sequence if you're in a hurry, enter any Operator ID (no real auth — this is simulation mode), and you're in.

## What's inside

- **Boot / Login** — a skippable "Continuum Authority" boot sequence into a mock operator login.
- **Overview** — multiverse-wide stability score, live counts of monitored timelines / active anomalies / critical alerts / actions taken, a rolling stability trend chart, and a compact preview of the map.
- **Multiverse Map** — the centerpiece: an interactive, continuously drifting node-graph of every monitored timeline branching from the central Nexus point. Node color reflects stability status; critical timelines pulse with an alert ring. Click a node to inspect it.
- **Timeline Detail** — a slide-in panel with stability history, population, risk score, active risk factors, and one-click Patch / Quarantine / Merge-Prevent actions.
- **Anomaly Feed** — a live, filterable, severity-sorted feed of detected anomalies that animates in as new ones are detected.
- **Stabilization Console** — select any timeline, choose an intervention, tune its intensity and containment radius, and confirm.
- **Crisis Mode** — a full-screen, glitch-transitioned takeover for when a timeline falls below survivable stability. Can be triggered manually ("Simulate Crisis") or fires on its own, rarely, when the multiverse produces a genuine emergency.

All data is generated and simulated client-side (`lib/mock-data.ts`, `lib/simulation-context.tsx`) — ~40 fictional timelines drift, spawn anomalies, and respond to stabilization actions on live intervals. Nothing here talks to a real backend.

## Stack

Next.js (App Router) · Tailwind CSS · Framer Motion · Recharts · Lucide React
