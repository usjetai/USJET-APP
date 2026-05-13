import { Activity, Wrench } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import EkgPulseLine from "./EkgPulseLine";
import MarketCandlesticks from "./MarketCandlesticks";
import TickerDisplay from "./TickerDisplay";
import type { WingTickerConfig } from "../../lib/intelWings";

const PULSE_WINGS: { slot: number; config: WingTickerConfig; volatility: number }[] = [
  {
    slot: 2,
    config: { wing: "crypto", symbol: "BTC/USD", label: "Crypto Wing", basePrice: 62450, step: 95 },
    volatility: 420,
  },
  {
    slot: 12,
    config: { wing: "infra", symbol: "NVDA", label: "Infra Wing", basePrice: 895.4, step: 1.85 },
    volatility: 18,
  },
  {
    slot: 22,
    config: { wing: "autonomy", symbol: "TSLA", label: "Autonomy Wing", basePrice: 182.5, step: 0.65 },
    volatility: 4.2,
  },
];

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
          <motion.div>
            <h1 id="intel-pulse-heading" className="intel-pulse__title">
              Intel <span className="intel-pulse__title-accent">Pulse</span>
            </h1>
            <p className="intel-pulse__subtitle">
              Field-grade market telemetry — built for operators turning wrenches, not boardroom decks.
            </p>
          </motion.div>
        </div>
      </header>

      <GlassEffectContainer className="intel-pulse__ekg-shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="intel-pulse__ekg-meta">
          <span className="intel-pulse__ekg-label">Vitals · Market EKG</span>
          <span className="intel-pulse__ekg-status">
            <span className="intel-pulse__ekg-dot" aria-hidden />
            Live
          </span>
        </div>
        <div className="intel-pulse__ekg-stage">
          <EkgPulseLine variant="hero" seed={7} />
        </div>
      </GlassEffectContainer>

      <div className="intel-pulse__wing-grid">
        {PULSE_WINGS.map((wing, index) => (
          <GlassEffectContainer
            key={wing.config.symbol}
            className="intel-pulse__wing glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
          >
            <div className="intel-pulse__wing-head">
              <p className="intel-pulse__wing-label">{wing.config.label}</p>
              <p className="intel-pulse__wing-symbol">{wing.config.symbol}</p>
            </div>
            <div className="intel-pulse__wing-chart">
              <MarketCandlesticks
                seed={wing.slot + index * 11}
                basePrice={wing.config.basePrice}
                volatility={wing.volatility}
                candleCount={12}
              />
            </div>
            <div className="intel-pulse__wing-ticker">
              <TickerDisplay slot={wing.slot} />
            </div>
          </GlassEffectContainer>
        ))}
      </motion.div>
    </section>
  );
}
