import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

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
  const [phase, setPhase] = useState(() => slot * 0.47 + Math.random() * 1.25);
  const [jitter, setJitter] = useState(0);

  const ghostStyle = useMemo(
    () =>
      ({
        "--intel-ghost-echo-period": `${2.1 + Math.random() * 2.95}s`,
        "--intel-ghost-main-period": `${1.75 + Math.random() * 3.05}s`,
        "--intel-ghost-echo-delay": `-${Math.random() * 4.5}s`,
        "--intel-ghost-main-delay": `-${Math.random() * 4.5}s`,
      }) as CSSProperties,
    [],
  );

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let timeoutId = 0;

    const schedule = (): void => {
      if (cancelled) return;
      const nextGapMs = reducedMotion ? 900 + Math.random() * 950 : 88 + Math.random() * 180;
      timeoutId = window.setTimeout(() => {
        const step =
          reducedMotion ? 0.08 + Math.random() * 0.12 : 0.32 + Math.random() * (0.45 + slot * 0.012);
        setPhase((current) => current + step);
        setJitter((Math.random() - 0.5) * (reducedMotion ? 0.28 : 2.05));
        schedule();
      }, nextGapMs);
    };

    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [slot]);

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
      style={ghostStyle}
      className="intel-monitor__graph intel-monitor__graph--ghost"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline className="intel-monitor__graph-line intel-monitor__graph-line--ghost-echo" points={echoLine} />
      <polyline className="intel-monitor__graph-line intel-monitor__graph-line--ghost-main" points={polyline} />
    </svg>
  );
}
