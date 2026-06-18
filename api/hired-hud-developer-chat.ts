/**
 * Server proxy for Hired HUD per-developer bay chat — keeps OpenRouter key off the client.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemini-2.0-flash-001";

/** Hired developer slots cleared on the Hired HUD hub roster. */
const HIRED_HUD_CHAT_SLOTS = new Set([0, 1, 2, 3, 5, 6, 10, 11, 13, 25]);

type ApiChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type DeveloperChatBody = {
  slot?: number;
  messages?: ApiChatMessage[];
};

type ApiRequest = {
  method?: string;
  body?: DeveloperChatBody | string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

function parseBody(body: DeveloperChatBody | string | undefined): DeveloperChatBody {
  if (!body) {
    return {};
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as DeveloperChatBody;
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

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = resolveOpenRouterKey();
  if (!apiKey) {
    return res.status(503).json({ error: "Developer bay chat is not configured on the server." });
  }

  const { slot, messages } = parseBody(req.body);
  if (typeof slot !== "number" || !HIRED_HUD_CHAT_SLOTS.has(slot)) {
    return res.status(400).json({ error: "Valid hired developer slot required." });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array required" });
  }

  const hasSystem = messages.some((message) => message.role === "system");
  if (!hasSystem) {
    return res.status(400).json({ error: "system message required" });
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://www.usjet.ai",
        "X-Title": "USJet AI",
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
      return res.status(response.status).json({
        error: detail || `OpenRouter request failed (${response.status})`,
      });
    }

    let data: {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      return res.status(502).json({ error: "Invalid JSON from OpenRouter" });
    }

    const reply = data.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(502).json({ error: "No reply text from the model." });
    }

    return res.status(200).json({ reply: reply.trim() });
  } catch {
    return res.status(502).json({ error: "Developer bay chat link failed — try again." });
  }
}
