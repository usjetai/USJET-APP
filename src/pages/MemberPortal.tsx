import { Link } from "react-router-dom";
import { LogOut, ShieldCheck, Wrench } from "lucide-react";
import { useState, type FormEvent } from "react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import MemberFleetControlBoard from "../components/member/MemberFleetControlBoard";
import MemberFleetUsageChart from "../components/member/MemberFleetUsageChart";
import MemberPrimeBadge from "../components/member/MemberPrimeBadge";
import MemberProjectTracker from "../components/member/MemberProjectTracker";
import MemberVitalsPanel from "../components/member/MemberVitalsPanel";
import { useMemberAuth } from "../context/MemberAuthContext";

export default function MemberPortal() {
  const { session, loading, login, logout, error } = useMemberAuth();
  const [memberId, setMemberId] = useState(session?.customerId ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const active = Boolean(session?.active);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await login(memberId, email || undefined);
    setSubmitting(false);
  };

  return (
    <div
      className={[
        "member-portal page-atmosphere page-nav-offset mx-auto px-6 pb-28 sm:px-8",
        active ? "member-portal--active max-w-6xl" : "max-w-3xl",
      ].join(" ")}
    >
      <header className="member-portal__header">
        <motionKickerRow />
        <h1 className="member-portal__title">
          Member <span className="member-portal__title-accent">Portal</span>
        </h1>
        <p className="member-portal__subtitle">
          Secure founder access — Stripe Member ID linked to active USJET subscription.
        </p>
      </header>

      {active && session ? (
        <section className="member-portal__dashboard" aria-label="Member control board">
          <MemberVitalsPanel session={session} />
          <MemberProjectTracker customerId={session.customerId} />
          <MemberFleetControlBoard />
          <MemberFleetUsageChart />
        </section>
      ) : null}

      <div className="member-portal__grid">
        <MemberPrimeBadge session={session} />

        <GlassEffectContainer className="member-portal__card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="member-portal__card-inner">
            <p className="member-portal__card-kicker">Authentication</p>
            <h2 className="member-portal__card-title">
              {active ? "Active clearance" : "Verify Member ID"}
            </h2>

            <form className="member-portal__form" onSubmit={handleSubmit}>
              <label className="member-portal__field">
                <span>Stripe Customer ID</span>
                <input
                  className="member-portal__input"
                  type="text"
                  name="memberId"
                  placeholder="cus_..."
                  value={memberId}
                  onChange={(event) => setMemberId(event.target.value)}
                  spellCheck={false}
                />
              </label>
              <label className="member-portal__field">
                <span>Billing email</span>
                <input
                  className="member-portal__input"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              {error ? <p className="member-portal__error">{error}</p> : null}

              <button type="submit" className="member-portal__submit" disabled={submitting || loading}>
                <ShieldCheck size={16} aria-hidden />
                {submitting || loading ? "Verifying subscription…" : active ? "Refresh clearance" : "Activate access"}
              </button>
            </form>

            {active ? (
              <button type="button" className="member-portal__logout" onClick={logout}>
                <LogOut size={14} aria-hidden />
                Sign out
              </button>
            ) : null}
          </div>
        </GlassEffectContainer>
      </div>

      <p className="member-portal__footer">
        Need a seat?{" "}
        <Link to="/special" className="member-portal__link">
          Founder Special — $19.90/mo
        </Link>
        {" · "}
        <Link to="/hangar" className="member-portal__link">
          Hangar
        </Link>
        {" · "}
        <Link to="/intel" className="member-portal__link">
          Intel
        </Link>
      </p>
    </div>
  );
}

function motionKickerRow() {
  return (
    <div className="member-portal__kicker-row">
      <Wrench size={14} aria-hidden />
      <p className="member-portal__kicker">Wrenches, Not Slides</p>
    </div>
  );
}
