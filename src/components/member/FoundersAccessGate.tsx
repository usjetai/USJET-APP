import { Link } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";

type FoundersAccessGateProps = {
  pageLabel: string;
  children: ReactNode;
};

export default function FoundersAccessGate({ pageLabel, children }: FoundersAccessGateProps) {
  const { session, loading, login, error } = useMemberAuth();
  const [memberId, setMemberId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session?.active) {
    return <>{children}</>;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await login(memberId);
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
          <p className="founders-access-panel__kicker">Member ID Gateway</p>
          <h2 className="founders-access-panel__title">FOUNDER ACCESS REQUIRED: ENTER MEMBER ID</h2>
          <p className="founders-access-panel__copy">
            {pageLabel} is restricted to authorized founders. Enter your Member ID to unlock partnership bays and
            Titans telemetry.
          </p>

          <form className="founders-access-panel__form" onSubmit={handleSubmit}>
            <label className="founders-access-panel__field">
              <span>Member ID</span>
              <input
                type="text"
                name="memberId"
                autoComplete="off"
                spellCheck={false}
                placeholder="Member ID"
                value={memberId}
                onChange={(event) => setMemberId(event.target.value)}
                className="founders-access-panel__input"
              />
            </label>

            {error ? <p className="founders-access-panel__error">{error}</p> : null}

            <button type="submit" className="founders-access-panel__submit" disabled={submitting || loading}>
              <ShieldCheck size={16} aria-hidden />
              {submitting || loading ? "Authorizing…" : "Authorize access"}
            </button>
          </form>

          <p className="founders-access-panel__footer">
            No Member ID yet?{" "}
            <Link to="/special" className="founders-access-panel__link">
              Claim Founder Special
            </Link>
            {" · "}
            <Link to="/member/login" className="founders-access-panel__link">
              Member login
            </Link>
          </p>
        </div>
      </GlassEffectContainer>
    </div>
  );
}
