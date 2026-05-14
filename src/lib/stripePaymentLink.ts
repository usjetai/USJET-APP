/** Flight Pass ($19.90/mo) — hard-wired Stripe Payment Link (Direct Landing Protocol). */
export const FLIGHT_PASS_DIRECT_URL = "https://buy.stripe.com/9B628raCq83VfUZ9xZdwc00";

/** Flight Pass ($19.90/mo) — env override when set, else FLIGHT_PASS_DIRECT_URL. */
export function resolveFounderPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_FOUNDER_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : FLIGHT_PASS_DIRECT_URL;
}

/** Returns true when a Stripe Payment Link URL is configured and safe to navigate to. */
export function isUsableStripePaymentLink(url: string | undefined): url is string {
  const trimmed = url?.trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed.includes("your_stripe_link_here")) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" && parsed.hostname.endsWith("stripe.com");
  } catch {
    return false;
  }
}
