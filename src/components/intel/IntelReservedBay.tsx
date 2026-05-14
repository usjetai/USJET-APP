import type { CSSProperties } from "react";
import EkgPulseLine from "./EkgPulseLine";
import { type FleetUnit, HANGAR_COLUMNS } from "../../types/fleet";

export type IntelReservedVariant = "market" | "crypto";

type IntelReservedBayProps = {
  variant: IntelReservedVariant;
  unit: FleetUnit;
  index: number;
  style?: CSSProperties;
};

/**
 * Intel grid Slot 01 (market) and Slot 02 (crypto) — partnership bays.
 * Protect Ameer Karim's vision: reserved seats, not dead cells.
 */
export default function IntelReservedBay({ variant, unit, index, style }: IntelReservedBayProps) {
  const isMarket = variant === "market";

  return (
    <article
      className={[
        "intel-monitor",
        "intel-reserved-bay",
        "intel-reserved-bay--hot",
        "glass-effect",
        "liquid-glass-background",
        isMarket
          ? "intel-reserved-bay--market intel-reserved-bay--hot glass-tint-cyan"
          : "intel-reserved-bay--crypto glass-tint-gold",
      ].join(" ")}
      style={{
        animationDelay: `${(index % HANGAR_COLUMNS) * 0.08}s`,
        ...style,
      }}
      aria-label={
        isMarket
          ? "Slot 01 — Institutional market feed reserved"
          : "Slot 02 — Premium crypto exchange partnership reserved"
      }
    >
      <header className="intel-monitor__header">
        <p className="intel-monitor__callsign">{unit.callsign}</p>
        <span className="intel-monitor__status intel-monitor__status--staging">
          {isMarket ? "slot 01" : "slot 02"}
        </span>
      </header>

      <div className="intel-monitor__screen intel-reserved-bay__screen">
        <div className="intel-monitor__pulse-back intel-reserved-bay__ekg" aria-hidden>
          <EkgPulseLine variant="monitor" seed={unit.slot + (isMarket ? 0 : 17)} />
        </div>
        <div className="intel-monitor__grid" aria-hidden />
        <div className="intel-monitor__scan intel-reserved-bay__scan" aria-hidden />

        {isMarket ? (
          <div className="intel-reserved-bay__overlay intel-reserved-bay__overlay--market liquid-glass-background glass-effect">
            <p className="intel-reserved-bay__market-label">INSTITUTIONAL FEED: STATUS PENDING</p>
          </div>
        ) : (
          <div className="intel-reserved-bay__overlay intel-reserved-bay__overlay--crypto">
            <h2 className="intel-reserved-bay__titans">RESERVED FOR TITANS</h2>
            <p className="intel-reserved-bay__hook">
              PREMIUM EXCHANGE PARTNERSHIP ENQUIRIES:{" "}
              <a className="intel-reserved-bay__email" href="mailto:ops@usjet.ai">
                OPS@USJET.AI
              </a>
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
