/** Flight Pass ($19.90/mo) — reads VITE_STRIPE_FOUNDER_PAYMENT_LINK (set in Vercel env). */
export function resolveFounderPaymentLink(): string | undefined {
  const url = import.meta.env.VITE_STRIPE_FOUNDER_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : undefined;
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
