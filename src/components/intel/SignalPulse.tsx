import { useEffect, useMemo, useState } from "react";

type SignalPulseProps = {
  slot: number;
};

const POINT_COUNT = 22;

function buildPoints(slot: number, phase: number): number[] {
  return Array.from({ length: POINT_COUNT }, (_, index) => {
    const progress = index / (POINT_COUNT - 1);
    const waveA = Math.sin(phase + progress * Math.PI * 2.6 + slot * 0.37);
    const waveB = Math.sin(phase * 1.55 + progress * Math.PI * 4.2 + slot * 0.19) * 0.48;
    const waveC = Math.sin(phase * 2.2 + progress * Math.PI * 6 + slot * 0.11) * 0.22;
    const center = 20 + waveA * 10 + waveB * 5.5 + waveC * 3;
    return Math.max(4, Math.min(36, center));
  });
}

export default function SignalPulse({ slot }: SignalPulseProps) {
  const [phase, setPhase] = useState(() => slot * 0.47);
  const [jitter, setJitter] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intervalMs = reducedMotion ? 1100 : 140;

    const intervalId = window.setInterval(() => {
      setPhase((current) => current + (reducedMotion ? 0.1 : 0.48));
      setJitter((Math.random() - 0.5) * (reducedMotion ? 0.25 : 1.8));
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const points = useMemo(() => buildPoints(slot, phase + jitter), [jitter, phase, slot]);
  const echoPoints = useMemo(() => buildPoints(slot, phase + jitter - 0.85), [jitter, phase, slot]);

  const toPolyline = (values: number[]) =>
    values
      .map((value, index) => {
        const x = (index / (POINT_COUNT - 1)) * 100;
        return `${x},${value}`;
      })
      .join(" ");

  const polyline = toPolyline(points);
  const echoLine = toPolyline(echoPoints);

  return (
    <svg
      className="intel-monitor__graph intel-monitor__graph--ghost"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        className="intel-monitor__graph-line intel-monitor__graph-line--ghost-echo"
        points={echoLine}
      />
      <polyline
        className="intel-monitor__graph-line intel-monitor__graph-line--ghost-main"
        points={polyline}
      />
    </svg>
  );
}
