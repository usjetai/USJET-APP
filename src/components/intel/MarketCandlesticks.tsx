import { useEffect, useState } from "react";
import { generateCandles, tickLastCandle, type OhlcCandle } from "../../lib/intelCandles";
import IntelCandleChart from "./IntelCandleChart";

type MarketCandlesticksProps = {
  seed: number;
  basePrice: number;
  volatility: number;
  candleCount?: number;
  className?: string;
};

export default function MarketCandlesticks({
  seed,
  basePrice,
  volatility,
  candleCount = 10,
  className = "",
}: MarketCandlesticksProps) {
  const [candles, setCandles] = useState<OhlcCandle[]>(() =>
    generateCandles(seed, candleCount, basePrice, volatility),
  );

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let timeoutId = 0;

    const nextDelayMs = () => (reducedMotion ? 2000 + Math.random() * 2200 : 760 + Math.random() * 1050);

    const schedule = (): void => {
      if (cancelled) return;
      timeoutId = window.setTimeout(() => {
        setCandles((current) => tickLastCandle(current, volatility));
        schedule();
      }, nextDelayMs());
    };

    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [volatility]);

  return <IntelCandleChart candles={candles} className={className} />;
}
