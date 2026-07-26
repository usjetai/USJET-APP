import { useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import IntelMonitorIdentity from "./IntelMonitorIdentity";
import IntelScanLine from "./IntelScanLine";
import ReservedBayLiveMock from "./ReservedBayLiveMock";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { usePartnershipBayAnalytics } from "../../hooks/usePartnershipBayAnalytics";
import { USJET_OPS_EMAIL } from "../../lib/usjetContact";
import { type FleetUnit } from "../../types/fleet";

export type IntelReservedVariant = "market" | "crypto";

const TITANS_PITCH =
  "This bay is reserved for a premier Financial/Crypto partner. 30 AI units. 1 Unified Cockpit. Your data here.";

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
export default function IntelReservedBay({ variant, unit, index: _index, style }: IntelReservedBayProps) {
  const isMarket = variant === "market";
  const bayId = isMarket ? "slot-01-market" : "slot-02-titans";
  const label = isMarket ? "INSTITUTIONAL FEED: STATUS PENDING" : "RESERVED FOR TITANS";
  const { onMouseEnter, onClick } = usePartnershipBayAnalytics({ bayId, label });
  const { session } = useMemberAuth();
  const authorized = Boolean(session?.active);
  const [pitchOpen, setPitchOpen] = useState(false);

  const engineMotion = useMemo(
    () =>
      ({
        "--intel-bay-engine-period": `${1.05 + Math.random() * 1.42}s`,
        "--intel-bay-engine-delay": `-${Math.random() * 2.25}s`,
      }) as CSSProperties,
    [],
  );

  const stopBubble = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <article
      className={[
        "intel-monitor",
        "intel-monitor--bay-accent",
        "intel-reserved-bay",
        "intel-reserved-bay--hot",
        "glass-effect",
        "liquid-glass-background",
        isMarket
          ? "intel-reserved-bay--market intel-reserved-bay--hot glass-tint-cyan"
          : "intel-reserved-bay--crypto glass-tint-gold",
        authorized ? "intel-reserved-bay--live" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        animationDelay: `${Math.random() * 1.7}s`,
        ...engineMotion,
        ...fleetBayAccentStyle(unit.slot),
        ...style,
      }}
      aria-label={
        isMarket
          ? "Slot 01 — Institutional market feed reserved"
          : "Slot 02 — Premium crypto exchange partnership reserved"
      }
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <header className="intel-monitor__header">
        <IntelMonitorIdentity unit={unit} />
        <span className="intel-monitor__status intel-monitor__status--staging">
          {isMarket ? "slot 01" : "slot 02"}
        </span>
      </header>

      <div className="intel-monitor__screen intel-reserved-bay__screen">
        <div className="intel-monitor__grid" aria-hidden />
        <IntelScanLine className="intel-reserved-bay__scan" />

        {authorized ? <ReservedBayLiveMock variant={variant} /> : null}

        {isMarket ? (
          <div className="intel-reserved-bay__overlay intel-reserved-bay__overlay--market liquid-glass-background glass-effect">
            <p className="intel-reserved-bay__market-label">
              {authorized
                ? "INSTITUTIONAL FEED · FOUNDER ACCESS · LIVE MOCK"
                : "INSTITUTIONAL FEED · FOUNDER'S ACCESS · STATUS PENDING"}
            </p>
          </div>
        ) : (
          <div className="intel-reserved-bay__overlay intel-reserved-bay__overlay--crypto">
            <h2 className="intel-reserved-bay__titans">RESERVED FOR TITANS</h2>
            <p className="intel-reserved-bay__hook">
              PREMIUM EXCHANGE PARTNERSHIP ENQUIRIES:{" "}
              <a className="intel-reserved-bay__email" href={`mailto:${USJET_OPS_EMAIL}`} onClick={stopBubble}>
                {USJET_OPS_EMAIL.toUpperCase()}
              </a>
            </p>
            <button
              type="button"
              className="intel-reserved-bay__details"
              onClick={(event) => {
                stopBubble(event);
                setPitchOpen((open) => !open);
              }}
              aria-expanded={pitchOpen}
            >
              Details
            </button>
            {pitchOpen ? (
              <p className="intel-reserved-bay__pitch" onClick={stopBubble}>
                {TITANS_PITCH}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
