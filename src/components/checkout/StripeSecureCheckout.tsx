import { useMemo, useState, type FormEvent } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { CreditCard, Lock } from "lucide-react";
import { isUsableStripePaymentLink, resolveFounderPaymentLink } from "../../lib/stripePaymentLink";

export type SpecialTierId = "founder" | "hangar-pro" | "fleet-command";

type StripeSecureCheckoutProps = {
  tierId: SpecialTierId;
  tierLabel: string;
  amountLabel: string;
  statementDescriptor?: string;
  paymentLink?: string;
};

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
const clientSecret = import.meta.env.VITE_STRIPE_PAYMENT_INTENT_CLIENT_SECRET?.trim() ?? "";
const isDev = import.meta.env.DEV;

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function CheckoutForm({
  tierId,
  tierLabel,
  amountLabel,
  statementDescriptor,
  paymentLink,
}: StripeSecureCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const usablePaymentLink = isUsableStripePaymentLink(paymentLink)
    ? paymentLink
    : tierId === "founder"
      ? resolveFounderPaymentLink()
      : undefined;
  const checkoutReady = Boolean(clientSecret || usablePaymentLink);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!checkoutReady) {
      setStatus("error");
      setMessage(
        isDev
          ? "Payment link not configured. Set VITE_STRIPE_FOUNDER_PAYMENT_LINK in your environment."
          : "Checkout is temporarily unavailable. Please try again later.",
      );
      return;
    }

    if (!stripe || !elements) {
      if (usablePaymentLink) {
        window.location.assign(usablePaymentLink);
      }
      return;
    }

    setStatus("processing");
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/special?checkout=complete`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message ?? "Payment could not be completed.");
      return;
    }

    setStatus("idle");
  };

  return (
    <form className="special-checkout__form" onSubmit={handleSubmit}>
      {!checkoutReady ? (
        <div
          className="special-checkout__unconfigured liquid-glass-background glass-effect glass-effect--rounded-rect"
          role="alert"
        >
          <p className="special-checkout__unconfigured-title">Checkout not wired</p>
          <p className="special-checkout__unconfigured-copy">
            {isDev
              ? "Payment link not configured. Add VITE_STRIPE_FOUNDER_PAYMENT_LINK (and sibling tier links) in .env or Vercel."
              : "Secure checkout is being provisioned. Contact support or try again shortly."}
          </p>
        </div>
      ) : null}

      {clientSecret ? (
        <div className="special-checkout__element-shell liquid-glass-background glass-effect glass-effect--rounded-rect">
          <PaymentElement options={{ layout: "tabs" }} />
        </div>
      ) : checkoutReady ? (
        <div className="special-checkout__fallback liquid-glass-background glass-effect glass-effect--rounded-rect">
          <label className="special-checkout__field">
            <span className="special-checkout__label">Cardholder name</span>
            <input
              className="special-checkout__input"
              type="text"
              name="cardholder"
              autoComplete="cc-name"
              placeholder="Ameer Karim"
            />
          </label>
          <label className="special-checkout__field">
            <span className="special-checkout__label">Card number</span>
            <div className="special-checkout__input special-checkout__input--icon">
              <CreditCard size={16} aria-hidden className="text-cyan-300/80" />
              <input
                type="text"
                name="card"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="•••• •••• •••• ••••"
              />
            </div>
          </label>
          <div className="special-checkout__row">
            <label className="special-checkout__field">
              <span className="special-checkout__label">Expiry</span>
              <input
                className="special-checkout__input"
                type="text"
                name="expiry"
                autoComplete="cc-exp"
                placeholder="MM / YY"
              />
            </label>
            <label className="special-checkout__field">
              <span className="special-checkout__label">CVC</span>
              <input
                className="special-checkout__input"
                type="text"
                name="cvc"
                autoComplete="cc-csc"
                placeholder="•••"
              />
            </label>
          </div>
        </div>
      ) : null}

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
          {status === "processing"
            ? "Authorizing clearance…"
            : clientSecret
              ? `Authorize ${amountLabel} — ${tierLabel}`
              : `Enter the Hangar — ${amountLabel}`}
        </span>
      </button>

      {statementDescriptor ? (
        <p className="special-checkout__descriptor">
          Your card will show <code>{statementDescriptor}</code>. Recurring monthly until you cancel in the
          Member Portal.
        </p>
      ) : null}

      {!clientSecret && usablePaymentLink ? (
        <p className="special-checkout__hint">
          Secure checkout routes through Stripe. Your Member ID is issued on confirmation—use it to unlock the
          sovereign cockpit.
        </p>
      ) : null}
    </form>
  );
}

export default function StripeSecureCheckout(props: StripeSecureCheckoutProps) {
  const options = useMemo<StripeElementsOptions | undefined>(() => {
    if (!clientSecret) {
      return undefined;
    }

    return {
      clientSecret,
      appearance: {
        theme: "night",
        variables: {
          colorPrimary: "#38bdf8",
          colorBackground: "rgba(5, 10, 20, 0.55)",
          colorText: "#f8fafc",
          borderRadius: "12px",
        },
      },
    };
  }, []);

  if (stripePromise && options) {
    return (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm {...props} />
      </Elements>
    );
  }

  return <CheckoutForm {...props} />;
}
