"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Fingerprint } from "lucide-react";
import DecorativeMap from "./DecorativeMap";

export default function LoginScreen({
  onAuthenticate,
}: {
  onAuthenticate: (name: string) => void;
}) {
  const [operatorId, setOperatorId] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (authenticating) return;
    setAuthenticating(true);
    const name = operatorId.trim() || "OPERATOR-7";
    setTimeout(() => onAuthenticate(name.toUpperCase()), 1100);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-void"
    >
      <div className="bg-starfield" />
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="absolute inset-0 opacity-40">
        <DecorativeMap />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-void/60 to-void" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-[14%] z-10 flex flex-col items-center text-center"
      >
        <div className="font-display text-2xl font-bold tracking-[0.15em] text-white text-glow-violet">
          NEXUS
        </div>
        <span className="mt-2 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-[9px] tracking-[0.3em] text-lavender">
          REALITY REIMAGINED — BEYOND REALITY
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="panel glow-violet relative z-10 w-full max-w-sm p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-violet/40 bg-violet/10">
            <Fingerprint className="h-7 w-7 text-violet" />
          </div>
          <h1 className="font-display text-xl font-semibold text-white">
            Continuum Access
          </h1>
          <p className="mt-1 text-xs text-lavender-dim">
            Identify yourself to access the Nexus console.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] tracking-widest text-lavender-dim">
              OPERATOR ID
            </label>
            <input
              autoFocus
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              placeholder="e.g. VARUN-9"
              className="w-full rounded-md border border-violet/25 bg-void-raised px-3 py-2.5 font-mono-data text-sm text-white outline-none transition placeholder:text-lavender-dim/50 focus:border-violet/70 focus:ring-1 focus:ring-violet/40"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={authenticating}
            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-gradient-to-r from-violet to-cyan py-2.5 text-sm font-semibold text-void transition disabled:opacity-70"
          >
            {authenticating ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-void/40 border-t-void"
              />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {authenticating ? "AUTHENTICATING..." : "AUTHENTICATE"}
          </motion.button>
        </form>

        <div className="mt-5 text-center text-[10px] tracking-wider text-lavender-dim/70">
          NO CREDENTIALS REQUIRED — SIMULATION MODE
        </div>
      </motion.div>
    </motion.div>
  );
}
