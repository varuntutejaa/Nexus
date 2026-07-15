"use client";

import { useState } from "react";
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

function DashboardContent() {
  const [tab, setTab] = useState<Tab>("overview");
  const { triggerCrisis } = useSimulation();

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header onCrisis={() => triggerCrisis()} />

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
                <div className="panel p-6">
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
