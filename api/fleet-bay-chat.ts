/**
 * Native in-tile AI chat for Fleet bays — the actual "wired in" replacement for
 * linking guests off to a partner's own site. USJET pays for the model API call
 * (prepaid credits, e.g. Gemini API key) and members pay USJET a subscription —
 * so every call here MUST be gated behind a verified, active Stripe subscription.
 * Self-contained (no imports from src/), matching this folder's convention.
 */
import Stripe from "stripe";
import { completeGeminiApiKey, resolveGeminiApiKey, type VertexChatMessage } from "./vertexGemini";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

type ApiRequestBody = {
  customerId?: string;
  bay?: string;
  messages?: ChatMessage[];
};

type ApiRequest = { method?: string; body?: ApiRequestBody | string };
type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

const MAX_TURNS = 20;
const MAX_MESSAGE_CHARS = 4000;

/** Providers this endpoint can actually bill/serve today. Add more as keys land. */
const SUPPORTED_BAYS = new Set(["gemini"]);

function parseBody(body: ApiRequestBody | string | undefined): ApiRequestBody {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as ApiRequestBody;
    } catch {
      return {};
    }
  }
  return body;
}

function sanitizeMessages(raw: unknown): VertexChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is ChatMessage =>
        Boolean(m) &&
        typeof m === "object" &&
        typeof (m as ChatMessage).content === "string" &&
        ["user", "assistant", "system"].includes((m as ChatMessage).role),
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS).trim() }))
    .filter((m) => m.content.length > 0);
}

/** Re-verify the member server-side on every call — never trust a client-supplied "active" flag. */
async function hasActiveSubscription(customerId: string): Promise<boolean> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !customerId.startsWith("cus_")) {
    return false;
  }
  const stripe = new Stripe(secret);
  const [activeSubs, trialingSubs] = await Promise.all([
    stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 }),
    stripe.subscriptions.list({ customer: customerId, status: "trialing", limit: 1 }),
  ]);
  return Boolean(activeSubs.data[0] ?? trialingSubs.data[0]);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customerId, bay, messages } = parseBody(req.body);

  if (!bay || !SUPPORTED_BAYS.has(bay)) {
    return res.status(404).json({ error: "This bay isn't wired to native chat yet." });
  }

  if (!customerId) {
    return res.status(401).json({ error: "Member login required — this bay runs on a paid USJET subscription." });
  }

  try {
    const active = await hasActiveSubscription(customerId);
    if (!active) {
      return res
        .status(402)
        .json({ error: "No active USJET subscription found for this Member ID. Clear Flight Pass first." });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Membership check failed.";
    return res.status(500).json({ error: message });
  }

  const chatMessages = sanitizeMessages(messages);
  if (!chatMessages.length) {
    return res.status(400).json({ error: "Message required." });
  }

  if (bay === "gemini") {
    if (!resolveGeminiApiKey()) {
      return res.status(503).json({
        error: "Gemini isn't connected on the server yet — add GEMINI_API_KEY to Vercel and redeploy.",
      });
    }
    try {
      const reply = await completeGeminiApiKey(chatMessages);
      return res.status(200).json({ reply });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gemini request failed.";
      return res.status(502).json({ error: message });
    }
  }

  return res.status(404).json({ error: "Unknown bay." });
}
