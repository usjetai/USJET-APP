import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Shield } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import SovereignVaultConfidentialityModal from "./SovereignVaultConfidentialityModal";
import { recordFuelCheckoutIntent } from "../../lib/foundersFuelMetrics";
import { recordFleetManualCheckoutIntent } from "../../lib/fleetManualMetrics";
import { isUsableStripePaymentLink, resolve100kPaymentLink, resolveFleetManualPaymentLink, resolveFounderPaymentLink } from "../../lib/stripePaymentLink";

type TierKind = "fuel" | "manual" | "protocol";

type IntelligenceTierCardProps = {
  kind: TierKind;
  tierLabel: string;
  name: string;
  subtitle?: string;
  priceDisplay: string;
  period: string;
  stripeDescription: string;
  logic: string;
  cta: string;
  detailRoute: string;
  visual: ReactNode;
  featured?: boolean;
};

export default function IntelligenceTierCard({
  kind,
  tierLabel,
  name,
  subtitle,
  priceDisplay,
  period,
  stripeDescription,
  logic,
  cta,
  detailRoute,
  visual,
  featured = false,
}: IntelligenceTierCardProps) {
  const [status, setStatus] = useState<"idle" | "routing">("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const paymentLink =
    kind === "fuel"
      ? resolveFounderPaymentLink()
      : kind === "manual"
        ? resolveFleetManualPaymentLink()
        : resolve100kPaymentLink();

  const checkoutReady = isUsableStripePaymentLink(paymentLink);

  const routeToStripe = () => {
    if (!checkoutReady) {
      return;
    }
    if (kind === "fuel") {
      recordFuelCheckoutIntent();
    } else if (kind === "manual") {
      recordFleetManualCheckoutIntent();
    }
    setStatus("routing");
    window.location.href = paymentLink;
  };

  const handleBuy = () => {
    if (kind === "protocol") {
      setAgreed(false);
      setModalOpen(true);
      return;
    }
    routeToStripe();
  };

  const tint =
    kind === "protocol" ? "glass-tint-gold" : kind === "manual" ? "glass-tint-cyan" : "glass-tint-cyan";

  return (
    <>
      <GlassEffectContainer
        className={[
          "intelligence-tier-card glass-effect glass-effect--rounded-rect liquid-glass-background",
          tint,
          featured ? "intelligence-tier-card--featured" : "",
          kind === "protocol" ? "intelligence-tier-card--vault-secure" : "",
          `intelligence-tier-card--${kind}`,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="intelligence-tier-card__inner">
          <p className="intelligence-tier-card__tier-label">{tierLabel}</p>
          <div className="intelligence-tier-card__visual-wrap">{visual}</div>
          <h2 className="intelligence-tier-card__name">{name}</h2>
          {subtitle ? <p className="intelligence-tier-card__subtitle">{subtitle}</p> : null}
          <p className="intelligence-tier-card__price">
            {priceDisplay}
            {period ? <span className="intelligence-tier-card__period">{period}</span> : null}
          </p>
          <p className="intelligence-tier-card__logic">{logic}</p>
          <p className="intelligence-tier-card__description">{stripeDescription}</p>
          <div className="intelligence-tier-card__actions">
            <button
              type="button"
              className="intelligence-tier-card__buy btn-glass-prominent glass-effect-interactive"
              disabled={status === "routing"}
              onClick={handleBuy}
            >
              {kind === "protocol" ? <Lock size={16} aria-hidden /> : <Shield size={16} aria-hidden />}
              <span>
                {status === "routing"
                  ? "Routing to Stripe…"
                  : `${cta}${kind === "protocol" ? ` — ${priceDisplay}` : period ? ` — ${priceDisplay}${period}` : ` — ${priceDisplay}`}`}
              </span>
            </button>
            {!checkoutReady && kind !== "protocol" ? (
              <p className="intelligence-tier-card__pending">Stripe checkout activating — use detail page or ops wire.</p>
            ) : null}
            {kind === "protocol" && !checkoutReady ? (
              <p className="intelligence-tier-card__pending">Stripe checkout activating — confidentiality gate ready when live.</p>
            ) : null}
            <Link to={detailRoute} className="intelligence-tier-card__detail btn-glass glass-effect-interactive">
              Full briefing
            </Link>
          </div>
        </div>
      </GlassEffectContainer>

      {kind === "protocol" ? (
        <SovereignVaultConfidentialityModal
          open={modalOpen}
          agreed={agreed}
          onAgreedChange={setAgreed}
          onCancel={() => {
            if (status !== "routing") {
              setModalOpen(false);
              setAgreed(false);
            }
          }}
          onProceed={routeToStripe}
          checkoutReady={checkoutReady}
          routing={status === "routing"}
        />
      ) : null}
    </>
  );
}
