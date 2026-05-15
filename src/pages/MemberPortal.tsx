import { Link } from "react-router-dom";
import { LogOut, Wrench } from "lucide-react";
import MemberFleetControlBoard from "../components/member/MemberFleetControlBoard";
import MemberPortalDataBoard from "../components/member/MemberPortalDataBoard";
import MemberPrimeBadge from "../components/member/MemberPrimeBadge";
import MemberProjectTracker from "../components/member/MemberProjectTracker";
import MemberVitalsPanel from "../components/member/MemberVitalsPanel";
import { useMemberAuth } from "../context/MemberAuthContext";

export default function MemberPortal() {
  const { session, logout } = useMemberAuth();

  if (!session?.active) {
    return null;
  }

  return (
    <div className="member-portal member-portal--active page-atmosphere page-nav-offset mx-auto max-w-6xl px-6 pb-28 sm:px-8">
      <header className="member-portal__header">
        <div className="member-portal__header-row">
          <div>
            <div className="member-portal__kicker-row">
              <Wrench size={14} aria-hidden />
              <p className="member-portal__kicker">Wrenches, Not Slides</p>
            </div>
            <h1 className="member-portal__title">
              Member <span className="member-portal__title-accent">Portal</span>
            </h1>
            <p className="member-portal__subtitle">
              Secure founder access — Stripe Member ID linked to active USJET subscription.
            </p>
          </div>
          <button type="button" className="member-portal__header-logout btn-glass glass-effect-interactive" onClick={logout}>
            <LogOut size={14} aria-hidden />
            Sign out
          </button>
        </div>
      </header>

      <section className="member-portal__dashboard" aria-label="Member control board">
        <div className="member-portal__identity-row">
          <MemberVitalsPanel session={session} />
          <MemberPrimeBadge session={session} />
        </div>

        <MemberProjectTracker customerId={session.customerId} />

        <MemberFleetControlBoard />

        <MemberPortalDataBoard customerId={session.customerId} session={session} />
      </section>

      <p className="member-portal__footer">
        Need higher clearance?{" "}
        <Link to="/special" className="member-portal__link">
          Upgrade tiers
        </Link>
        {" · "}
        <Link to="/intelligence" className="member-portal__link">
          Intel ladder
        </Link>
        {" · "}
        <Link to="/b2b" className="member-portal__link">
          B2B
        </Link>
        {" · "}
        <Link to="/hangar" className="member-portal__link">
          Hangar
        </Link>
        {" · "}
        <Link to="/intel" className="member-portal__link">
          Intel grid
        </Link>
      </p>
    </div>
  );
}
