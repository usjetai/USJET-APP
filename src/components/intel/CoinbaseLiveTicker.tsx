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
  const holdLine = live?.holdLine !== false;
  const changePct = quote?.changePct24h ?? 0;

  if (holdLine && !quote) {
    return (
      <div className="ticker-display ticker-display--coinbase ticker-display--hold">
        <p className="ticker-display__symbol">{market.coinbaseLabel} · reserved lane</p>
        <p className="ticker-display__price">HOLD</p>
        <p className="ticker-display__change">Awaiting Titan partnership</p>
      </div>
    );
  }

  return (
    <div className="ticker-display ticker-display--coinbase">
      <p className="ticker-display__symbol">{market.coinbaseLabel} · Coinbase</p>
      <p className="ticker-display__price">
        {quote ? formatTickerPrice(market.coinbaseLabel, quote.priceUsd) : "— — —"}
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
