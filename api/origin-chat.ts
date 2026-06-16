/**
 * Server proxy for Origin Aura — keeps OpenRouter key off the client bundle.
 * Set OPENROUTER_API_KEY (preferred) or VITE_OPENROUTER_API_KEY in Vercel Production.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemini-2.0-flash-001";

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

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = resolveOpenRouterKey();
  if (!apiKey) {
    return res.status(503).json({ error: "Origin Aura is not configured on the server." });
  }

  const { messages } = parseBody(req.body);
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array required" });
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
    return res.status(502).json({ error: "Origin Aura link failed — try again." });
  }
}
