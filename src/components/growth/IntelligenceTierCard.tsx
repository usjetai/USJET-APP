import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { recordFuelCheckoutIntent } from "../../lib/foundersFuelMetrics";
import { recordFleetManualCheckoutIntent } from "../../lib/fleetManualMetrics";
import { isUsableStripePaymentLink, resolveFleetManualPaymentLink, resolveFounderPaymentLink } from "../../lib/stripePaymentLink";

type TierKind = "fuel" | "manual";

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

  const paymentLink = kind === "fuel" ? resolveFounderPaymentLink() : resolveFleetManualPaymentLink();

  const checkoutReady = isUsableStripePaymentLink(paymentLink);

  const handleBuy = () => {
    if (!checkoutReady) {
      return;
    }
    if (kind === "fuel") {
      recordFuelCheckoutIntent();
    } else {
      recordFleetManualCheckoutIntent();
    }
    setStatus("routing");
    window.location.href = paymentLink;
  };

  const tint = "glass-tint-cyan";

  return (
    <>
      <GlassEffectContainer
        className={[
          "intelligence-tier-card glass-effect glass-effect--rounded-rect liquid-glass-background",
          tint,
          featured ? "intelligence-tier-card--featured" : "",
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
              <Shield size={16} aria-hidden />
              <span>
                {status === "routing"
                  ? "Routing to Stripe…"
                  : `${cta} — ${priceDisplay}${period}`}
              </span>
            </button>
            {!checkoutReady ? (
              <p className="intelligence-tier-card__pending">Stripe checkout activating — use detail page or ops wire.</p>
            ) : null}
            <Link to={detailRoute} className="intelligence-tier-card__detail btn-glass glass-effect-interactive">
              Full briefing
            </Link>
          </div>
        </div>
      </GlassEffectContainer>
    </>
  );
}
