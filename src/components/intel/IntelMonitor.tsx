import type { CSSProperties } from "react";
import TickerDisplay from "./TickerDisplay";
import SignalPulse from "./SignalPulse";
import { type FleetUnit, HANGAR_COLUMNS } from "../../types/fleet";

type IntelMonitorProps = {
  unit: FleetUnit;
  index: number;
  style?: CSSProperties;
  onExpandRequest?: () => void;
};

export default function IntelMonitor({ unit, index, style, onExpandRequest }: IntelMonitorProps) {
  const interactive = Boolean(onExpandRequest);

  return (
    <article
      className={["intel-monitor", interactive ? "intel-monitor--expandable" : ""].filter(Boolean).join(" ")}
      style={{
        animationDelay: `${(index % HANGAR_COLUMNS) * 0.15}s`,
        ...style,
      }}
      onClick={interactive ? onExpandRequest : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onExpandRequest?.();
              }
            }
          : undefined
      }
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? `Expand ${unit.callsign} workstation` : undefined}
    >
      <header className="intel-monitor__header">
        <p className="intel-monitor__callsign">{unit.callsign}</p>
        <span className="intel-monitor__status">{unit.status}</span>
      </header>

      <div className="intel-monitor__screen">
        <div className="intel-monitor__pulse-back" aria-hidden>
          <SignalPulse slot={unit.slot} />
        </div>
        <div className="intel-monitor__grid" aria-hidden />
        <div className="intel-monitor__scan" aria-hidden />
        <div className="intel-monitor__feed">
          <TickerDisplay slot={unit.slot} />
        </div>
      </div>
    </article>
  );
}