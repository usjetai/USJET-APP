import { useCallback, useEffect, useState } from "react";
import SignalPulse from "../SignalPulse";
import {
  fetchBtcSnapshot,
  fetchBtcSparkline,
  sparklinePointsToPath,
  type BtcSnapshot,
} from "../../../lib/intelMarketFeeds";
import { MARKET_WORKBENCH_BTC_POLL_MS, MARKET_WORKBENCH_NYSE_EMBED } from "./marketWorkbench.config";

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(n);
}

function formatChange(pct: number | null): string {
  if (pct === null || Number.isNaN(pct)) {
    return "—";
  }
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
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
  /** De-correlates ghost pulse traces between the two panes. */
  seedSlot: number;
};

/**
 * 50 / 50 market workbench: BTC spot + spark (left), NYSE composite embed (right).
 * Self-contained so Hangar can mount the same component beside fleet tiles later.
 */
export default function MarketDualFeed({ seedSlot }: MarketDualFeedProps) {
  const [btc, setBtc] = useState<BtcSnapshot | null>(null);
  const [spark, setSpark] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nyClock, setNyClock] = useState(() => formatNyExchangeClock(new Date()));

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [snap, path] = await Promise.all([fetchBtcSnapshot(), fetchBtcSparkline()]);
      setBtc(snap);
      setSpark(path);
    } catch {
      setError("signal");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => {
      void refresh();
    }, MARKET_WORKBENCH_BTC_POLL_MS);
    return () => {
      window.clearInterval(id);
    };
  }, [refresh]);

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

  const polyline = sparklinePointsToPath(spark);
  const change = btc?.changePct24h ?? null;
  const changeUp = change !== null && change > 0;
  const changeDown = change !== null && change < 0;

  return (
    <div className="intel-market-dual">
      <section
        className="intel-market-dual__pane intel-market-dual__pane--btc"
        aria-label="Bitcoin USD spot and intraday trace"
      >
        <div className="intel-market-dual__pulse" aria-hidden>
          <SignalPulse slot={seedSlot} />
        </div>
        <div className="intel-market-dual__grid" aria-hidden />
        <div className="intel-market-dual__content">
          <p className="intel-market-dual__eyebrow">Wing feed · BTC / USD</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--hero">
            {btc ? formatUsd(btc.priceUsd) : error ? "— — —" : "· · ·"}
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
            24h {formatChange(change)}
          </p>
          <div className="intel-market-dual__chart">
            {polyline ? (
              <svg className="intel-market-dual__spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
                <polyline className="intel-market-dual__spark-line" points={polyline} />
              </svg>
            ) : (
              <div className="intel-market-dual__chart-placeholder" aria-hidden />
            )}
          </div>
        </div>
      </section>

      <div className="intel-market-dual__divider" aria-hidden />

      <section className="intel-market-dual__pane intel-market-dual__pane--nyse" aria-label="NYSE composite overview">
        <div className="intel-market-dual__pulse" aria-hidden>
          <SignalPulse slot={seedSlot + 17} />
        </div>
        <div className="intel-market-dual__grid" aria-hidden />
        <div className="intel-market-dual__content intel-market-dual__content--nyse">
          <p className="intel-market-dual__eyebrow">Exchange feed · NYSE</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--label">NYA · composite</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--nyse-clock">{nyClock.time}</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--nyse-date">{nyClock.date} ET</p>
          <div className="intel-market-dual__iframe-shell">
            <iframe
              className="intel-market-dual__iframe"
              title="NYSE composite — TradingView"
              src={MARKET_WORKBENCH_NYSE_EMBED}
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
