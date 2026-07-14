import { Link, Navigate } from "react-router-dom";
import { LogOut, Wrench } from "lucide-react";
import MemberFleetControlBoard from "../components/member/MemberFleetControlBoard";
import MemberPortalDataBoard from "../components/member/MemberPortalDataBoard";
import MemberPrimeBadge from "../components/member/MemberPrimeBadge";
import MemberProjectTracker from "../components/member/MemberProjectTracker";
import MemberShippingAddressForm from "../components/member/MemberShippingAddressForm";
import MemberVitalsPanel from "../components/member/MemberVitalsPanel";
import { useMemberAuth } from "../context/MemberAuthContext";

export default function MemberPortal() {
  const { session, loading, logout } = useMemberAuth();

  if (loading) {
    return (
      <div className="member-portal member-portal--boot page-atmosphere page-nav-offset mx-auto max-w-6xl px-6 pb-28 sm:px-8">
        <p className="member-portal__loading" role="status" aria-live="polite">
          Verifying Member clearance…
        </p>
      </div>
    );
  }

  if (!session?.active) {
    return <Navigate to="/member/login" replace state={{ blockedRoute: "/member" }} />;
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
            <p className="member-portal__subtitle">Clearance confirmed — Stripe Member ID linked to your active subscription.</p>
          </div>
          <button type="button" className="member-portal__header-logout btn-glass glass-effect-interactive" onClick={logout}>
            <LogOut size={14} aria-hidden />
            Sign out
          </button>
        </div>
      </header>

      <div className="member-portal__dashboard" aria-label="Member control board">
        <section className="member-portal__section member-portal__section--identity" aria-label="Membership clearance">
          <div className="member-portal__identity-row">
            <MemberVitalsPanel session={session} />
            <MemberPrimeBadge session={session} compact />
          </div>
        </section>

        <section className="member-portal__section member-portal__section--primary" aria-labelledby="member-portal-projects-label">
          <p id="member-portal-projects-label" className="member-portal__section-label">
            Mission Projects
          </p>
          <MemberProjectTracker customerId={session.customerId} />
        </section>

        <section className="member-portal__section member-portal__section--secondary" aria-label="Usage and shipping">
          <div className="member-portal__secondary">
            <MemberPortalDataBoard customerId={session.customerId} session={session} />
            <MemberShippingAddressForm customerId={session.customerId} />
          </div>
        </section>

        <section className="member-portal__section member-portal__section--fleet" aria-labelledby="member-portal-fleet-label">
          <p id="member-portal-fleet-label" className="member-portal__section-label">
            Fleet launch
          </p>
          <MemberFleetControlBoard />
        </section>
      </div>

      <p className="member-portal__footer">
        <Link to="/hangar" className="member-portal__link">
          Hangar
        </Link>
        {" · "}
        <Link to="/special" className="member-portal__link">
          Upgrade tiers
        </Link>
      </p>
    </div>
  );
}
