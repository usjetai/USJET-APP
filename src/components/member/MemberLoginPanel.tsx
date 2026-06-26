import { Link } from "react-router-dom";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { MEMBER_DECK_PRICE_DISPLAY, MEMBER_DECK_PERIOD } from "../../data/memberDeckStripe";
import { FLIGHT_PASS_STRIPE } from "../../data/stripeProducts";
import { SITE_PREVIEW_MEMBER_NOTE } from "../../data/sitePreviewPromo";
import { isSitePreviewPromoActive } from "../../lib/sitePreviewPromo";
import { isUsableStripePaymentLink, resolveMemberDeckPaymentLink, resolvePaymentLinkForTier } from "../../lib/stripePaymentLink";

type MemberLoginPanelProps = {
  onSuccess?: () => void;
};

export default function MemberLoginPanel({ onSuccess }: MemberLoginPanelProps) {
  const { login, error, loading } = useMemberAuth();
  const [email, setEmail] = useState("");
  const [accessSentence, setAccessSentence] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const memberDeckLink = resolveMemberDeckPaymentLink();
  const memberDeckReady = isUsableStripePaymentLink(memberDeckLink);

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
          billing email and your founder-issued access sentence (or Stripe <code>cus_…</code> Member ID).
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
                <span>Access sentence or Member ID</span>
                <input
                  type="text"
                  name="accessSentence"
                  autoComplete="off"
                  spellCheck={false}
                  required
                  value={accessSentence}
                  onChange={(event) => setAccessSentence(event.target.value)}
                  className="member-login-panel__input"
                  placeholder="Founder sentence or cus_…"
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
            <p className="member-login-panel__section-kicker">Member Portal entry</p>
            <p className="member-login-panel__signup-copy">
              <strong>Member Deck {MEMBER_DECK_PRICE_DISPLAY}{MEMBER_DECK_PERIOD}</strong> unlocks the Member Portal and
              member tools. Flight Pass ($19.90/mo) unlocks the full fleet runway, Hangar, and sovereign clearance.
            </p>
            {memberDeckReady ? (
              <a
                href={memberDeckLink}
                className="member-login-panel__create btn-glass-prominent glass-effect-interactive"
              >
                <CreditCard size={16} aria-hidden />
                Member Deck — {MEMBER_DECK_PRICE_DISPLAY}
                {MEMBER_DECK_PERIOD}
              </a>
            ) : (
              <p className="member-login-panel__signup-note">
                Add your $5 Stripe Payment Link to <code>VITE_STRIPE_MEMBER_DECK_PAYMENT_LINK</code> in{" "}
                <code>.env.local</code> or Vercel, then redeploy.
              </p>
            )}
            <p className="member-login-panel__signup-note">After checkout, return here and log in with your billing email.</p>

            <div className="member-login-panel__upsell">
              <p className="member-login-panel__upsell-kicker">Flight Pass clearance</p>
              <div className="member-login-panel__upsell-actions">
                <a
                  href={resolvePaymentLinkForTier("founder")}
                  className="member-login-panel__upsell-btn btn-glass glass-effect-interactive"
                >
                  {FLIGHT_PASS_STRIPE.name} {FLIGHT_PASS_STRIPE.priceDisplay}
                  {FLIGHT_PASS_STRIPE.period}
                </a>
              </div>
            </div>
          </section>
        </div>

        <footer className="member-login-panel__footer">
          <Link to="/" className="member-login-panel__link">
            Fleet
          </Link>
          <span aria-hidden> · </span>
          <Link to="/founder" className="member-login-panel__link">
            Founder
          </Link>
        </footer>
      </div>
    </GlassEffectContainer>
  );
}
