import { useEffect, useRef, useState } from "react";
import { getIntelSlotMarket } from "../../data/intelCoinbaseAssets";
import { useIntelLiveMarketOptional } from "../../context/IntelLiveMarketContext";
import { formatTickerChange, formatTickerPrice } from "../../lib/intelWings";

type CoinbaseLiveTickerProps = {
  slot: number;
};

type TickFlash = "up" | "down" | null;

export default function CoinbaseLiveTicker({ slot }: CoinbaseLiveTickerProps) {
  const market = getIntelSlotMarket(slot);
  const live = useIntelLiveMarketOptional();
  const quote = live?.quotes[market.coinbaseProductId];
  const simulated = Boolean(live?.simulated || live?.holdLine);
  const changePct = quote?.changePct24h ?? 0;
  const [flash, setFlash] = useState<TickFlash>(null);
  const prevPriceRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!quote) {
      return;
    }
    const prev = prevPriceRef.current;
    prevPriceRef.current = quote.priceUsd;
    if (prev === null || prev === quote.priceUsd) {
      return;
    }
    setFlash(quote.priceUsd >= prev ? "up" : "down");
    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current);
    }
    flashTimerRef.current = window.setTimeout(() => setFlash(null), 420);
    return () => {
      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current);
      }
    };
  }, [quote?.priceUsd]);

  if (!quote) {
    return (
      <div className="ticker-display ticker-display--coinbase ticker-display--hold">
        <p className="ticker-display__symbol">{market.coinbaseLabel} · reserved lane</p>
        <p className="ticker-display__price">— — —</p>
        <p className="ticker-display__change">Pulse spinning up</p>
      </div>
    );
  }

  return (
    <div className="ticker-display ticker-display--coinbase">
      <p className="ticker-display__symbol">
        {market.coinbaseLabel} · {simulated ? "Simulated pulse" : "Coinbase"}
      </p>
      <p
        className={[
          "ticker-display__price",
          flash === "up" ? "ticker-display--up" : "",
          flash === "down" ? "ticker-display--down" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {formatTickerPrice(market.coinbaseLabel, quote.priceUsd)}
      </p>
      <p
        className={[
          "ticker-display__change",
          changePct >= 0 ? "ticker-display__change--positive" : "ticker-display__change--negative",
          flash === "up" ? "ticker-display--up" : "",
          flash === "down" ? "ticker-display--down" : "",
        ].join(" ")}
      >
        {formatTickerChange(changePct)}
      </p>
    </div>
  );
}
