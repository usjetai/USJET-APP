import { Link } from "react-router-dom";
import { Lock, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import {
  canMemberAccessRoute,
  clearanceTierLabel,
  clearanceTierPrice,
  routeMinClearanceRank,
} from "../../lib/memberAccessLevel";

type TierRouteGateProps = {
  path: string;
  pageLabel: string;
  children: ReactNode;
};

export default function TierRouteGate({ path, pageLabel, children }: TierRouteGateProps) {
  const { session, loading } = useMemberAuth();

  if (loading || canMemberAccessRoute(path, session)) {
    return <>{children}</>;
  }

  const minRank = routeMinClearanceRank(path);
  const tierLabel = clearanceTierLabel(minRank);
  const tierPrice = clearanceTierPrice(minRank);

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
          <h2 className="tier-route-gate__title">{pageLabel} is locked at your tier</h2>
          <p className="tier-route-gate__copy">
            {tierLabel} ({tierPrice}) unlocks this route. Upgrade clearance to enter the sovereign cockpit — no
            external leaks, one ship.
          </p>

          <Link to="/special" className="tier-route-gate__cta btn-glass-prominent glass-effect-interactive">
            <ShieldAlert size={16} aria-hidden />
            Upgrade to {tierLabel}
          </Link>

          <p className="tier-route-gate__footer">
            Fleet and Hangar remain open.{" "}
            <Link to="/member" className="tier-route-gate__link">
              Member Portal
            </Link>
          </p>
        </div>
      </GlassEffectContainer>
    </div>
  );
}
