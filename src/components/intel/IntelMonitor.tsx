import type { CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import IntelMonitorIdentity from "./IntelMonitorIdentity";
import EkgPulseLine from "./EkgPulseLine";
import IntelScanLine from "./IntelScanLine";
import MarketCandlesticks from "./MarketCandlesticks";
import { type FleetUnit } from "../../types/fleet";

type IntelMonitorProps = {
  unit: FleetUnit;
  index: number;
  style?: CSSProperties;
  onExpandRequest?: () => void;
};

const STOCK_PRICE_LABEL = "Reserved";
const NYSE_VALUE_LABEL = "Feed Reserved";

const AI_ROBINHOOD_COIN_CODES: Record<string, string> = {
  "Adobe Firefly": "RENDER",
  ChatGPT: "WLD",
  Claude: "FET",
  Consensus: "GRT",
  Cursor: "VIRTUAL",
  DeepSeek: "FET",
  ElevenLabs: "VIRTUAL",
  Flux: "RENDER",
  Gamma: "VIRTUAL",
  Gemini: "GUSD",
  "GitHub Copilot": "VIRTUAL",
  Grok: "AIXBT",
  HeyGen: "RENDER",
  Higgsfield: "RENDER",
  Jasper: "VIRTUAL",
  "Leonardo AI": "RENDER",
  "Luma Dream Machine": "RENDER",
  Midjourney: "RENDER",
  "Notion AI": "VIRTUAL",
  "Otter.ai": "VIRTUAL",
  Perplexity: "GRT",
  "Play.ht": "VIRTUAL",
  "Replit Agent": "VIRTUAL",
  Runway: "RENDER",
  Sora: "WLD",
  Suno: "VIRTUAL",
  Synthesia: "RENDER",
  "USJet Origin": "VIRTUAL",
  "v0.dev": "VIRTUAL",
};

function robinhoodCoinCodeForUnit(unit: FleetUnit): string {
  return AI_ROBINHOOD_COIN_CODES[unit.aiName ?? ""] ?? "BTC";
}

const AI_PUBLIC_MARKET_CODES: Record<string, string> = {
  "Adobe Firefly": "ADBE",
  ChatGPT: "MSFT",
  Claude: "AMZN",
  Gemini: "GOOGL",
  "GitHub Copilot": "MSFT",
  Grok: "TSLA",
  Sora: "MSFT",
};

function publicMarketCodeForUnit(unit: FleetUnit): string {
  return AI_PUBLIC_MARKET_CODES[unit.aiName ?? ""] ?? "UNLISTED";
}

function IntelMarketBoard({ unit }: { unit: FleetUnit }) {
  const robinhoodCode = robinhoodCoinCodeForUnit(unit);
  const publicMarketCode = publicMarketCodeForUnit(unit);
  const stockBase = 199.5 + unit.slot * 8.75;
  const nyseBase = 420 + unit.slot * 6.5;

  return (
    <div className="intel-monitor__market-stack">
      <section className="intel-market-card intel-market-card--nyse" aria-label="Robinhood coin code UI-only board">
        <div className="intel-market-card__header">
          <span className="intel-market-card__eyebrow">Robinhood</span>
          <strong className="intel-market-card__title">Coin Code</strong>
        </div>
        <div className="intel-market-card__ledger">
          <div className="intel-market-card__metric">
            <span>AI Coin Code</span>
            <strong>{robinhoodCode}</strong>
          </div>
          <div className="intel-market-card__metric">
            <span>Price</span>
            <strong>{STOCK_PRICE_LABEL}</strong>
          </div>
        </div>
        <div className="intel-market-card__chart" aria-hidden>
          <MarketCandlesticks seed={unit.slot + 101} basePrice={stockBase} volatility={7.4} candleCount={9} />
        </div>
      </section>

      <section className="intel-market-card intel-market-card--exchange" aria-label="New York Stock Exchange UI-only board">
        <div className="intel-market-card__header">
          <span className="intel-market-card__eyebrow">New York</span>
          <strong className="intel-market-card__title">Stock Exchange</strong>
        </div>
        <div className="intel-market-card__ledger">
          <div className="intel-market-card__metric">
            <span>Ticker Code</span>
            <strong>{publicMarketCode}</strong>
          </div>
          <div className="intel-market-card__metric">
            <span>Worth</span>
            <strong>{NYSE_VALUE_LABEL}</strong>
          </div>
        </div>
        <div className="intel-market-card__chart" aria-hidden>
          <MarketCandlesticks seed={unit.slot + 701} basePrice={nyseBase} volatility={5.8} candleCount={9} />
        </div>
      </section>
    </div>
  );
}

export default function IntelMonitor({ unit, index: _index, style, onExpandRequest }: IntelMonitorProps) {
  const interactive = Boolean(onExpandRequest);
  const displayName = unit.aiName ?? "AI";

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
      aria-label={interactive ? `Expand ${displayName} workstation` : undefined}
    >
      <header className="intel-monitor__header">
        <IntelMonitorIdentity unit={unit} />
      </header>

      <div className="intel-monitor__screen liquid-glass-background">
        <div className="intel-monitor__pulse-back" aria-hidden>
          <EkgPulseLine variant="monitor" seed={unit.slot} />
        </div>
        <div className="intel-monitor__grid" aria-hidden />
        <IntelScanLine />
        <IntelMarketBoard unit={unit} />
      </div>
    </article>
  );
}
