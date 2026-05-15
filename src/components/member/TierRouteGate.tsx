import { Navigate, Link, useLocation } from "react-router-dom";
import { CreditCard, Lock, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { MEMBER_DECK_PRICE_DISPLAY } from "../../data/memberDeckStripe";
import { isSitePreviewPromoActive } from "../../lib/sitePreviewPromo";
import { isUsableStripePaymentLink, resolveMemberDeckPaymentLink } from "../../lib/stripePaymentLink";
import {
  canMemberAccessRoute,
  isOriginCustomerServiceEntry,
  clearanceTierLabel,
  clearanceTierStripeId,
  normalizeRoutePath,
  routeMinClearanceRank,
  tierRouteGateCopy,
} from "../../lib/memberAccessLevel";

type TierRouteGateProps = {
  path: string;
  pageLabel: string;
  children: ReactNode;
};

export default function TierRouteGate({ path, pageLabel: _pageLabel, children }: TierRouteGateProps) {
  const { session, loading } = useMemberAuth();
  const location = useLocation();
  const customerServiceEntry =
    normalizeRoutePath(path) === "/origin" && isOriginCustomerServiceEntry(location.search);

  if (loading || customerServiceEntry || canMemberAccessRoute(path, session)) {
    return <>{children}</>;
  }

  if (!session?.active) {
    const isMemberRoute = normalizeRoutePath(path) === "/member";
    const memberDeckLink = resolveMemberDeckPaymentLink();
    const memberDeckReady = isUsableStripePaymentLink(memberDeckLink);
    const { title, body } = tierRouteGateCopy(path, routeMinClearanceRank(path));

    if (isMemberRoute) {
      return (
        <div className="tier-route-gate">
          <div className="tier-route-gate__preview" aria-hidden>
            {children}
          </div>
          <div className="tier-route-gate__veil" aria-hidden />
          <GlassEffectContainer className="tier-route-gate__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
            <div className="tier-route-gate__inner">
              <div className="tier-route-gate__icon-wrap">
                <Lock size={28} className="tier-route-gate__icon" aria-hidden />
              </div>
              <p className="tier-route-gate__kicker">Member Deck required</p>
              <h2 className="tier-route-gate__title">{title}</h2>
              <p className="tier-route-gate__copy">{body}</p>
              {memberDeckReady ? (
                <a
                  href={memberDeckLink}
                  className="tier-route-gate__cta btn-glass-prominent glass-effect-interactive"
                >
                  <CreditCard size={16} aria-hidden />
                  Member Deck — {MEMBER_DECK_PRICE_DISPLAY}/mo
                </a>
              ) : (
                <p className="tier-route-gate__copy tier-route-gate__copy--muted">
                  Paste your $5 Stripe Payment Link into <code>VITE_STRIPE_MEMBER_DECK_PAYMENT_LINK</code>, then
                  redeploy.
                </p>
              )}
              <p className="tier-route-gate__footer">
                {isSitePreviewPromoActive() ? "Hangar, Intel, and Origin stay open until July 4, 2026. " : null}
                <Link to="/member/login" className="tier-route-gate__link">
                  Log in after checkout
                </Link>
              </p>
            </div>
          </GlassEffectContainer>
        </div>
      );
    }

    return <Navigate to="/member/login" replace state={{ blockedRoute: path }} />;
  }

  const minRank = routeMinClearanceRank(path);
  const tierLabel = clearanceTierLabel(minRank);
  const { title, body } = tierRouteGateCopy(path, minRank);
  const upgradeTier = clearanceTierStripeId(minRank);

  return (
    <div className="tier-route-gate">
      <div className="tier-route-gate__preview" aria-hidden>
        {children}
      </div>

      <div className="tier-route-gate__veil" aria-hidden />

      <GlassEffectContainer className="tier-route-gate__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="tier-route-gate__inner">
          <div className="tier-route-gate__icon-wrap">
            <Lock size={28} className="tier-route-gate__icon" aria-hidden />
          </div>
          <p className="tier-route-gate__kicker">Clearance required</p>
          <h2 className="tier-route-gate__title">{title}</h2>
          <p className="tier-route-gate__copy">{body}</p>

          <Link
            to={`/special?tier=${upgradeTier}`}
            className="tier-route-gate__cta btn-glass-prominent glass-effect-interactive"
          >
            <ShieldAlert size={16} aria-hidden />
            Upgrade to {tierLabel}
          </Link>

          <p className="tier-route-gate__footer">
            Fleet and Founder stay public for guests.{" "}
            <Link to="/member/login" className="tier-route-gate__link">
              Member login
            </Link>
          </p>
        </div>
      </GlassEffectContainer>
    </div>
  );
}
