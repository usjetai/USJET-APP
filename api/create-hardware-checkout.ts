import Stripe from "stripe";
import { HARDWARE_MAX_QUANTITY_PER_LINE, HARDWARE_PRODUCTS } from "../src/data/aiHardware";

type CartLineInput = {
  productId?: string;
  quantity?: number;
};

type CheckoutBody = {
  lines?: CartLineInput[];
};

type ApiRequest = {
  method?: string;
  body?: CheckoutBody | string;
  headers?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
};

const MAX_LINES = 20;
const CANONICAL_ORIGIN = "https://www.usjet.ai";

/** Resolve a configured Stripe Price ID for a catalog product, if the Founder has set it. */
function priceIdForProduct(stripeEnvKey: string): string | undefined {
  const value = process.env[stripeEnvKey]?.trim();
  return value ? value : undefined;
}

function headerString(
  headers: ApiRequest["headers"],
  name: string,
): string | undefined {
  const value = headers?.[name] ?? headers?.[name.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0];
  }
  return typeof value === "string" ? value : undefined;
}

function isAllowedOrigin(origin: string): boolean {
  if (origin === CANONICAL_ORIGIN || origin === "https://usjet.ai") {
    return true;
  }
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return true;
  }
  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost && origin === `https://${vercelHost}`) {
    return true;
  }
  return false;
}

function originFromRequest(req: ApiRequest): string {
  const headerOrigin = headerString(req.headers, "origin");
  if (headerOrigin && isAllowedOrigin(headerOrigin)) {
    return headerOrigin;
  }
  return CANONICAL_ORIGIN;
}

function readBody(req: ApiRequest): CheckoutBody {
  const raw = req.body;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as CheckoutBody;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as CheckoutBody;
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return res.status(503).json({ error: "Checkout is not configured on the server." });
  }

  const body = readBody(req);
  const rawLines = Array.isArray(body.lines) ? body.lines : [];
  if (!rawLines.length) {
    return res.status(400).json({ error: "Cart is empty." });
  }
  if (rawLines.length > MAX_LINES) {
    return res.status(400).json({ error: "Too many distinct items in cart." });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const unavailable: string[] = [];
  const acceptedSkus: string[] = [];
  const amazonTerms: string[] = [];

  for (const raw of rawLines) {
    const productId = typeof raw.productId === "string" ? raw.productId.trim() : "";
    const quantity = Number.isFinite(raw.quantity) ? Math.floor(raw.quantity as number) : 0;

    const product = HARDWARE_PRODUCTS.find((entry) => entry.id === productId);
    if (!product) {
      return res.status(400).json({ error: `Unknown product: ${productId || "(missing id)"}` });
    }
    if (quantity < 1 || quantity > HARDWARE_MAX_QUANTITY_PER_LINE) {
      return res.status(400).json({ error: `Invalid quantity for ${product.name}.` });
    }

    if (product.contactToOrder) {
      unavailable.push(product.name);
      continue;
    }

    const priceId = priceIdForProduct(product.stripeEnvKey) ?? product.stripePriceId;
    if (!priceId) {
      unavailable.push(product.name);
      continue;
    }

    lineItems.push({ price: priceId, quantity });
    acceptedSkus.push(`${product.id}x${quantity}`);
    amazonTerms.push(`${quantity}× ${product.amazonSearchTerm}`);
  }

  if (unavailable.length) {
    return res.status(409).json({
      error: `Not yet available for checkout: ${unavailable.join(", ")}. Contact ops@usjet.ai to order.`,
      unavailable,
    });
  }

  if (!lineItems.length) {
    return res.status(400).json({ error: "No purchasable items in cart." });
  }

  const stripe = new Stripe(secret);
  const origin = originFromRequest(req);
  const skuSummary = acceptedSkus.join(",").slice(0, 500);
  const amazonSummary = amazonTerms.join(" | ").slice(0, 500);
  const fulfillmentMeta = {
    source: "usjet-ai-computers",
    skus: skuSummary,
    amazon: amazonSummary,
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/store/ai-computers?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/ai-computers?checkout=cancelled`,
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      billing_address_collection: "required",
      metadata: fulfillmentMeta,
      payment_intent_data: { metadata: fulfillmentMeta },
    });

    if (!session.url) {
      return res.status(502).json({ error: "Stripe did not return a checkout URL." });
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout session creation failed.";
    return res.status(500).json({ error: message });
  }
}
