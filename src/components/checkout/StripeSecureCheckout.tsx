import { useMemo, useState, type FormEvent } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { CreditCard, Lock } from "lucide-react";

export type SpecialTierId = "founder" | "hangar-pro" | "fleet-command";

type StripeSecureCheckoutProps = {
  tierId: SpecialTierId;
  tierLabel: string;
  amountLabel: string;
  paymentLink?: string;
};

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
const clientSecret = import.meta.env.VITE_STRIPE_PAYMENT_INTENT_CLIENT_SECRET?.trim() ?? "";

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function CheckoutForm({
  tierLabel,
  amountLabel,
  paymentLink,
}: Omit<StripeSecureCheckoutProps, "tierId">) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      if (paymentLink) {
        window.location.assign(paymentLink);
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
      {clientSecret ? (
        <div className="special-checkout__element-shell liquid-glass-background glass-effect glass-effect--rounded-rect">
          <PaymentElement options={{ layout: "tabs" }} />
        </div>
      ) : (
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
      )}

      {message ? (
        <p className="special-checkout__message special-checkout__message--error" role="alert">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        className="special-checkout__submit btn-glass-prominent glass-effect-interactive w-full justify-center"
        disabled={status === "processing"}
      >
        <Lock size={16} aria-hidden />
        <span>
          {status === "processing"
            ? "Processing…"
            : clientSecret
              ? `Pay ${amountLabel} — ${tierLabel}`
              : `Secure Checkout — ${amountLabel}`}
        </span>
      </button>

      {!clientSecret && paymentLink ? (
        <p className="special-checkout__hint">
          Add <code className="special-checkout__code">VITE_STRIPE_PUBLISHABLE_KEY</code> and a server-issued
          PaymentIntent client secret to enable inline Stripe Elements. Until then, checkout uses your Stripe
          payment link.
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
