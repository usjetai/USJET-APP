import { Link } from "react-router-dom";
import { LogOut, ShieldCheck, Wrench } from "lucide-react";
import { useState, type FormEvent } from "react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import MemberPrimeBadge from "../components/member/MemberPrimeBadge";
import { useMemberAuth } from "../context/MemberAuthContext";

export default function MemberPortal() {
  const { session, loading, login, logout, error } = useMemberAuth();
  const [memberId, setMemberId] = useState(session?.customerId ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await login(memberId, email || undefined);
    setSubmitting(false);
  };

  return (
    <div className="member-portal page-atmosphere mx-auto max-w-3xl px-6 pb-28 pt-40 sm:px-8">
      <header className="member-portal__header">
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
      </header>

      <div className="member-portal__grid">
        <MemberPrimeBadge session={session} />

        <GlassEffectContainer className="member-portal__card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="member-portal__card-inner">
            <p className="member-portal__card-kicker">Authentication</p>
            <h2 className="member-portal__card-title">Verify Member ID</h2>

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
                {submitting || loading ? "Verifying subscription…" : "Activate access"}
              </button>
            </form>

            {session?.active ? (
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
          Founder Special — $19.95/mo
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
