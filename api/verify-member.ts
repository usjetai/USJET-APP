import Stripe from "stripe";
import {
  memberAccessFromStripeMetadata,
  metadataForConfiguredProductId,
  productIdFromSubscription,
  productMetadataFromSubscription,
} from "./stripeProducts";

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

  // Both fields are required together — this is the actual fix. The old code
  // accepted email alone (or a bare customer ID alone) as sufficient proof of
  // identity. Stripe customer IDs are not secret (they show up in receipts,
  // webhook payloads, browser history) and billing emails are often guessable,
  // so either one alone let anyone with a target's email log in as them. Now
  // both must be supplied, AND the email must match what Stripe has on file
  // for that exact customer ID — two real facts about the same account, not one.
  if (!customerId || !email) {
    return res.status(400).json({ error: "Both Member ID and billing email are required." });
  }
  if (!customerId.startsWith("cus_")) {
    return res.status(400).json({ error: "Invalid Member ID format. Use cus_..." });
  }

  const stripe = new Stripe(secret);

  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      return res.status(401).json({ active: false, error: "Customer not found." });
    }

    const onFileEmail = ("email" in customer ? customer.email : undefined)?.trim().toLowerCase();
    if (!onFileEmail || onFileEmail !== email) {
      return res.status(401).json({ active: false, error: "Member ID and billing email do not match." });
    }

    const resolvedCustomerId = customer.id;

    const [activeSubs, trialingSubs] = await Promise.all([
      stripe.subscriptions.list({
        customer: resolvedCustomerId,
        status: "active",
        limit: 1,
        expand: ["data.items.data.price.product"],
      }),
      stripe.subscriptions.list({
        customer: resolvedCustomerId,
        status: "trialing",
        limit: 1,
        expand: ["data.items.data.price.product"],
      }),
    ]);

    const subscription = activeSubs.data[0] ?? trialingSubs.data[0];
    const active = Boolean(subscription);
    let stripeMetadata = subscription ? productMetadataFromSubscription(subscription) : undefined;

    if (subscription && !stripeMetadata) {
      const productId = productIdFromSubscription(subscription);
      if (productId) {
        const liveProduct = await stripe.products.retrieve(productId);
        if (liveProduct.metadata && Object.keys(liveProduct.metadata).length > 0) {
          stripeMetadata = liveProduct.metadata;
        } else {
          stripeMetadata = metadataForConfiguredProductId(productId);
        }
      }
    }
    const access = active
      ? memberAccessFromStripeMetadata(stripeMetadata)
      : { tier: "INACTIVE" as const };

    const customerName = "name" in customer ? customer.name : undefined;

    return res.status(200).json({
      active,
      customerId: resolvedCustomerId,
      name: customerName || undefined,
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
