"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SimulationProvider, useSimulation } from "@/lib/simulation-context";
import Header from "./Header";
import Sidebar, { type Tab } from "./Sidebar";
import OverviewTab from "./OverviewTab";
import MultiverseMap from "./MultiverseMap";
import AnomalyFeed from "./AnomalyFeed";
import StabilizationConsole from "./StabilizationConsole";
import TimelineDetailPanel from "./TimelineDetailPanel";
import CrisisMode from "./CrisisMode";
import MissionBriefing from "./MissionBriefing";
import ContinuumTicker from "./ContinuumTicker";
import RankUpToast from "./RankUpToast";
import CommandPalette from "./CommandPalette";
import HudCorners from "./HudCorners";

function DashboardContent() {
  const [tab, setTab] = useState<Tab>("overview");
  const [missionOpen, setMissionOpen] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { triggerCrisis, selectTimeline, selectedTimelineId, crisisTimelineId, dismissCrisis } =
    useSimulation();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key !== "Escape") return;
      if (paletteOpen) setPaletteOpen(false);
      else if (missionOpen) setMissionOpen(false);
      else if (selectedTimelineId) selectTimeline(null);
      else if (crisisTimelineId) dismissCrisis();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paletteOpen, missionOpen, selectedTimelineId, crisisTimelineId, selectTimeline, dismissCrisis]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <RankUpToast />
      <MissionBriefing open={missionOpen} onClose={() => setMissionOpen(false)} />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={setTab}
        onMission={() => setMissionOpen(true)}
        onCrisis={() => triggerCrisis()}
      />
      <Header
        onCrisis={() => triggerCrisis()}
        onMission={() => setMissionOpen(true)}
        onSearch={() => setPaletteOpen(true)}
      />
      <ContinuumTicker />

      <div className="flex flex-1 flex-col gap-0 p-4 md:flex-row md:gap-4">
        <Sidebar active={tab} onChange={setTab} />

        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {tab === "overview" && <OverviewTab onNavigate={setTab} />}
              {tab === "map" && (
                <div className="panel hud-corners relative p-6">
                  <HudCorners />
                  <div className="mb-4 text-center">
                    <div className="font-display text-lg font-semibold text-white">
                      Multiverse Map
                    </div>
                    <div className="text-xs text-lavender-dim">
                      Click any node to inspect its timeline
                    </div>
                  </div>
                  <MultiverseMap />
                </div>
              )}
              {tab === "anomalies" && (
                <div className="h-[calc(100vh-11rem)]">
                  <AnomalyFeed />
                </div>
              )}
              {tab === "console" && <StabilizationConsole />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <TimelineDetailPanel />
      <CrisisMode />

      <AnimatePresence>
        {(missionOpen || selectedTimelineId || crisisTimelineId || paletteOpen) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="fixed bottom-4 left-4 z-[95] rounded-md border border-white/10 bg-void-raised/90 px-2.5 py-1 font-mono-data text-[10px] tracking-widest text-lavender-dim backdrop-blur-sm"
          >
            ESC — close
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard({ operatorName }: { operatorName: string }) {
  return (
    <SimulationProvider operatorName={operatorName}>
      <DashboardContent />
    </SimulationProvider>
  );
}
