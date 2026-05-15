import { useEffect, useState } from "react";
import { getDaysUntilUsa250 } from "../../lib/usa250Countdown";

/** Microscopic mission clock for USA 250 (July 4, 2026). */
type Usa250CountdownProps = {
  /** When set, day count gets footer strip blink / glow styles. */
  variant?: "default" | "footerStrip";
};

export default function Usa250Countdown({ variant = "default" }: Usa250CountdownProps) {
  const [days, setDays] = useState(() => getDaysUntilUsa250());

  useEffect(() => {
    const refresh = () => setDays(getDaysUntilUsa250());
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const rootClass =
    variant === "footerStrip"
      ? "usjet-global-contact-bar__usa250 whitespace-nowrap font-mono text-[7px] font-semibold uppercase leading-tight tracking-[0.22em] text-cyan-300/70 sm:text-[8px] sm:tracking-[0.26em]"
      : "whitespace-nowrap font-mono text-[7px] font-semibold uppercase leading-tight tracking-[0.28em] text-cyan-300/55 sm:text-[8px] sm:tracking-[0.32em]";

  const daysClass = variant === "footerStrip" ? "usjet-global-contact-bar__usa250-days tabular-nums" : "tabular-nums text-cyan-100/85";

  return (
    <p className={rootClass} aria-live="polite">
      T-MINUS <span className={daysClass}>{days}</span> DAYS TO USA 250
    </p>
  );
}
