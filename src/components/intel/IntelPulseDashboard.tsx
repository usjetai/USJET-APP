import { useEffect, useState } from "react";
import { Activity, Wrench } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import EkgPulseLine from "./EkgPulseLine";
import MarketCandlesticks from "./MarketCandlesticks";
import TickerDisplay from "./TickerDisplay";
import { formatTickerChange, getWingForSlot } from "../../lib/intelWings";

const PULSE_WINGS: { slot: number; volatility: number }[] = [
  { slot: 2, volatility: 420 },
  { slot: 12, volatility: 18 },
  { slot: 22, volatility: 4.2 },
];

function PulseVitalMetric({ slot }: { slot: number }) {
  const config = getWingForSlot(slot);
  const [changePct, setChangePct] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const drift = (Math.random() - 0.48) * config.step;
      const next = Math.max(config.basePrice * 0.82, config.basePrice + drift);
      setChangePct(((next - config.basePrice) / config.basePrice) * 100);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [config.basePrice, config.step]);

  return (
    <div className="intel-pulse__ekg-metric">
      <span className="intel-pulse__ekg-metric-label">{config.label}</span>
      <span className="intel-pulse__ekg-metric-symbol">{config.symbol}</span>
      <span
        className={[
          "intel-pulse__ekg-metric-value",
          changePct >= 0 ? "intel-pulse__ekg-metric-value--up" : "intel-pulse__ekg-metric-value--down",
        ].join(" ")}
      >
        {formatTickerChange(changePct)}
      </span>
    </div>
  );
}

export default function IntelPulseDashboard() {
  return (
    <section className="intel-pulse" aria-labelledby="intel-pulse-heading">
      <header className="intel-pulse__header">
        <div className="intel-pulse__kicker-row">
          <Wrench size={14} className="intel-pulse__wrench" aria-hidden />
          <p className="intel-pulse__kicker">Wrenches, Not Slides</p>
        </div>
        <div className="intel-pulse__title-row">
          <Activity className="intel-pulse__icon" size={44} aria-hidden />
          <div>
            <h1 id="intel-pulse-heading" className="intel-pulse__title">
              Intel <span className="intel-pulse__title-accent">Pulse</span>
            </h1>
            <p className="intel-pulse__subtitle">
              Field-grade market telemetry — built for operators turning wrenches, not boardroom decks.
            </p>
          </div>
        </div>
      </header>

      <GlassEffectContainer className="intel-pulse__ekg-shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="intel-pulse__ekg-meta">
          <div className="intel-pulse__ekg-meta-copy">
            <span className="intel-pulse__ekg-label">Vitals Market EKG</span>
            <p className="intel-pulse__ekg-hold">
              Frequency channels are still helping other customers. Please continue to hold.
            </p>
          </div>
          <span className="intel-pulse__ekg-badge" title="Cockpit immersion telemetry — not live partner P&L">
            Market Pulse · Simulated
          </span>
        </div>
        <div className="intel-pulse__ekg-stage">
          <EkgPulseLine variant="hero" seed={7} traces={3} />
        </div>
        <div className="intel-pulse__ekg-footer" aria-label="Intel pulse vitals channels">
          {PULSE_WINGS.map((wing) => (
            <PulseVitalMetric key={wing.slot} slot={wing.slot} />
          ))}
        </div>
      </GlassEffectContainer>

      <div className="intel-pulse__wing-grid">
        {PULSE_WINGS.map((wing, index) => {
          const config = getWingForSlot(wing.slot);

          return (
            <GlassEffectContainer
              key={config.symbol}
              className="intel-pulse__wing glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
            >
              <div className="intel-pulse__wing-head">
                <p className="intel-pulse__wing-label">{config.label}</p>
                <p className="intel-pulse__wing-symbol">{config.symbol}</p>
              </div>
              <div className="intel-pulse__wing-chart">
                <MarketCandlesticks
                  seed={wing.slot + index * 11}
                  basePrice={config.basePrice}
                  volatility={wing.volatility}
                  candleCount={12}
                />
              </div>
              <div className="intel-pulse__wing-ticker">
                <TickerDisplay slot={wing.slot} />
              </div>
            </GlassEffectContainer>
          );
        })}
      </div>
    </section>
  );
}
