import { useMemo } from "react";
import { getIntelSlotMarket } from "../../data/intelCoinbaseAssets";
import { useIntelLiveMarketOptional } from "../../context/IntelLiveMarketContext";
import type { OhlcCandle } from "../../lib/intelCandles";
import MarketCandlesticks from "./MarketCandlesticks";

type CoinbaseLiveCandlesProps = {
  slot: number;
  candleCount?: number;
  className?: string;
};

function candleGeometry(candles: OhlcCandle[], width: number, height: number) {
  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const span = max - min || 1;
  const padY = 4;
  const plotH = height - padY * 2;
  const slotW = width / candles.length;
  const bodyW = Math.max(1.8, slotW * 0.52);

  return candles.map((candle, index) => {
    const xCenter = slotW * index + slotW / 2;
    const y = (value: number) => padY + plotH * (1 - (value - min) / span);
    const bullish = candle.close >= candle.open;
    const bodyTop = y(Math.max(candle.open, candle.close));
    const bodyBottom = y(Math.min(candle.open, candle.close));
    const bodyHeight = Math.max(0.8, bodyBottom - bodyTop);

    return {
      bullish,
      wickX: xCenter,
      wickY1: y(candle.high),
      wickY2: y(candle.low),
      bodyX: xCenter - bodyW / 2,
      bodyY: bodyTop,
      bodyW,
      bodyH: bodyHeight,
    };
  });
}

export default function CoinbaseLiveCandles({ slot, candleCount = 8, className = "" }: CoinbaseLiveCandlesProps) {
  const market = getIntelSlotMarket(slot);
  const live = useIntelLiveMarketOptional();
  const candles = live?.candles[market.coinbaseProductId]?.slice(-candleCount);

  const layout = useMemo(() => {
    if (!candles || candles.length < 2) {
      return null;
    }
    return candleGeometry(candles, 100, 44);
  }, [candles]);

  if (!layout) {
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

  return (
    <svg
      className={["intel-candles intel-candles--live", className].filter(Boolean).join(" ")}
      viewBox="0 0 100 44"
      preserveAspectRatio="none"
      aria-hidden
    >
      {layout.map((bar, index) => (
        <g key={index} className={bar.bullish ? "intel-candles__bar--bull" : "intel-candles__bar--bear"}>
          <line className="intel-candles__wick" x1={bar.wickX} x2={bar.wickX} y1={bar.wickY1} y2={bar.wickY2} />
          <rect
            className="intel-candles__body"
            x={bar.bodyX}
            y={bar.bodyY}
            width={bar.bodyW}
            height={bar.bodyH}
            rx={0.35}
          />
        </g>
      ))}
    </svg>
  );
}
