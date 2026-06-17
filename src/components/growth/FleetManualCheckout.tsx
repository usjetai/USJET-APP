import { useEffect, useState, type FormEvent } from "react";
import { Gauge, Shield } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  FLEET_MANUAL_CHECKOUT_FOOTER,
  FLEET_MANUAL_CTA_LABEL,
  FLEET_MANUAL_LICENSE_CAP,
  FLEET_MANUAL_PRICE_DISPLAY,
  FLEET_MANUAL_SCARCITY_COPY,
  FLEET_MANUAL_STATEMENT_DESCRIPTOR,
} from "../../data/fleetManual2500";
import {
  getFleetManualMetrics,
  recordFleetManualCheckoutIntent,
  subscribeFleetManualMetrics,
} from "../../lib/fleetManualMetrics";
import { mailtoUsjetOps } from "../../lib/usjetContact";
import { isUsableStripePaymentLink, resolveFleetManualPaymentLink } from "../../lib/stripePaymentLink";

const WIRE_SUBJECT = "Fleet Manual Professional License — direct transfer inquiry";

export default function FleetManualCheckout() {
  const [status, setStatus] = useState<"idle" | "routing">("idle");
  const [metrics, setMetrics] = useState(getFleetManualMetrics);
  const paymentLink = resolveFleetManualPaymentLink();
  const checkoutReady = isUsableStripePaymentLink(paymentLink);
  const soldOut = metrics.licensesRemaining <= 0;

  useEffect(() => subscribeFleetManualMetrics(() => setMetrics(getFleetManualMetrics())), []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!checkoutReady || soldOut) {
      return;
    }
    recordFleetManualCheckoutIntent();
    setStatus("routing");
    window.location.href = paymentLink;
  };

  const fillPct = Math.min(100, (metrics.licensesClaimed / FLEET_MANUAL_LICENSE_CAP) * 100);

  return (
    <GlassEffectContainer className="fleet-manual-checkout glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="fleet-manual-checkout__inner">
        <div className="fleet-manual-checkout__badge-row">
          <Gauge size={16} aria-hidden />
          <span className="fleet-manual-checkout__badge">{FLEET_MANUAL_SCARCITY_COPY}</span>
        </div>

        <div className="fleet-manual-checkout__meter" aria-label={`${metrics.licensesClaimed} of ${FLEET_MANUAL_LICENSE_CAP} licenses claimed`}>
          <div className="fleet-manual-checkout__meter-head">
            <span>Licenses claimed</span>
            <span>
              {metrics.licensesClaimed} / {FLEET_MANUAL_LICENSE_CAP}
            </span>
          </div>
          <div className="fleet-manual-checkout__meter-track">
            <span className="fleet-manual-checkout__meter-fill" style={{ width: `${fillPct}%` }} />
          </div>
          <p className="fleet-manual-checkout__meter-sub">
            {metrics.licensesRemaining} professional licenses remaining
          </p>
        </div>

        <h2 className="fleet-manual-checkout__price">{FLEET_MANUAL_PRICE_DISPLAY}</h2>

        <form className="fleet-manual-checkout__form" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="fleet-manual-checkout__cta btn-glass-prominent glass-effect-interactive w-full justify-center"
            disabled={!checkoutReady || status === "routing" || soldOut}
          >
            <Shield size={18} aria-hidden />
            <span>
              {soldOut
                ? "Professional licenses sold out"
                : status === "routing"
                  ? "Routing to Stripe…"
                  : `${FLEET_MANUAL_CTA_LABEL} — ${FLEET_MANUAL_PRICE_DISPLAY}`}
            </span>
          </button>
          {!checkoutReady && !soldOut ? (
            <p className="fleet-manual-checkout__pending">
              Stripe checkout link activating. Contact operations for wire routing.
            </p>
          ) : null}
          <p className="fleet-manual-checkout__footer-note">{FLEET_MANUAL_CHECKOUT_FOOTER}</p>
          <p className="fleet-manual-checkout__descriptor">{FLEET_MANUAL_STATEMENT_DESCRIPTOR}</p>
        </form>

        <a href={mailtoUsjetOps(WIRE_SUBJECT)} className="fleet-manual-checkout__inquire btn-glass glass-effect-interactive">
          Inquire for direct transfer
        </a>
      </div>
    </GlassEffectContainer>
  );
}
