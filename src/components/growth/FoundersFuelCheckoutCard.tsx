import { useState, type FormEvent } from "react";
import { Flame, Lock, ShieldCheck } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { FOUNDERS_FUEL_PRICE_DISPLAY, FOUNDERS_FUEL_VALUE_STACK } from "../../data/foundersFuel";
import { FLIGHT_PASS_STRIPE } from "../../data/stripeProducts";
import { recordFuelCheckoutIntent } from "../../lib/foundersFuelMetrics";
import { isUsableStripePaymentLink, resolveFounderPaymentLink } from "../../lib/stripePaymentLink";
import FoundersFuelProgressBar from "./FoundersFuelProgressBar";

export default function FoundersFuelCheckoutCard() {
  const [status, setStatus] = useState<"idle" | "routing">("idle");
  const paymentLink = resolveFounderPaymentLink();
  const checkoutReady = isUsableStripePaymentLink(paymentLink);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!checkoutReady) {
      return;
    }
    recordFuelCheckoutIntent();
    setStatus("routing");
    window.location.href = paymentLink;
  };

  return (
    <GlassEffectContainer className="fuel-checkout glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
      <div className="fuel-checkout__inner">
        <div className="fuel-checkout__badge-row">
          <Flame size={16} aria-hidden />
          <span className="fuel-checkout__badge">Founder&apos;s Fuel · {FOUNDERS_FUEL_PRICE_DISPLAY}/mo</span>
        </div>
        <h2 className="fuel-checkout__title">Fuel the Fleet</h2>
        <p className="fuel-checkout__lede">
          Buy a dev a meal and get early access to the 30-AI Intel dashboard. Low-friction clearance — one Stripe
          click, one Member ID, one sovereign hangar.
        </p>

        <FoundersFuelProgressBar />

        <ul className="fuel-checkout__stack">
          {FOUNDERS_FUEL_VALUE_STACK.map((line) => (
            <li key={line} className="fuel-checkout__stack-item">
              <ShieldCheck size={14} aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <form className="fuel-checkout__form" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="fuel-checkout__cta btn-glass-prominent glass-effect-interactive w-full justify-center"
            disabled={!checkoutReady || status === "routing"}
          >
            <Lock size={16} aria-hidden />
            <span>
              {status === "routing"
                ? "Routing to Stripe…"
                : `Fuel the mission — ${FOUNDERS_FUEL_PRICE_DISPLAY}/mo`}
            </span>
          </button>
          <p className="fuel-checkout__secure">
            <Lock size={12} aria-hidden />
            Secure Stripe checkout · {FLIGHT_PASS_STRIPE.statementDescriptor}
          </p>
        </form>
      </div>
    </GlassEffectContainer>
  );
}
