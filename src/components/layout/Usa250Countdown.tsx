import { useEffect, useState } from "react";
import { getDaysUntilUsa250 } from "../../lib/usa250Countdown";

/** Microscopic mission clock for USA 250 (July 4, 2026). */
export default function Usa250Countdown() {
  const [days, setDays] = useState(() => getDaysUntilUsa250());

  useEffect(() => {
    const refresh = () => setDays(getDaysUntilUsa250());
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      className="whitespace-nowrap font-mono text-[7px] font-semibold uppercase leading-tight tracking-[0.28em] text-cyan-300/55 sm:text-[8px] sm:tracking-[0.32em]"
      aria-live="polite"
    >
      T-MINUS <span className="tabular-nums text-cyan-100/85">{days}</span> DAYS TO USA 250
    </p>
  );
}
