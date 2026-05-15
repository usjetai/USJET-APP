import { useState } from "react";
import { Lock, Shield } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  SOVEREIGN_BLUEPRINT_CHECKOUT_FOOTER,
  SOVEREIGN_BLUEPRINT_CTA_LABEL,
  SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY,
  SOVEREIGN_BLUEPRINT_PRICE_DISPLAY,
  SOVEREIGN_BLUEPRINT_STATEMENT_DESCRIPTOR,
  SOVEREIGN_PRICE_DEADLINE_LABEL,
} from "../../data/sovereignBlueprint100k";
import { mailtoUsjetOps } from "../../lib/usjetContact";
import { isUsableStripePaymentLink, resolve100kPaymentLink } from "../../lib/stripePaymentLink";
import SovereignVaultConfidentialityModal from "./SovereignVaultConfidentialityModal";

const WIRE_INQUIRY_SUBJECT = "100K Protocol Access — direct transfer inquiry";

export default function SovereignBlueprint100kVault() {
  const [status, setStatus] = useState<"idle" | "routing">("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const paymentLink = resolve100kPaymentLink();
  const checkoutReady = isUsableStripePaymentLink(paymentLink);

  const routeToStripe = () => {
    if (!checkoutReady) {
      return;
    }
    setStatus("routing");
    window.location.href = paymentLink;
  };

  const openConfidentiality = () => {
    setAgreed(false);
    setModalOpen(true);
  };

  const closeConfidentiality = () => {
    if (status !== "routing") {
      setModalOpen(false);
      setAgreed(false);
    }
  };

  return (
    <>
      <GlassEffectContainer className="vault-100k__panel vault-100k__panel--locked glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
        <div className="vault-100k__shimmer" aria-hidden />
        <div className="vault-100k__inner">
          <div className="vault-100k__lock-ring" aria-hidden>
            <Lock size={28} strokeWidth={2.25} />
          </div>

          <p className="vault-100k__status">Vault sealed · institutional clearance</p>

          <h2 className="vault-100k__price">{SOVEREIGN_BLUEPRINT_PRICE_DISPLAY}</h2>

          <p className="vault-100k__checkout-lede">
            {SOVEREIGN_BLUEPRINT_PRICE_DISPLAY} until {SOVEREIGN_PRICE_DEADLINE_LABEL} — then{" "}
            {SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY}. Settlement requires confidentiality acknowledgment before Stripe
            or wire routing.
          </p>

          <div className="vault-100k__form">
            <button
              type="button"
              className="vault-100k__cta btn-glass-prominent glass-effect-interactive w-full justify-center"
              disabled={status === "routing"}
              onClick={openConfidentiality}
            >
              <Shield size={18} aria-hidden />
              <span>
                {status === "routing"
                  ? "Routing to Stripe…"
                  : `${SOVEREIGN_BLUEPRINT_CTA_LABEL} — ${SOVEREIGN_BLUEPRINT_PRICE_DISPLAY}`}
              </span>
            </button>
            {!checkoutReady ? (
              <p className="vault-100k__pending">
                Stripe checkout link activating. For wire or proof-of-funds routing, contact operations.
              </p>
            ) : null}
            <p className="vault-100k__footer-note">{SOVEREIGN_BLUEPRINT_CHECKOUT_FOOTER}</p>
            <p className="vault-100k__descriptor">{SOVEREIGN_BLUEPRINT_STATEMENT_DESCRIPTOR}</p>
          </div>

          <a
            href={mailtoUsjetOps(WIRE_INQUIRY_SUBJECT)}
            className="vault-100k__inquire btn-glass glass-effect-interactive"
          >
            Inquire for direct transfer
          </a>
        </div>
      </GlassEffectContainer>

      <SovereignVaultConfidentialityModal
        open={modalOpen}
        agreed={agreed}
        onAgreedChange={setAgreed}
        onCancel={closeConfidentiality}
        onProceed={routeToStripe}
        checkoutReady={checkoutReady}
        routing={status === "routing"}
      />
    </>
  );
}
