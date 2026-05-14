import Stripe from "stripe";
import { memberAccessFromStripeMetadata, productMetadataFromSubscription } from "./stripeProducts";

type VerifyBody = {
  customerId?: string;
  email?: string;
};

type ApiRequest = {
  method?: string;
  body?: VerifyBody;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return res.status(503).json({ error: "Stripe verification is not configured on the server." });
  }

  const customerId = req.body?.customerId?.trim();
  const email = req.body?.email?.trim().toLowerCase();

  if (!customerId && !email) {
    return res.status(400).json({ error: "Member ID or billing email required." });
  }

  const stripe = new Stripe(secret);

  try {
    let resolvedCustomerId = customerId;

    if (customerId?.startsWith("cus_")) {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) {
        return res.status(401).json({ active: false, error: "Customer not found." });
      }
      resolvedCustomerId = customer.id;
    } else if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (!customers.data.length) {
        return res.status(401).json({ active: false, error: "No Stripe customer for this email." });
      }
      resolvedCustomerId = customers.data[0].id;
    } else {
      return res.status(400).json({ error: "Invalid Member ID format. Use cus_..." });
    }

    const [activeSubs, trialingSubs] = await Promise.all([
      stripe.subscriptions.list({
        customer: resolvedCustomerId!,
        status: "active",
        limit: 1,
        expand: ["data.items.data.price.product"],
      }),
      stripe.subscriptions.list({
        customer: resolvedCustomerId!,
        status: "trialing",
        limit: 1,
        expand: ["data.items.data.price.product"],
      }),
    ]);

    const subscription = activeSubs.data[0] ?? trialingSubs.data[0];
    const active = Boolean(subscription);
    const stripeMetadata = subscription ? productMetadataFromSubscription(subscription) : undefined;
    const access = active
      ? memberAccessFromStripeMetadata(stripeMetadata)
      : { tier: "INACTIVE" as const };

    return res.status(200).json({
      active,
      customerId: resolvedCustomerId,
      tier: access.tier,
      stripeTier: access.stripeTier,
      accessLevel: access.accessLevel,
      legacyId: access.legacyId,
      email: email || undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed.";
    return res.status(500).json({ error: message });
  }
}
