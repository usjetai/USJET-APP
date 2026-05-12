import TickerDisplay from "./TickerDisplay";
import type { FleetUnit } from "../../types/fleet";

type IntelMonitorProps = {
  unit: FleetUnit;
  index: number;
};

const GRAPH_VARIANTS = [
  "0,28 12,24 24,26 36,18 48,22 60,14 72,20 84,10 100,16",
  "0,22 14,26 28,20 42,24 56,16 70,22 84,14 100,18",
  "0,26 10,18 22,24 34,16 46,22 58,12 70,20 82,14 100,24",
];

export default function IntelMonitor({ unit, index }: IntelMonitorProps) {
  const graphPoints = GRAPH_VARIANTS[index % GRAPH_VARIANTS.length];

  return (
    <article
      className="intel-monitor"
      style={{ animationDelay: `${(index % 6) * 0.15}s` }}
    >
      <header className="intel-monitor__header">
        <p className="intel-monitor__callsign">{unit.callsign}</p>
        <span className="intel-monitor__status">{unit.status}</span>
      </header>

      <div className="intel-monitor__screen">
        <div className="intel-monitor__grid" aria-hidden />
        <div className="intel-monitor__scan" aria-hidden />
        <div className="intel-monitor__feed">
          <svg
            className="intel-monitor__graph"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            aria-hidden
          >
            <polyline className="intel-monitor__graph-line" points={graphPoints} />
          </svg>
          <TickerDisplay slot={unit.slot} />
        </div>
      </div>
    </article>
  );
}
