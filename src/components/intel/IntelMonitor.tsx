import type { CSSProperties, KeyboardEvent } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { getWingForSlot } from "../../lib/intelWings";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import IntelMonitorIdentity from "./IntelMonitorIdentity";
import TickerDisplay from "./TickerDisplay";
import EkgPulseLine from "./EkgPulseLine";
import IntelScanLine from "./IntelScanLine";
import MarketCandlesticks from "./MarketCandlesticks";
import NyseTicker from "./NyseTicker";
import { type FleetUnit } from "../../types/fleet";

type IntelMonitorProps = {
  unit: FleetUnit;
  index: number;
  style?: CSSProperties;
  onExpandRequest?: () => void;
};

const WING_VOLATILITY: Record<string, number> = {
  "BTC/USD": 420,
  NVDA: 18,
  TSLA: 4.2,
};

export default function IntelMonitor({ unit, index: _index, style, onExpandRequest }: IntelMonitorProps) {
  const interactive = Boolean(onExpandRequest);
  const wing = getWingForSlot(unit.slot);
  const volatility = WING_VOLATILITY[wing.symbol] ?? 12;

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
        <span className="intel-monitor__status">{unit.status}</span>
      </header>

      <div className="intel-monitor__screen liquid-glass-background">
        <div className="intel-monitor__candles" aria-hidden>
          <MarketCandlesticks
            seed={unit.slot}
            basePrice={wing.basePrice}
            volatility={volatility}
            candleCount={8}
          />
        </div>
        <div className="intel-monitor__pulse-back" aria-hidden>
          <EkgPulseLine variant="monitor" seed={unit.slot} />
        </div>
        <div className="intel-monitor__grid" aria-hidden />
        <IntelScanLine />
        <div className="intel-monitor__feed">
          <TickerDisplay slot={unit.slot} />
        </div>
        <div className="intel-monitor__nyse">
          <NyseTicker />
        </div>
      </div>
    </article>
  );
}
