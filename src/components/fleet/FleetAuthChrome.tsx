import { Link } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { memberClearanceRank } from "../../lib/memberAccessLevel";

export default function FleetAuthChrome() {
  const { session, loading, logout } = useMemberAuth();
  const rank = memberClearanceRank(session);

  if (loading) {
    return null;
  }

  if (!session?.active) {
    return (
      <GlassEffectContainer className="fleet-auth-chrome fleet-auth-chrome--guest glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan mx-auto mb-8 max-w-4xl px-4">
        <div className="fleet-auth-chrome__guest-strip">
          <p className="fleet-auth-chrome__guest-title">Stripe clearance required</p>
          <p className="fleet-auth-chrome__guest-lead">
            Pay through Stripe first, then log in with billing email and your founder-issued access sentence.
          </p>
          <Link to="/member/login" className="fleet-auth-chrome__login-link btn-glass glass-effect-interactive">
            Member login
          </Link>
        </div>
      </GlassEffectContainer>
    );
  }

  return (
    <GlassEffectContainer className="fleet-auth-chrome fleet-auth-chrome--active glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan mx-auto mb-8 max-w-4xl px-4">
      <div className="fleet-auth-chrome__active">
        <div className="fleet-auth-chrome__status">
          <ShieldCheck size={18} className="fleet-auth-chrome__status-icon" aria-hidden />
          <div>
            <p className="fleet-auth-chrome__status-kicker">You&apos;re in control</p>
            <p className="fleet-auth-chrome__status-title">
              {rank >= 3 ? "Enterprise Commander" : rank >= 2 ? "Hangar Pro" : rank >= 1 ? "Flight Pass" : "Member"}
            </p>
            {session.email ? <p className="fleet-auth-chrome__status-email">{session.email}</p> : null}
            <p className="fleet-auth-chrome__status-id">{session.customerId}</p>
          </div>
        </div>
        <div className="fleet-auth-chrome__active-actions">
          <Link to="/member" className="fleet-auth-chrome__portal-link btn-glass glass-effect-interactive">
            Member Portal
          </Link>
          <button type="button" className="fleet-auth-chrome__logout btn-glass glass-effect-interactive" onClick={logout}>
            <LogOut size={14} aria-hidden />
            Log out
          </button>
        </div>
      </div>
    </GlassEffectContainer>
  );
}
