import { useState, type FormEvent } from "react";
import { Code2, Terminal } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  CODE_KIT_CHECKOUT_FOOTER,
  CODE_KIT_CTA_LABEL,
  CODE_KIT_PRICE_DISPLAY,
  CODE_KIT_STATEMENT_DESCRIPTOR,
  CODE_KIT_STRIPE_PRODUCT_NAME,
} from "../../data/codeKit499";
import { mailtoUsjetOps } from "../../lib/usjetContact";
import { isUsableStripePaymentLink, resolveCodeKitPaymentLink } from "../../lib/stripePaymentLink";

const WIRE_SUBJECT = "USJET Code Kit — direct transfer inquiry";

export default function CodeKitCheckout() {
  const [status, setStatus] = useState<"idle" | "routing">("idle");
  const paymentLink = resolveCodeKitPaymentLink();
  const checkoutReady = isUsableStripePaymentLink(paymentLink);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!checkoutReady) {
      return;
    }
    setStatus("routing");
    window.location.href = paymentLink;
  };

  return (
    <GlassEffectContainer className="code-kit-checkout glass-effect glass-effect--rounded-rect">
      <div className="code-kit-checkout__inner">
        <div className="code-kit-checkout__badge-row">
          <Terminal size={16} aria-hidden />
          <span className="code-kit-checkout__badge">{CODE_KIT_STRIPE_PRODUCT_NAME}</span>
        </div>

        <h2 className="code-kit-checkout__price">{CODE_KIT_PRICE_DISPLAY}</h2>

        <form className="code-kit-checkout__form" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="code-kit-checkout__cta glass-effect-interactive"
            disabled={!checkoutReady || status === "routing"}
          >
            <Code2 size={18} aria-hidden />
            <span>
              {status === "routing"
                ? "Routing to Stripe…"
                : `${CODE_KIT_CTA_LABEL} — ${CODE_KIT_PRICE_DISPLAY}`}
            </span>
          </button>
          {!checkoutReady ? (
            <p className="code-kit-checkout__pending">
              Stripe checkout link activating. Set <code>VITE_STRIPE_CODE_KIT_PAYMENT_LINK</code> or contact operations
              for wire routing.
            </p>
          ) : null}
          <p className="code-kit-checkout__footer-note">{CODE_KIT_CHECKOUT_FOOTER}</p>
          <p className="code-kit-checkout__descriptor">{CODE_KIT_STATEMENT_DESCRIPTOR}</p>
        </form>

        <a href={mailtoUsjetOps(WIRE_SUBJECT)} className="code-kit-checkout__inquire glass-effect-interactive">
          Inquire for direct transfer
        </a>
      </div>
    </GlassEffectContainer>
  );
}
