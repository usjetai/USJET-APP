import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type EkgPulseLineProps = {
  /** Visual density — dashboard uses full width; monitors use compact. */
  variant?: "hero" | "monitor";
  className?: string;
  seed?: number;
  /** Number of overlaid traces — Intel Pulse hero uses 3 to match wing vitals. */
  traces?: 1 | 2 | 3;
};

const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 40;
const BASELINE = 20;
const BEAT_CYCLE = 28;

function initialLayerOffsets(traceCount: number): number[] {
  return Array.from({ length: traceCount }, () => (Math.random() - 0.5) * BEAT_CYCLE * 9);
}

function scrollRatesPerLayer(traceCount: number, variant: "hero" | "monitor"): number[] {
  const scale = variant === "hero" ? 1.15 : 1;
  return Array.from({ length: traceCount }, () => scale * (4.8 + Math.random() * 10.8));
}

/** Classic monitor P–QRS–T silhouette for one cardiac cycle (x in cycle units). */
function ekgSample(cycleX: number): number {
  const t = ((cycleX % BEAT_CYCLE) + BEAT_CYCLE) % BEAT_CYCLE;

  if (t < 5) return BASELINE;
  if (t < 6) return BASELINE - 1.5;
  if (t < 6.6) return BASELINE + 12.5;
  if (t < 7.2) return BASELINE - 7.5;
  if (t < 7.8) return BASELINE + 2.5;
  if (t < 9) return BASELINE - 0.5;
  if (t < 9.8) return BASELINE + 3.5;
  if (t < 11.5) return BASELINE;
  return BASELINE + Math.sin(t * 0.35) * 0.35;
}

function buildEkgPath(scroll: number, pointCount: number, seed: number): string {
  const parts: string[] = [];

  for (let index = 0; index < pointCount; index++) {
    const x = (index / (pointCount - 1)) * VIEW_WIDTH;
    const cycleX = x * 0.95 + scroll + seed * 0.6;
    const micro = Math.sin(cycleX * 0.85 + seed) * 0.25;
    const y = ekgSample(cycleX) + micro;
    parts.push(`${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return parts.join(" ");
}

const TRACE_LAYERS: { scrollOffset: number; seedOffset: number; className: string }[] = [
  { scrollOffset: -3.4, seedOffset: 11, className: "intel-ekg__trace--ghost" },
  { scrollOffset: -1.8, seedOffset: 3, className: "intel-ekg__trace--echo" },
  { scrollOffset: 0, seedOffset: 0, className: "intel-ekg__trace--main" },
];

export default function EkgPulseLine({
  variant = "monitor",
  className = "",
  seed = 0,
  traces = 2,
}: EkgPulseLineProps) {
  const activeLayers = useMemo(() => TRACE_LAYERS.slice(3 - traces), [traces]);
  const traceCount = activeLayers.length;
  const pointCount = variant === "hero" ? 140 : 72;

  const [layerScrolls, setLayerScrolls] = useState(() => initialLayerOffsets(traceCount));

  useEffect(() => {
    setLayerScrolls(initialLayerOffsets(traceCount));
  }, [traceCount, variant]);

  const scrollRates = useMemo(() => scrollRatesPerLayer(traceCount, variant), [traceCount, variant]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const schedule = (): void => {
      if (cancelled || document.hidden) {
        timeoutId = window.setTimeout(schedule, 480);
        return;
      }

      const nextGapMs = reducedMotion
        ? 640 + Math.random() * 900
        : variant === "hero"
          ? 26 + Math.random() * 52
          : 34 + Math.random() * 64;

      timeoutId = window.setTimeout(() => {
        setLayerScrolls((prev) =>
          prev.map((scroll, layerIndex) => {
            const rate = scrollRates[layerIndex] ?? 8;
            const jitter = reducedMotion ? 0.22 + Math.random() * 0.35 : 0.55 + Math.random() * 0.92;
            const stepScale = variant === "hero" ? 0.052 : 0.046;
            return scroll + rate * jitter * stepScale * (reducedMotion ? 0.14 : 1);
          }),
        );
        schedule();
      }, nextGapMs);
    };

    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [variant, scrollRates]);

  const pulseStyle = useMemo(
    () =>
      ({
        "--intel-beacon-period": `${0.62 + Math.random() * 1.12}s`,
        "--intel-beacon-delay": `-${Math.random() * 1.85}s`,
      }) as CSSProperties,
    [],
  );

  const paths = useMemo(
    () =>
      activeLayers.map((layer, index) =>
        buildEkgPath(layerScrolls[index] + layer.scrollOffset, pointCount, seed + layer.seedOffset),
      ),
    [activeLayers, layerScrolls, pointCount, seed],
  );

  return (
    <svg
      style={pulseStyle}
      className={["intel-ekg", variant === "hero" ? "intel-ekg--hero" : "intel-ekg--monitor", className]
        .filter(Boolean)
        .join(" ")}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <line className="intel-ekg__baseline" x1="0" y1={BASELINE} x2={VIEW_WIDTH} y2={BASELINE} />
      {activeLayers.map((layer, index) => (
        <path key={layer.className} className={["intel-ekg__trace", layer.className].join(" ")} d={paths[index]} />
      ))}
      <circle className="intel-ekg__beacon" cx={VIEW_WIDTH - 1.5} cy={BASELINE} r="1.1" />
    </svg>
  );
}
