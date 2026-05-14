import type { CSSProperties } from "react";
import { getWingForSlot } from "../../lib/intelWings";
import TickerDisplay from "./TickerDisplay";
import EkgPulseLine from "./EkgPulseLine";
import MarketCandlesticks from "./MarketCandlesticks";
import { type FleetUnit, HANGAR_COLUMNS } from "../../types/fleet";

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

export default function IntelMonitor({ unit, index, style, onExpandRequest }: IntelMonitorProps) {
  const interactive = Boolean(onExpandRequest);
  const wing = getWingForSlot(unit.slot);
  const volatility = WING_VOLATILITY[wing.symbol] ?? 12;

  return (
    <article
      className={[
        "intel-monitor",
        "glass-effect",
        "liquid-glass-background",
        "glass-tint-cyan",
        interactive ? "intel-monitor--expandable" : "",
      ]
        .filter(Boolean)
        .join(" ")}
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
        <div className="intel-monitor__scan" aria-hidden />
        <div className="intel-monitor__feed">
          <TickerDisplay slot={unit.slot} />
        </div>
      </div>
    </article>
  );
}
