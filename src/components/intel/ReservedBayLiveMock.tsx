import { useEffect, useMemo, useState } from "react";

type ReservedBayLiveMockProps = {
  variant: "market" | "crypto";
};

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  }).format(n);
}

/** Authorized-founder mock telemetry — pulses like live feed until partner API lands. */
export default function ReservedBayLiveMock({ variant }: ReservedBayLiveMockProps) {
  const base = variant === "crypto" ? 68420 : 4218.5;
  const [tick, setTick] = useState(0);
  const [price, setPrice] = useState(base);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
      setPrice((p) => {
        const drift = (Math.sin(Date.now() / 2400) + (Math.random() - 0.5) * 0.4) * (variant === "crypto" ? 180 : 12);
        return Math.max(base * 0.98, base + drift);
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, [base, variant]);

  const change = useMemo(() => ((price - base) / base) * 100, [base, price]);
  const spark = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 24; i += 1) {
      const v = Math.sin((i + tick) * 0.55) * 8 + Math.cos(i * 0.3 + tick * 0.2) * 4;
      pts.push(20 - v);
    }
    return pts.map((y, i) => `${(i / 23) * 100},${y}`).join(" ");
  }, [tick]);

  return (
    <div className="intel-reserved-live" aria-live="polite">
      <p className="intel-reserved-live__symbol">{variant === "crypto" ? "BTC / USD" : "NYA · INSTITUTIONAL"}</p>
      <p className="intel-reserved-live__price">{formatUsd(price)}</p>
      <p className={["intel-reserved-live__change", change >= 0 ? "intel-reserved-live__change--up" : "intel-reserved-live__change--down"].join(" ")}>
        {change >= 0 ? "+" : ""}
        {change.toFixed(2)}% mock
      </p>
      <svg className="intel-reserved-live__spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
        <polyline className="intel-reserved-live__spark-line" points={spark} />
      </svg>
    </div>
  );
}
