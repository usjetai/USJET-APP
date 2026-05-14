import { useMemo } from "react";
import { fleetManifest } from "../../data/fleetManifest";
import EkgPulseLine from "./EkgPulseLine";

const FLEET_COUNT = fleetManifest.length;

export default function IntelFleetVitals() {
  const activeCount = useMemo(
    () => fleetManifest.filter((unit) => unit.status === "active" || unit.status === "staging").length,
    [],
  );

  return (
    <div className="intel-fleet-vitals" aria-label={`Fleet vitals — ${activeCount} of ${FLEET_COUNT} AI units networked`}>
      <div className="intel-fleet-vitals__meta">
        <span className="intel-fleet-vitals__label">Fleet EKG · {FLEET_COUNT} units</span>
        <span className="intel-fleet-vitals__status">
          <span className="intel-fleet-vitals__dot" aria-hidden />
          {activeCount}/{FLEET_COUNT} online
        </span>
        </div>
      <div className="intel-fleet-vitals__ekg">
        <EkgPulseLine variant="hero" seed={30} />
      </div>
      <div className="intel-fleet-vitals__ticks" aria-hidden>
        {fleetManifest.map((unit) => (
          <span
            key={unit.id}
            className={[
              "intel-fleet-vitals__tick",
              unit.status === "active" ? "intel-fleet-vitals__tick--active" : "",
              unit.status === "staging" ? "intel-fleet-vitals__tick--staging" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            title={`Bay ${unit.slot + 1} · ${unit.name}`}
          />
        ))}
      </div>
    </div>
  );
}
