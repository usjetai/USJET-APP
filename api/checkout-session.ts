import Stripe from "stripe";

type CheckoutSessionBody = {
  sessionId?: string;
};

type ApiRequest = {
  method?: string;
  body?: CheckoutSessionBody | string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
};

function readBody(req: ApiRequest): CheckoutSessionBody {
  const raw = req.body;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as CheckoutSessionBody;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as CheckoutSessionBody;
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Resolves a completed Stripe Checkout Session into the customer's Member ID + billing
 * email, so a customer who just paid can be shown (and auto-logged in with) the exact
 * cus_... they'll need for future Member Portal logins. The session_id is a long,
 * Stripe-issued, single-use-context token (never guessable, appears only in the
 * post-payment redirect URL) — safe to trust as proof this browser was the one that
 * just completed checkout. It does not grant access on its own; the frontend still
 * runs the result through the same real Stripe verification as any other login.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return res.status(503).json({ error: "Checkout lookup is not configured on the server." });
  }

  const sessionId = readBody(req).sessionId?.trim();
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return res.status(400).json({ error: "Invalid checkout session." });
  }

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer"],
    });

    if (session.status !== "complete") {
      return res.status(409).json({ error: "This checkout has not completed yet." });
    }

    const customer = session.customer;
    const customerId =
      typeof customer === "string"
        ? customer
        : customer && !customer.deleted
          ? customer.id
          : undefined;
    const email =
      (typeof customer === "object" && customer && !customer.deleted ? customer.email : undefined) ??
      session.customer_details?.email ??
      undefined;

    if (!customerId || !email) {
      return res.status(404).json({ error: "No customer found for this checkout." });
    }

    return res.status(200).json({
      customerId,
      email,
      name: session.customer_details?.name ?? undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not look up checkout session.";
    return res.status(500).json({ error: message });
  }
}
