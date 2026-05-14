import { Link } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";

type FoundersAccessGateProps = {
  pageLabel: string;
  children: React.ReactNode;
};

export default function FoundersAccessGate({ pageLabel, children }: FoundersAccessGateProps) {
  const { session, loading, login, error } = useMemberAuth();
  const [memberId, setMemberId] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session?.active) {
    return <>{children}</>;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await login(memberId, email || undefined);
    setSubmitting(false);
  };

  return (
    <div className="founders-access-gate">
      <div className="founders-access-gate__preview" aria-hidden>
        {children}
      </div>

      <div className="founders-access-gate__veil" aria-hidden />

      <GlassEffectContainer className="founders-access-panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="founders-access-panel__inner">
          <div className="founders-access-panel__icon-wrap">
            <Lock size={28} className="founders-access-panel__icon" aria-hidden />
          </div>
          <p className="founders-access-panel__kicker">Secure channel</p>
          <h2 className="founders-access-panel__title">Founders Access Required</h2>
          <p className="founders-access-panel__copy">
            {pageLabel} is restricted to active USJET members. Enter your Stripe Member ID to verify subscription
            status.
          </p>

          <form className="founders-access-panel__form" onSubmit={handleSubmit}>
            <label className="founders-access-panel__field">
              <span>Stripe Member ID</span>
              <input
                type="text"
                name="memberId"
                autoComplete="off"
                spellCheck={false}
                placeholder="cus_..."
                value={memberId}
                onChange={(event) => setMemberId(event.target.value)}
                className="founders-access-panel__input"
              />
            </label>
            <label className="founders-access-panel__field">
              <span>Billing email (optional)</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="founder@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="founders-access-panel__input"
              />
            </label>

            {error ? <p className="founders-access-panel__error">{error}</p> : null}

            <button type="submit" className="founders-access-panel__submit" disabled={submitting || loading}>
              <ShieldCheck size={16} aria-hidden />
              {submitting || loading ? "Verifying…" : "Verify Member ID"}
            </button>
          </form>

          <p className="founders-access-panel__footer">
            No Member ID yet?{" "}
            <Link to="/special" className="founders-access-panel__link">
              Claim Founder Special
            </Link>
            {" · "}
            <Link to="/member" className="founders-access-panel__link">
              Member Portal
            </Link>
          </p>
        </div>
      </GlassEffectContainer>
    </div>
  );
}
