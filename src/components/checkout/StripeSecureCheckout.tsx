import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { isUsableStripePaymentLink, resolvePaymentLinkForTier } from "../../lib/stripePaymentLink";
import { USJET_OPS_EMAIL } from "../../lib/usjetContact";

export type SpecialTierId = "founder" | "hangar-pro" | "fleet-command";

type StripeSecureCheckoutProps = {
  tierId: SpecialTierId;
  tierLabel: string;
  amountLabel: string;
  statementDescriptor?: string;
  paymentLink?: string;
};

const isDev = import.meta.env.DEV;

export default function StripeSecureCheckout({
  tierId,
  tierLabel,
  amountLabel,
  statementDescriptor,
  paymentLink,
}: StripeSecureCheckoutProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const usablePaymentLink = isUsableStripePaymentLink(paymentLink)
    ? paymentLink
    : resolvePaymentLinkForTier(tierId);
  const checkoutReady = Boolean(usablePaymentLink);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!checkoutReady) {
      setStatus("error");
      setMessage(
        isDev
          ? "Payment link not configured. Set VITE_STRIPE_*_PAYMENT_LINK in your environment."
          : "Checkout is temporarily unavailable. Please try again later.",
      );
      return;
    }

    setStatus("processing");
    setMessage(null);
    window.location.href = usablePaymentLink;
  };

  return (
    <form className="special-checkout__form" onSubmit={handleSubmit}>
      {!checkoutReady ? (
        <UnconfiguredCheckout />
      ) : (
        <div className="special-checkout__fallback liquid-glass-background glass-effect glass-effect--rounded-rect">
          <p className="special-checkout__hint special-checkout__hint--lead">
            One click routes you to Stripe&apos;s secure checkout for {tierLabel}. Your Member ID is issued on
            confirmation—use it to unlock the sovereign cockpit.
          </p>
        </div>
      )}

      {message ? (
        <p className="special-checkout__message special-checkout__message--error" role="alert">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        className="special-checkout__submit btn-glass-prominent glass-effect-interactive w-full justify-center"
        disabled={status === "processing" || !checkoutReady}
      >
        <Lock size={16} aria-hidden />
        <span>
          {status === "processing" ? "Routing to Stripe…" : `Enter the Hangar — ${amountLabel}`}
        </span>
      </button>

      {statementDescriptor ? (
        <p className="special-checkout__descriptor">
          Your card will show <code>{statementDescriptor}</code>. Recurring monthly until you cancel in the
          Member Portal.
        </p>
      ) : null}

      {checkoutReady ? (
        <p className="special-checkout__hint">
          Direct Landing Protocol — bank-ready Stripe Payment Link. One ship, one cockpit.
        </p>
      ) : null}
    </form>
  );
}

function UnconfiguredCheckout() {
  return (
    <div
      className="special-checkout__unconfigured liquid-glass-background glass-effect glass-effect--rounded-rect"
      role="alert"
    >
      <p className="special-checkout__unconfigured-title">Checkout not wired</p>
      <p className="special-checkout__unconfigured-copy">
        {isDev
          ? "Payment link not configured. Add VITE_STRIPE_FOUNDER_PAYMENT_LINK (and sibling tier links) in .env or Vercel."
          : (
              <>
                Secure checkout is being provisioned.{" "}
                <a href={`mailto:${USJET_OPS_EMAIL}`} className="special-checkout__support-link">
                  Contact {USJET_OPS_EMAIL}
                </a>{" "}
                or try again shortly.
              </>
            )}
      </p>
    </div>
  );
}
