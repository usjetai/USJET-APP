import { useEffect, useState } from "react";
import { getIntelSlotMarket } from "../../../data/intelCoinbaseAssets";
import { useIntelLiveMarket } from "../../../context/IntelLiveMarketContext";
import { formatTickerChange } from "../../../lib/intelWings";
import SignalPulse from "../SignalPulse";
import CoinbaseLiveCandles from "../CoinbaseLiveCandles";

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(n);
}

function formatNyExchangeClock(date: Date): { time: string; date: string } {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
  }).format(date);

  return { time, date: day };
}

export type MarketDualFeedProps = {
  seedSlot: number;
};

/**
 * Expanded Intel workbench dual pane.
 * Hold line (May 2026): reserved partnership lanes — no live Coinbase/NYSE API feeds until Titans pay.
 */
export default function MarketDualFeed({ seedSlot }: MarketDualFeedProps) {
  const market = getIntelSlotMarket(seedSlot);
  const { quotes, holdLine } = useIntelLiveMarket();
  const quote = quotes[market.coinbaseProductId];
  const [nyClock, setNyClock] = useState(() => formatNyExchangeClock(new Date()));

  useEffect(() => {
    const tick = () => {
      setNyClock(formatNyExchangeClock(new Date()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  const change = quote?.changePct24h ?? null;
  const changeUp = change !== null && change > 0;
  const changeDown = change !== null && change < 0;
  const onHold = holdLine && !quote;

  return (
    <div className="intel-market-dual">
      <section
        className="intel-market-dual__pane intel-market-dual__pane--btc"
        aria-label={
          onHold
            ? `${market.coinbaseLabel} reserved crypto partnership lane`
            : `Coinbase ${market.coinbaseLabel} spot`
        }
      >
        <div className="intel-market-dual__pulse" aria-hidden>
          <SignalPulse slot={seedSlot} />
        </div>
        <div className="intel-market-dual__grid" aria-hidden />
        <div className="intel-market-dual__content">
          <p className="intel-market-dual__eyebrow">
            {onHold ? `Reserved · ${market.coinbaseLabel}` : `Coinbase · ${market.coinbaseLabel}`}
          </p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--hero">
            {onHold ? "HOLD" : quote ? formatUsd(quote.priceUsd) : "— — —"}
          </p>
          <p
            className={[
              "intel-market-dual__instrument intel-market-dual__instrument--delta",
              onHold || change === null ? "intel-market-dual__instrument--muted" : "",
              changeUp ? "intel-market-dual__instrument--up" : "",
              changeDown ? "intel-market-dual__instrument--down" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {onHold ? "Awaiting Titan partnership" : `24h ${change === null ? "—" : formatTickerChange(change)}`}
          </p>
          <div className="intel-market-dual__chart intel-market-dual__chart--coinbase">
            <CoinbaseLiveCandles slot={seedSlot} candleCount={12} className="intel-market-dual__candles-live" />
          </div>
        </div>
      </section>

      <div className="intel-market-dual__divider" aria-hidden />

      <section
        className="intel-market-dual__pane intel-market-dual__pane--nyse"
        aria-label={`${market.nyseSymbol} reserved NY exchange lane`}
      >
        <div className="intel-market-dual__pulse" aria-hidden>
          <SignalPulse slot={seedSlot + 17} />
        </div>
        <div className="intel-market-dual__grid" aria-hidden />
        <div className="intel-market-dual__content intel-market-dual__content--nyse">
          <p className="intel-market-dual__eyebrow">NY lane · reserved</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--label">{market.nyseSymbol}</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--nyse-clock">{nyClock.time}</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--nyse-date">{nyClock.date} ET</p>
          <div className="intel-market-dual__hold-panel" role="status">
            <p className="intel-market-dual__hold-title">Hold line</p>
            <p className="intel-market-dual__hold-copy">
              No NYSE API feed in this build. Exchanges pay USJET for this audience — not the reverse.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
