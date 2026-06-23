import { useEffect, useMemo, useState } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { fleetManifest } from "../../data/fleetManifest";
import EkgPulseLine from "./EkgPulseLine";

const FLEET_COUNT = fleetManifest.length;

function formatFleetIndex(value: number): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

export default function IntelFleetVitals() {
  const [fleetIndex, setFleetIndex] = useState(1.24);

  const activeCount = useMemo(
    () => fleetManifest.filter((unit) => unit.status === "active" || unit.status === "staging").length,
    [],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFleetIndex((current) => {
        const drift = (Math.random() - 0.49) * 0.18;
        return Math.max(-4.5, Math.min(6.2, current + drift));
      });
    }, 2400);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="intel-fleet-vitals" aria-label={`Fleet vitals — ${activeCount} of ${FLEET_COUNT} AI units networked`}>
      <div className="intel-fleet-vitals__meta">
        <div className="intel-fleet-vitals__meta-copy">
          <span className="intel-fleet-vitals__label">Fleet Vitals Index · {FLEET_COUNT} units</span>
          <p className="intel-fleet-vitals__disclaimer">
            USJET market pulse for cockpit immersion — not aggregate partner income or loss. No live API unless
            wired.
          </p>
        </div>
        <div className="intel-fleet-vitals__meta-end">
          <span className="intel-fleet-vitals__badge">Market Pulse · Simulated</span>
          <span className="intel-fleet-vitals__status">
            <span className="intel-fleet-vitals__dot" aria-hidden />
            {activeCount}/{FLEET_COUNT} online
          </span>
        </div>
      </div>
      <div className="intel-fleet-vitals__ekg">
        <EkgPulseLine variant="hero" seed={30} traces={3} />
      </div>
      <div className="intel-fleet-vitals__footer">
        <div className="intel-fleet-vitals__metric">
          <span className="intel-fleet-vitals__metric-label">30-unit aggregate index</span>
          <span
            className={[
              "intel-fleet-vitals__metric-value",
              fleetIndex >= 0 ? "intel-fleet-vitals__metric-value--up" : "intel-fleet-vitals__metric-value--down",
            ].join(" ")}
          >
            {formatFleetIndex(fleetIndex)}
          </span>
        </div>
        <p className="intel-fleet-vitals__metric-note">
          Simulated fleet-wide pulse — Google, ChatGPT, and partners do not publish P&L to USJET.
        </p>
      </div>
      <div className="intel-fleet-vitals__ticks" aria-hidden>
        {fleetManifest.map((unit) => (
          <span
            key={unit.id}
            className={[
              "intel-fleet-vitals__tick",
              "intel-fleet-vitals__tick--bay-accent",
              unit.status === "active" ? "intel-fleet-vitals__tick--active" : "",
              unit.status === "staging" ? "intel-fleet-vitals__tick--staging" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={fleetBayAccentStyle(unit.slot)}
            title={unit.aiName ?? "AI"}
          />
        ))}
      </div>
    </div>
  );
}
