import { Link } from "react-router-dom";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { FLIGHT_PASS_STRIPE } from "../../data/stripeProducts";
import { SITE_PREVIEW_MEMBER_NOTE } from "../../data/sitePreviewPromo";
import { isSitePreviewPromoActive } from "../../lib/sitePreviewPromo";
import { isUsableStripePaymentLink, resolvePaymentLinkForTier } from "../../lib/stripePaymentLink";

type MemberLoginPanelProps = {
  onSuccess?: () => void;
};

export default function MemberLoginPanel({ onSuccess }: MemberLoginPanelProps) {
  const { login, error, loading } = useMemberAuth();
  const [email, setEmail] = useState("");
  const [accessSentence, setAccessSentence] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const flightPassLink = resolvePaymentLinkForTier("founder");
  const flightPassReady = isUsableStripePaymentLink(flightPassLink);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const ok = await login(accessSentence.trim(), email.trim());
    setSubmitting(false);
    if (ok) {
      onSuccess?.();
    }
  };

  return (
    <GlassEffectContainer className="member-login-panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="member-login-panel__card">
        <p className="member-login-panel__kicker">Direct Landing Protocol</p>
        <h2 className="member-login-panel__title">Pay first. Then verify.</h2>
        <p className="member-login-panel__lead">
          <strong>Email alone does not unlock the Member Portal.</strong> Complete Stripe checkout, then log in with
          billing email and your Stripe <code>cus_…</code> Member ID.
        </p>
        {isSitePreviewPromoActive() ? (
          <p className="member-login-panel__preview-note">{SITE_PREVIEW_MEMBER_NOTE}</p>
        ) : null}

        <div className="member-login-panel__body">
          <section className="member-login-panel__login" aria-label="Member login">
            <p className="member-login-panel__section-kicker">Log in</p>
            <form className="member-login-panel__fields" onSubmit={handleSubmit}>
              <label className="member-login-panel__field">
                <span>Billing email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="member-login-panel__input"
                  placeholder="you@domain.com"
                />
              </label>
              <label className="member-login-panel__field">
                <span>Member ID</span>
                <input
                  type="text"
                  name="accessSentence"
                  autoComplete="off"
                  spellCheck={false}
                  required
                  value={accessSentence}
                  onChange={(event) => setAccessSentence(event.target.value)}
                  className="member-login-panel__input"
                  placeholder="cus_…"
                />
              </label>
              {error ? <p className="member-login-panel__error">{error}</p> : null}
              <button type="submit" className="member-login-panel__submit" disabled={submitting || loading}>
                <ShieldCheck size={16} aria-hidden />
                {submitting || loading ? "Verifying…" : "Log in"}
              </button>
            </form>
            <p className="member-login-panel__login-note">Stripe-only gate — no Google or Apple OAuth.</p>
          </section>

          <div className="member-login-panel__divider" aria-hidden />

          <section className="member-login-panel__signup" aria-label="Create account via Stripe">
            <p className="member-login-panel__section-kicker">Flight Pass entry</p>
            <p className="member-login-panel__signup-copy">
              <strong>
                {FLIGHT_PASS_STRIPE.name} {FLIGHT_PASS_STRIPE.priceDisplay}
                {FLIGHT_PASS_STRIPE.period}
              </strong>{" "}
              unlocks the Member Portal, full Hangar tabs, and the fleet runway. Hangar Pro adds Intel;
              Enterprise adds Origin.
            </p>
            {flightPassReady ? (
              <a
                href={flightPassLink}
                className="member-login-panel__create btn-glass-prominent glass-effect-interactive"
              >
                <CreditCard size={16} aria-hidden />
                {FLIGHT_PASS_STRIPE.name} — {FLIGHT_PASS_STRIPE.priceDisplay}
                {FLIGHT_PASS_STRIPE.period}
              </a>
            ) : (
              <p className="member-login-panel__signup-note">
                Flight Pass Stripe Payment Link is not configured. Set{" "}
                <code>VITE_STRIPE_FOUNDER_PAYMENT_LINK</code> or use the hard-wired Direct Landing port.
              </p>
            )}
            <p className="member-login-panel__signup-note">After checkout, return here and log in with your billing email.</p>
          </section>
        </div>

        <footer className="member-login-panel__footer">
          <Link to="/" className="member-login-panel__link">
            Fleet
          </Link>
        </footer>
      </div>
    </GlassEffectContainer>
  );
}
