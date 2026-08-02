/**
 * Origin Aura chat — Gemini API key or Vertex (GCP) first, then OpenRouter, then onboard.
 * Keys stay server-side. /origin page is unchanged.
 */

import {
  completeGeminiApiKey,
  completeVertexGemini,
  resolveGeminiApiKey,
  resolveVertexConfig,
} from "./vertexGemini";

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

/** Last-resort when no live model key — keep the ship answering. */
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

async function completeFreeInference(messages: ApiChatMessage[]): Promise<string> {
  const response = await fetch("https://text.pollinations.ai/openai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      model: "openai",
    }),
  });

  if (!response.ok) {
    throw new Error(`Free AI endpoint failed (${response.status})`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("No reply text from free AI model.");
  }
  return text.trim();
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { messages } = parseBody(req.body);
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }

    // 1) Gemini API key
    try {
      if (resolveGeminiApiKey()) {
        const reply = await completeGeminiApiKey(messages);
        return res.status(200).json({ reply, source: "gemini-api-key" });
      }
    } catch {
      /* continue */
    }

    // 2) Vertex AI
    try {
      if (resolveVertexConfig()) {
        const reply = await completeVertexGemini(messages);
        return res.status(200).json({ reply, source: "vertex" });
      }
    } catch {
      /* continue */
    }

    // 3) OpenRouter Key
    try {
      const apiKey = resolveOpenRouterKey();
      if (apiKey) {
        const reply = await completeOpenRouter(apiKey, messages);
        return res.status(200).json({ reply, source: "openrouter" });
      }
    } catch {
      /* continue */
    }

    // 4) Live Free AI Inference
    try {
      const reply = await completeFreeInference(messages);
      return res.status(200).json({ reply, source: "free-inference" });
    } catch {
      return res.status(200).json({
        reply: onboardFallback(lastUserText(messages)),
        source: "onboard-fallback",
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Origin chat server error";
    return res.status(200).json({
      reply: onboardFallback(""),
      source: "onboard-fallback-error",
      error: message,
    });
  }
}
