"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BootScreen from "@/components/BootScreen";
import LoginScreen from "@/components/LoginScreen";
import Dashboard from "@/components/Dashboard";

type Stage = "boot" | "login" | "dashboard";

export default function Home() {
  const [stage, setStage] = useState<Stage>("boot");
  const [operatorName, setOperatorName] = useState("OPERATOR-7");

  return (
    <div className="relative min-h-screen flex-1 bg-void">
      <div className="bg-starfield" />
      <div className="bg-grid" />
      <div className="bg-noise" />

      <AnimatePresence mode="wait">
        {stage === "boot" && (
          <BootScreen key="boot" onComplete={() => setStage("login")} />
        )}
        {stage === "login" && (
          <LoginScreen
            key="login"
            onAuthenticate={(name) => {
              setOperatorName(name);
              setStage("dashboard");
            }}
          />
        )}
      </AnimatePresence>

      {stage === "dashboard" && <Dashboard operatorName={operatorName} />}
    </div>
  );
}
