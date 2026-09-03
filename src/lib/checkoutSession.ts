const CHECKOUT_SESSION_URL = import.meta.env.VITE_CHECKOUT_SESSION_URL ?? "/api/checkout-session";

export type ResolvedCheckoutSession = {
  customerId: string;
  email: string;
  name?: string;
};

/** Resolves a completed Stripe Checkout Session (from the post-payment redirect) into the customer's Member ID + billing email. */
export async function resolveCheckoutSession(sessionId: string): Promise<ResolvedCheckoutSession> {
  const trimmed = sessionId.trim();
  if (!trimmed) {
    throw new Error("Missing checkout session.");
  }

  const response = await fetch(CHECKOUT_SESSION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: trimmed }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Could not confirm your checkout.");
  }

  return (await response.json()) as ResolvedCheckoutSession;
}
