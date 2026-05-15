import { Link, useLocation } from "react-router-dom";
import { CreditCard, Lock, ShieldAlert } from "lucide-react";
import { useId, type ReactNode } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import {
  canMemberAccessRoute,
  clearanceTierLabel,
  clearanceTierPrice,
  clearanceTierStripeId,
  isOriginCustomerServiceEntry,
  normalizeRoutePath,
  routeMinClearanceRank,
  tierRouteGateCopy,
} from "../../lib/memberAccessLevel";
import { stripeCheckoutCockpitPath } from "../../lib/stripeCockpitHandoff";
import type { StripeTierPaymentId } from "../../lib/stripePaymentLink";

type TierRouteGateProps = {
  path: string;
  pageLabel: string;
  children: ReactNode;
};

const TIER_CHECKOUT: { id: StripeTierPaymentId; label: string; price: string; glow: string }[] = [
  {
    id: "founder",
    label: "Flight Pass",
    price: "$19.90/mo",
    glow: "tier-route-gate__checkout tier-route-gate__checkout--flight-pass",
  },
  {
    id: "hangar-pro",
    label: "Hangar Pro",
    price: "$49.95/mo",
    glow: "tier-route-gate__checkout tier-route-gate__checkout--hangar-pro",
  },
  {
    id: "fleet-command",
    label: "Enterprise Commander",
    price: "$199.99/mo",
    glow: "tier-route-gate__checkout tier-route-gate__checkout--enterprise",
  },
];

function requiredTierPanelGlowClass(minRank: number): string {
  if (minRank >= 3) {
    return "tier-route-gate__panel-glow tier-route-gate__panel-glow--enterprise";
  }
  if (minRank >= 2) {
    return "tier-route-gate__panel-glow tier-route-gate__panel-glow--hangar-pro";
  }
  return "tier-route-gate__panel-glow tier-route-gate__panel-glow--flight-pass";
}

export default function TierRouteGate({ path, pageLabel: _pageLabel, children }: TierRouteGateProps) {
  const guestCheckoutHintId = useId();
  const { session, loading } = useMemberAuth();
  const location = useLocation();
  const customerServiceEntry =
    normalizeRoutePath(path) === "/origin" && isOriginCustomerServiceEntry(location.search);

  if (loading || customerServiceEntry || canMemberAccessRoute(path, session)) {
    return <>{children}</>;
  }

  const minRank = routeMinClearanceRank(path);
  const isGuest = !session?.active;
  const tierLabel = clearanceTierLabel(minRank);
  const { title, body } = tierRouteGateCopy(path, minRank);
  const upgradeTier = clearanceTierStripeId(minRank);
  const upgradeHref = stripeCheckoutCockpitPath(path, upgradeTier);
  const panelGlowClass = requiredTierPanelGlowClass(minRank);

  return (
    <div className={isGuest ? "tier-route-gate tier-route-gate--guest-checkout" : "tier-route-gate"}>
      <div className="tier-route-gate__preview" aria-hidden>
        {children}
      </div>

      <div className="tier-route-gate__veil" aria-hidden />

      <GlassEffectContainer
        className={`tier-route-gate__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan ${panelGlowClass}`}
      >
          <div className="tier-route-gate__inner">
            <div className="tier-route-gate__icon-wrap">
              <Lock size={28} className="tier-route-gate__icon" aria-hidden />
            </div>
            <p className="tier-route-gate__kicker">Clearance required</p>
            <h2 className="tier-route-gate__title">{title}</h2>
            <p className="tier-route-gate__copy">{body}</p>

            {isGuest ? (
              <>
                <p className="tier-route-gate__guest-hint" id={guestCheckoutHintId}>
                  Three clearance rungs are illuminated below. Each opens Stripe checkout inside the sovereign cockpit
                  (same window, return bar) — no external tab handoff.
                </p>
                <div className="tier-route-gate__checkout-grid" role="group" aria-labelledby={guestCheckoutHintId}>
                  {TIER_CHECKOUT.map((tier) => (
                    <Link
                      key={tier.id}
                      to={stripeCheckoutCockpitPath(path, tier.id)}
                      className={tier.glow}
                    >
                      <span className="tier-route-gate__checkout-kicker">Locked destination · glowing runway</span>
                      <span className="tier-route-gate__checkout-label">{tier.label}</span>
                      <span className="tier-route-gate__checkout-price">{tier.price}</span>
                      <span className="tier-route-gate__checkout-cta">
                        <CreditCard size={14} aria-hidden />
                        Open checkout
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link
                to={upgradeHref}
                className="tier-route-gate__cta tier-route-gate__cta--single btn-glass-prominent glass-effect-interactive"
              >
                <ShieldAlert size={16} aria-hidden />
                Upgrade to {tierLabel} ({clearanceTierPrice(minRank)})
              </Link>
            )}

            <p className="tier-route-gate__footer">
              {isGuest ? (
                <>
                  Already cleared?{" "}
                  <Link to="/member/login" className="tier-route-gate__link">
                    Member login
                  </Link>
                </>
              ) : (
                <>
                  Wrong workspace?{" "}
                  <Link to="/member/login" className="tier-route-gate__link">
                    Member login
                  </Link>
                </>
              )}
            </p>
          </div>
      </GlassEffectContainer>
    </div>
  );
}
