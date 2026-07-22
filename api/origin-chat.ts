/**
 * Origin Aura chat — OpenRouter when keyed, else short onboard fallback.
 * Keeps the API key on the server (same pattern as Hired HUD bay chat).
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemini-2.5-flash";

type ApiChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type OriginChatBody = {
  messages?: ApiChatMessage[];
};

type ApiRequest = {
  method?: string;
  body?: OriginChatBody | string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

function parseBody(body: OriginChatBody | string | undefined): OriginChatBody {
  if (!body) {
    return {};
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as OriginChatBody;
    } catch {
      return {};
    }
  }
  return body;
}

function resolveOpenRouterKey(): string {
  return (process.env.OPENROUTER_API_KEY ?? process.env.VITE_OPENROUTER_API_KEY ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function lastUserText(messages: ApiChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message?.role === "user" && message.content.trim()) {
      return message.content.trim();
    }
  }
  return "";
}

/** Last-resort when no OpenRouter key — keep the ship answering. */
function onboardFallback(userText: string): string {
  const q = userText.toLowerCase();
  if (!q.trim()) {
    return "Welcome to U. S. Jet.\n\nFlight Plan\nI'm Origin — ask about Hangar, Fleet, tiers, login, or a partner bay.";
  }
  if (/(price|tier|flight pass|hangar pro|enterprise)/.test(q)) {
    return "Welcome to U. S. Jet.\n\nFlight Plan\nStripe only: Flight Pass $19.90/mo, Hangar Pro $49.95/mo, Enterprise Commander $199.99/mo. Verify at /member/login.";
  }
  if (/(hangar|fleet|login|founder|intel|jet browser)/.test(q)) {
    return "Welcome to U. S. Jet.\n\nFlight Plan\nHangar (/), Fleet (/fleet), Jet Browser (/jet-browser), Intel (/intel). Login is Stripe-only at /member/login — no OAuth.";
  }
  return "Welcome to U. S. Jet.\n\nFlight Plan\nI can brief Hangar, Fleet bays, Jet Browser, tiers, Stripe login, and ops. Name a partner AI or ask how Flight Pass works.";
}

async function completeOpenRouter(apiKey: string, messages: ApiChatMessage[]): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://www.usjet.ai",
      "X-Title": "USJet AI Origin",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
    }),
  });

  const raw = await response.text();
  if (!response.ok) {
    let detail = raw;
    try {
      const parsed = JSON.parse(raw) as { error?: { message?: string } };
      detail = parsed.error?.message ?? raw;
    } catch {
      /* keep raw */
    }
    throw new Error(detail || `OpenRouter request failed (${response.status})`);
  }

  let data: { choices?: Array<{ message?: { content?: string | null } }> };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    throw new Error("Invalid JSON from OpenRouter");
  }

  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("No reply text from the model.");
  }
  return text.trim();
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = parseBody(req.body);
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array required" });
  }

  const hasSystem = messages.some((message) => message.role === "system");
  if (!hasSystem) {
    return res.status(400).json({ error: "system message required" });
  }

  const apiKey = resolveOpenRouterKey();
  if (!apiKey) {
    return res.status(200).json({
      reply: onboardFallback(lastUserText(messages)),
      source: "onboard-fallback",
    });
  }

  try {
    const reply = await completeOpenRouter(apiKey, messages);
    return res.status(200).json({ reply, source: "openrouter" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Origin chat failed";
    return res.status(502).json({ error: message });
  }
}
