import { useEffect, useRef, useState } from "react";
import {
  formatTickerChange,
  formatTickerPrice,
  getWingForSlot,
  initialTickerPrice,
} from "../../lib/intelWings";

type TickerDisplayProps = {
  slot: number;
};

type TickFlash = "up" | "down" | null;

export default function TickerDisplay({ slot }: TickerDisplayProps) {
  const wing = getWingForSlot(slot);
  const [price, setPrice] = useState(() => initialTickerPrice(slot, wing));
  const [changePct, setChangePct] = useState(0);
  const [flash, setFlash] = useState<TickFlash>(null);
  const flashTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPrice((current) => {
        const drift = (Math.random() - 0.48) * wing.step;
        const next = Math.max(wing.basePrice * 0.82, current + drift);
        const direction: TickFlash = next >= current ? "up" : "down";

        setChangePct(((next - wing.basePrice) / wing.basePrice) * 100);
        setFlash(direction);

        if (flashTimerRef.current !== null) {
          window.clearTimeout(flashTimerRef.current);
        }

        flashTimerRef.current = window.setTimeout(() => {
          setFlash(null);
        }, 450);

        return next;
      });
    }, 2000);

    return () => {
      window.clearInterval(intervalId);

      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current);
      }
    };
  }, [wing.basePrice, wing.step]);

  return (
    <div className="ticker-display">
      <p className="ticker-display__symbol">{wing.symbol}</p>
      <p
        className={[
          "ticker-display__price",
          flash === "up" ? "ticker-display--up" : "",
          flash === "down" ? "ticker-display--down" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {formatTickerPrice(wing.symbol, price)}
      </p>
      <p
        className={[
          "ticker-display__change",
          changePct >= 0 ? "ticker-display__change--positive" : "ticker-display__change--negative",
          flash === "up" ? "ticker-display--up" : "",
          flash === "down" ? "ticker-display--down" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {formatTickerChange(changePct)}
      </p>
    </div>
  );
}
