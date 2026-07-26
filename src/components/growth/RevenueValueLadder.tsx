import { Link, useLocation } from "react-router-dom";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  FLEET_COMMANDER_STRIPE,
  FLIGHT_PASS_STRIPE,
  HANGAR_PRO_STRIPE,
} from "../../data/stripeProducts";

type LadderTier = "founder" | "hangar-pro" | "fleet-command";

type RevenueValueLadderProps = {
  active?: LadderTier;
};

const TIERS = [
  {
    id: "founder" as const,
    price: FLIGHT_PASS_STRIPE.priceDisplay + FLIGHT_PASS_STRIPE.period,
    verb: "Flight Pass",
    to: "/special?tier=founder",
  },
  {
    id: "hangar-pro" as const,
    price: HANGAR_PRO_STRIPE.priceDisplay + HANGAR_PRO_STRIPE.period,
    verb: "Hangar Pro",
    to: "/special?tier=hangar-pro",
  },
  {
    id: "fleet-command" as const,
    price: FLEET_COMMANDER_STRIPE.priceDisplay + FLEET_COMMANDER_STRIPE.period,
    verb: "Enterprise",
    to: "/special?tier=fleet-command",
  },
] as const;

export default function RevenueValueLadder({ active }: RevenueValueLadderProps) {
  const location = useLocation();
  const tierParam = new URLSearchParams(location.search).get("tier");
  const resolvedActive =
    active ??
    (tierParam === "founder" || tierParam === "hangar-pro" || tierParam === "fleet-command"
      ? tierParam
      : location.pathname === "/special"
        ? "hangar-pro"
        : undefined);

  return (
    <GlassEffectContainer className="revenue-ladder glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="revenue-ladder__inner">
        <p className="revenue-ladder__eyebrow">Clearance ladder · three prices</p>
        <ol className="revenue-ladder__list">
          {TIERS.map((tier) => {
            const isActive = resolvedActive === tier.id;
            return (
              <li key={tier.id} className={isActive ? "revenue-ladder__item revenue-ladder__item--active" : "revenue-ladder__item"}>
                <Link to={tier.to} className="revenue-ladder__link glass-effect-interactive">
                  <span className="revenue-ladder__price">{tier.price}</span>
                  <span className="revenue-ladder__verb">{tier.verb}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </GlassEffectContainer>
  );
}
