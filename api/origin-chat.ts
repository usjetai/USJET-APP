/**
 * Origin Aura chat — OpenAI first (same key as Realtime), then Gemini/Vertex,
 * then OpenRouter, then onboard knowledge. Keys stay server-side.
 */

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

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_CHAT_MODEL = "gpt-4o-mini";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemini-2.5-flash";

function trimEnv(value: string | undefined): string {
  return (value ?? "").trim().replace(/^['"]|['"]$/g, "");
}

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

function lastUserText(messages: ApiChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message?.role === "user" && message.content.trim()) {
      return message.content.trim();
    }
  }
  return "";
}

function isFirstUserTurn(messages: ApiChatMessage[]): boolean {
  return messages.filter((message) => message.role === "user").length <= 1;
}

/** Last-resort when no live model key — keep the ship answering without Welcome spam. */
function onboardFallback(userText: string, firstTurn: boolean): string {
  const q = userText.toLowerCase();
  const greet = firstTurn ? "I'm Origin — onboard command. " : "";
  if (!q.trim()) {
    return `${greet}Ask about Hangar, Fleet, tiers, login, or a partner bay.`;
  }
  if (/(price|tier|flight pass|hangar pro|enterprise)/.test(q)) {
    return `${greet}Stripe only: Flight Pass $19.90/mo, Hangar Pro $49.95/mo, Enterprise Commander $199.99/mo. Verify at /member/login.`;
  }
  if (/(hangar|fleet|login|founder|intel|jet browser)/.test(q)) {
    return `${greet}Hangar (/), Fleet (/fleet), Jet Browser (/jet-browser), Intel (/intel). Login is Stripe-only at /member/login — no OAuth.`;
  }
  return `${greet}I can brief Hangar, Fleet bays, Jet Browser, tiers, Stripe login, and ops. Name a partner AI or ask how Flight Pass works.`;
}

function extractOpenAiStyleReply(raw: string): string {
  let data: { choices?: Array<{ message?: { content?: string | null } }> };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    throw new Error("Invalid JSON from chat provider");
  }
  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("No reply text from the model.");
  }
  return text.trim();
}

async function completeOpenAI(apiKey: string, messages: ApiChatMessage[]): Promise<string> {
  const response = await fetch(OPENAI_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: trimEnv(process.env.OPENAI_ORIGIN_MODEL) || OPENAI_CHAT_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 900,
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
    throw new Error(detail || `OpenAI request failed (${response.status})`);
  }

  return extractOpenAiStyleReply(raw);
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

  return extractOpenAiStyleReply(raw);
}

type VertexModule = {
  completeGeminiApiKey: (messages: ApiChatMessage[]) => Promise<string>;
  completeVertexGemini: (messages: ApiChatMessage[]) => Promise<string>;
  resolveGeminiApiKey: () => string;
  resolveVertexConfig: () => unknown;
};

async function loadVertexModule(): Promise<VertexModule | null> {
  try {
    return (await import("./vertexGemini")) as VertexModule;
  } catch {
    return null;
  }
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

    const firstTurn = isFirstUserTurn(messages);

    // 1) OpenAI — same production key family as Origin Realtime / TTS.
    try {
      const openAiKey = trimEnv(process.env.OPENAI_API_KEY);
      if (openAiKey) {
        const reply = await completeOpenAI(openAiKey, messages);
        return res.status(200).json({ reply, source: "openai" });
      }
    } catch {
      /* continue */
    }

    // 2) Gemini API key / Vertex — optional module; never crash cold start.
    try {
      const vertex = await loadVertexModule();
      if (vertex?.resolveGeminiApiKey?.()) {
        const reply = await vertex.completeGeminiApiKey(messages);
        return res.status(200).json({ reply, source: "gemini-api-key" });
      }
      if (vertex?.resolveVertexConfig?.()) {
        const reply = await vertex.completeVertexGemini(messages);
        return res.status(200).json({ reply, source: "vertex" });
      }
    } catch {
      /* continue */
    }

    // 3) OpenRouter
    try {
      const openRouterKey = trimEnv(
        process.env.OPENROUTER_API_KEY ?? process.env.VITE_OPENROUTER_API_KEY,
      );
      if (openRouterKey) {
        const reply = await completeOpenRouter(openRouterKey, messages);
        return res.status(200).json({ reply, source: "openrouter" });
      }
    } catch {
      /* continue */
    }

    // 4) Onboard knowledge — never 500 the chat box.
    return res.status(200).json({
      reply: onboardFallback(lastUserText(messages), firstTurn),
      source: "onboard-fallback",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Origin chat server error";
    return res.status(200).json({
      reply: onboardFallback("", true),
      source: "onboard-fallback-error",
      error: message,
    });
  }
}
