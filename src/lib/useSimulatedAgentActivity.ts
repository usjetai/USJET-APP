import { useEffect, useMemo, useRef, useState } from "react";

export type SimulatedAgentStatus =
  | "Processing..."
  | "Idle"
  | "Optimizing..."
  | "Compiling..."
  | "Synthesizing..."
  | "Routing..."
  | "Deploying..."
  | "Waiting for input...";

const STATUSES: SimulatedAgentStatus[] = [
  "Processing...",
  "Idle",
  "Optimizing...",
  "Compiling...",
  "Synthesizing...",
  "Routing...",
  "Deploying...",
  "Waiting for input...",
];

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStringTo32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickStatus(rnd: () => number, indexBias: number): SimulatedAgentStatus {
  // bias so each tile tends to stay in its own "lane" but still changes over time
  const raw = rnd();
  const idx = Math.floor((raw * 0.82 + (indexBias % STATUSES.length) * 0.18) * STATUSES.length) % STATUSES.length;
  return STATUSES[Math.max(0, Math.min(STATUSES.length - 1, idx))];
}

export function useSimulatedAgentActivity(agentKey: string) {
  const seed = useMemo(() => hashStringTo32(agentKey), [agentKey]);
  const rndRef = useRef<ReturnType<typeof mulberry32> | null>(null);

  const [status, setStatus] = useState<SimulatedAgentStatus>(() => {
    if (!rndRef.current) rndRef.current = mulberry32(seed);
    return pickStatus(rndRef.current, seed);
  });

  useEffect(() => {
    if (!rndRef.current) rndRef.current = mulberry32(seed);

    const intervalId = window.setInterval(() => {
      // Every 30s, update status with deterministic per-tile PRNG + time.
      // That keeps it "live" but still consistent.
      const now = Date.now();
      const nowSeed = (seed ^ (now >>> 6)) >>> 0;
      const localRnd = mulberry32(nowSeed);
      setStatus(pickStatus(localRnd, seed));
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, [seed]);

  return { status };
}

