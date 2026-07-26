import { getIntelSlotMarket } from "../../data/intelCoinbaseAssets";
import { useIntelLiveMarketOptional } from "../../context/IntelLiveMarketContext";
import IntelCandleChart from "./IntelCandleChart";
import MarketCandlesticks from "./MarketCandlesticks";

type CoinbaseLiveCandlesProps = {
  slot: number;
  candleCount?: number;
  className?: string;
};

export default function CoinbaseLiveCandles({ slot, candleCount = 8, className = "" }: CoinbaseLiveCandlesProps) {
  const market = getIntelSlotMarket(slot);
  const live = useIntelLiveMarketOptional();
  const candles = live?.candles[market.coinbaseProductId]?.slice(-candleCount);

  if (!candles || candles.length < 2) {
    const fallbackBase = live?.quotes[market.coinbaseProductId]?.priceUsd ?? 100;
    return (
      <MarketCandlesticks
        seed={slot}
        basePrice={fallbackBase}
        volatility={Math.max(fallbackBase * 0.004, 1)}
        candleCount={candleCount}
        className={className}
      />
    );
  }

  return <IntelCandleChart candles={candles} live className={className} />;
}
