import { useEffect, useMemo, useState } from "react";
import { getIntelSlotMarket } from "../../../data/intelCoinbaseAssets";
import { useIntelLiveMarket } from "../../../context/IntelLiveMarketContext";
import { sparklinePointsToPath } from "../../../lib/intelMarketFeeds";
import { formatTickerChange } from "../../../lib/intelWings";
import SignalPulse from "../SignalPulse";
import CoinbaseLiveCandles from "../CoinbaseLiveCandles";
import { MARKET_WORKBENCH_BTC_POLL_MS, marketWorkbenchNyseEmbed } from "./marketWorkbench.config";

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
 * Expanded Intel workbench: Coinbase live spot + candles (left), NYSE symbol embed (right).
 */
export default function MarketDualFeed({ seedSlot }: MarketDualFeedProps) {
  const market = getIntelSlotMarket(seedSlot);
  const { quotes, candles, refreshQuotes, error } = useIntelLiveMarket();
  const quote = quotes[market.coinbaseProductId];
  const coinCandles = candles[market.coinbaseProductId] ?? [];
  const [nyClock, setNyClock] = useState(() => formatNyExchangeClock(new Date()));

  useEffect(() => {
    void refreshQuotes();
    const id = window.setInterval(() => {
      void refreshQuotes();
    }, MARKET_WORKBENCH_BTC_POLL_MS);
    return () => {
      window.clearInterval(id);
    };
  }, [refreshQuotes]);

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

  const sparkCloses = useMemo(() => coinCandles.map((row) => row.close), [coinCandles]);
  const polyline = sparklinePointsToPath(sparkCloses);
  const change = quote?.changePct24h ?? null;
  const changeUp = change !== null && change > 0;
  const changeDown = change !== null && change < 0;
  const nyseEmbed = marketWorkbenchNyseEmbed(market.nyseTradingViewSymbol);

  return (
    <div className="intel-market-dual">
      <section
        className="intel-market-dual__pane intel-market-dual__pane--btc"
        aria-label={`Coinbase ${market.coinbaseLabel} spot and candles`}
      >
        <div className="intel-market-dual__pulse" aria-hidden>
          <SignalPulse slot={seedSlot} />
        </div>
        <div className="intel-market-dual__grid" aria-hidden />
        <div className="intel-market-dual__content">
          <p className="intel-market-dual__eyebrow">Coinbase · {market.coinbaseLabel}</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--hero">
            {quote ? formatUsd(quote.priceUsd) : error ? "— — —" : "· · ·"}
          </p>
          <p
            className={[
              "intel-market-dual__instrument intel-market-dual__instrument--delta",
              change === null ? "intel-market-dual__instrument--muted" : "",
              changeUp ? "intel-market-dual__instrument--up" : "",
              changeDown ? "intel-market-dual__instrument--down" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            24h {change === null ? "—" : formatTickerChange(change)}
          </p>
          <div className="intel-market-dual__chart intel-market-dual__chart--coinbase">
            {polyline ? (
              <svg className="intel-market-dual__spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
                <polyline className="intel-market-dual__spark-line" points={polyline} />
              </svg>
            ) : (
              <CoinbaseLiveCandles slot={seedSlot} candleCount={12} className="intel-market-dual__candles-live" />
            )}
          </div>
        </div>
      </section>

      <div className="intel-market-dual__divider" aria-hidden />

      <section
        className="intel-market-dual__pane intel-market-dual__pane--nyse"
        aria-label={`NYSE ${market.nyseSymbol} overview`}
      >
        <div className="intel-market-dual__pulse" aria-hidden>
          <SignalPulse slot={seedSlot + 17} />
        </div>
        <div className="intel-market-dual__grid" aria-hidden />
        <div className="intel-market-dual__content intel-market-dual__content--nyse">
          <p className="intel-market-dual__eyebrow">Exchange feed · NYSE</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--label">{market.nyseSymbol}</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--nyse-clock">{nyClock.time}</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--nyse-date">{nyClock.date} ET</p>
          <div className="intel-market-dual__iframe-shell">
            <iframe
              className="intel-market-dual__iframe"
              title={`${market.nyseSymbol} — TradingView`}
              src={nyseEmbed}
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
