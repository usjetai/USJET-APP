import { getIntelSlotMarket } from "../../data/intelCoinbaseAssets";
import { useIntelLiveMarketOptional } from "../../context/IntelLiveMarketContext";
import { formatTickerChange, formatTickerPrice } from "../../lib/intelWings";

type CoinbaseLiveTickerProps = {
  slot: number;
};

export default function CoinbaseLiveTicker({ slot }: CoinbaseLiveTickerProps) {
  const market = getIntelSlotMarket(slot);
  const live = useIntelLiveMarketOptional();
  const quote = live?.quotes[market.coinbaseProductId];
  const loading = live?.loading && !quote;
  const changePct = quote?.changePct24h ?? 0;

  return (
    <div className="ticker-display ticker-display--coinbase">
      <p className="ticker-display__symbol">{market.coinbaseLabel} · Coinbase</p>
      <p className="ticker-display__price">
        {quote ? formatTickerPrice(market.coinbaseLabel, quote.priceUsd) : loading ? "· · ·" : "— — —"}
      </p>
      <p
        className={[
          "ticker-display__change",
          changePct >= 0 ? "ticker-display__change--positive" : "ticker-display__change--negative",
        ].join(" ")}
      >
        {quote ? formatTickerChange(changePct) : "24h —"}
      </p>
    </div>
  );
}
