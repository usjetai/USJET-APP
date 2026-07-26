import { getIntelSlotMarket } from "../../../data/intelCoinbaseAssets";
import { useIntelLiveMarket } from "../../../context/IntelLiveMarketContext";
import { formatTickerChange } from "../../../lib/intelWings";
import CoinbaseLiveCandles from "../CoinbaseLiveCandles";
import NyseLiveEmbed from "../NyseLiveEmbed";

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(n);
}

export type MarketDualFeedProps = {
  seedSlot: number;
};

/**
 * Expanded Intel workbench dual pane — Coinbase spot + live NYSE TradingView board.
 * Founder command Jul 26, 2026: hold line removed.
 */
export default function MarketDualFeed({ seedSlot }: MarketDualFeedProps) {
  const market = getIntelSlotMarket(seedSlot);
  const { quotes, holdLine, simulated } = useIntelLiveMarket();
  const quote = quotes[market.coinbaseProductId];

  const change = quote?.changePct24h ?? null;
  const changeUp = change !== null && change > 0;
  const changeDown = change !== null && change < 0;
  const laneLabel = simulated || holdLine ? "Simulated pulse" : "Coinbase";

  return (
    <div className="intel-market-dual">
      <section
        className="intel-market-dual__pane intel-market-dual__pane--btc"
        aria-label={`${market.coinbaseLabel} ${laneLabel} feed`}
      >
        <div className="intel-market-dual__grid" aria-hidden />
        <div className="intel-market-dual__content">
          <p className="intel-market-dual__eyebrow">
            {laneLabel} · {market.coinbaseLabel}
          </p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--hero">
            {quote ? formatUsd(quote.priceUsd) : "— — —"}
          </p>
          <p
            className={[
              "intel-market-dual__instrument intel-market-dual__instrument--delta",
              !quote || change === null ? "intel-market-dual__instrument--muted" : "",
              changeUp ? "intel-market-dual__instrument--up" : "",
              changeDown ? "intel-market-dual__instrument--down" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {!quote
              ? "Pulse spinning up"
              : `24h ${change === null ? "—" : formatTickerChange(change)}`}
          </p>
          <div className="intel-market-dual__chart intel-market-dual__chart--coinbase">
            <CoinbaseLiveCandles slot={seedSlot} candleCount={12} className="intel-market-dual__candles-live" />
          </div>
        </div>
      </section>

      <div className="intel-market-dual__divider" aria-hidden />

      <section
        className="intel-market-dual__pane intel-market-dual__pane--nyse"
        aria-label={`${market.nyseSymbol} NYSE live board`}
      >
        <div className="intel-market-dual__content intel-market-dual__content--nyse">
          <p className="intel-market-dual__eyebrow">NYSE · live board</p>
          <p className="intel-market-dual__instrument intel-market-dual__instrument--label">
            {market.nyseSymbol}
          </p>
          <div className="intel-market-dual__nyse-board">
            <NyseLiveEmbed
              tradingViewSymbol={market.nyseTradingViewSymbol}
              title={`${market.nyseSymbol} NYSE live board`}
              className="intel-market-dual__nyse-embed"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
