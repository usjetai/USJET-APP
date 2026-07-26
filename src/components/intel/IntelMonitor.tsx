import type { CSSProperties, KeyboardEvent } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { getIntelSlotMarket } from "../../data/intelCoinbaseAssets";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import { useSimulatedAgentActivity } from "../../lib/useSimulatedAgentActivity";
import IntelMonitorIdentity from "./IntelMonitorIdentity";
import CoinbaseLiveTicker from "./CoinbaseLiveTicker";
import CoinbaseLiveCandles from "./CoinbaseLiveCandles";
import IntelScanLine from "./IntelScanLine";
import NyseTicker from "./NyseTicker";
import { type FleetUnit } from "../../types/fleet";

type IntelMonitorProps = {
  unit: FleetUnit;
  index: number;
  style?: CSSProperties;
  onExpandRequest?: () => void;
};

export default function IntelMonitor({ unit, index: _index, style, onExpandRequest }: IntelMonitorProps) {
  const interactive = Boolean(onExpandRequest);
  const slotMarket = getIntelSlotMarket(unit.slot);
  const { status: simulatedActivityStatus } = useSimulatedAgentActivity(unit.callsign);


  return (
    <article
      className={[
        "intel-monitor",
        "intel-monitor--bay-accent",
        "glass-effect",
        "liquid-glass-background",
        "glass-tint-cyan",
        interactive ? "intel-monitor--expandable" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        animationDelay: `${Math.random() * 1.9}s`,
        ...fleetBayAccentStyle(unit.slot),
        ...style,
      }}
      onClick={
        interactive
          ? () => {
              logFleetUsageIfMember(unit.callsign, unit.name);
              onExpandRequest?.();
            }
          : undefined
      }
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                logFleetUsageIfMember(unit.callsign, unit.name);
                onExpandRequest?.();
              }
            }
          : undefined
      }
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? `Expand ${unit.name} workstation` : undefined}
    >
      <header className="intel-monitor__header">
        <IntelMonitorIdentity unit={unit} />
        <span className="intel-monitor__status">{simulatedActivityStatus}</span>
      </header>

      <div className="intel-monitor__screen liquid-glass-background">
        <div className="intel-monitor__candles" aria-hidden>
          <CoinbaseLiveCandles slot={unit.slot} candleCount={8} />
        </div>
        <div className="intel-monitor__grid" aria-hidden />
        <IntelScanLine />
        <div className="intel-monitor__feed">
          <CoinbaseLiveTicker slot={unit.slot} />
        </div>
        <div className="intel-monitor__nyse">
          <NyseTicker symbol={slotMarket.nyseSymbol} />
        </div>
      </div>
    </article>
  );
}
