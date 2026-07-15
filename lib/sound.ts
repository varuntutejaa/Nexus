"use client";

let audioCtx: AudioContext | null = null;
let ambientNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext };
  const w = window as WindowWithWebkitAudio;
  const Ctx = window.AudioContext || w.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

/** Sonar-ping style blip for new anomalies / action confirmations. */
export function playBlip(freq = 880, duration = 0.18, volume = 0.1) {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

/** Harsher, short tone reserved for critical-severity events only. */
export function playCriticalTone() {
  const ctx = getContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.42);
  gain.gain.setValueAtTime(0.13, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.46);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.46);
}

export function startAmbientHum() {
  const ctx = getContext();
  if (!ctx || ambientNodes) return;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.value = 55;
  osc2.type = "sine";
  osc2.frequency.value = 82.5;
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(0.018, ctx.currentTime + 1.2);
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.start();
  osc2.start();
  ambientNodes = { osc1, osc2, gain };
}

export function stopAmbientHum() {
  if (!ambientNodes || !audioCtx) return;
  const { osc1, osc2, gain } = ambientNodes;
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
  setTimeout(() => {
    osc1.stop();
    osc2.stop();
  }, 450);
  ambientNodes = null;
}
