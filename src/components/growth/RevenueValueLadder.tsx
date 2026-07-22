import { Link, useLocation } from "react-router-dom";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { CODE_KIT_PRICE_DISPLAY, CODE_KIT_ROUTE } from "../../data/codeKit499";
import { FLEET_MANUAL_PRICE_DISPLAY, FLEET_MANUAL_ROUTE } from "../../data/fleetManual2500";
import { FOUNDERS_FUEL_PRICE_DISPLAY } from "../../data/foundersFuel";

type LadderTier = "fuel" | "code" | "manual";

type RevenueValueLadderProps = {
  active?: LadderTier;
};

const TIERS = [
  {
    id: "fuel" as const,
    price: FOUNDERS_FUEL_PRICE_DISPLAY,
    verb: "Support the mission",
    to: "/founders-fuel",
  },
  {
    id: "code" as const,
    price: CODE_KIT_PRICE_DISPLAY,
    verb: "Build the mission",
    to: CODE_KIT_ROUTE,
  },
  {
    id: "manual" as const,
    price: FLEET_MANUAL_PRICE_DISPLAY,
    verb: "Run the mission",
    to: FLEET_MANUAL_ROUTE,
  },
] as const;

export default function RevenueValueLadder({ active }: RevenueValueLadderProps) {
  const location = useLocation();
  const resolvedActive =
    active ??
    (location.pathname === "/founders-fuel"
      ? "fuel"
      : location.pathname === CODE_KIT_ROUTE
        ? "code"
        : location.pathname === FLEET_MANUAL_ROUTE
          ? "manual"
          : undefined);

  return (
    <GlassEffectContainer className="revenue-ladder glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="revenue-ladder__inner">
        <p className="revenue-ladder__eyebrow">Value ladder · high performance only</p>
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
