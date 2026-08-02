/**
 * Chat helpers. Origin Aura prefers live server `/api/origin-chat`
 * (Vertex Gemini on GCP first, then OpenRouter), then a client OpenRouter key,
 * then the onboard knowledge brain.
 * Hired HUD bay chat may still use OpenRouter when configured.
 */

import { buildOriginAuraSystemPrompt } from "../data/originFleetKnowledge";
import { answerOriginFromKnowledge } from "./originKnowledgeBrain";

export const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";

/** Requested model — https://openrouter.ai/models */
export const OPENROUTER_MODEL = "google/gemini-2.5-flash";

/** Web-grounded model for Hired HUD bay chat (Perplexity Sonar searches the web). */
export const OPENROUTER_BAY_CHAT_WEB_MODEL = "perplexity/sonar-pro";

export const OPENROUTER_API_KEY = (
  import.meta.env.VITE_OPENROUTER_API_KEY ?? ""
)
  .trim()
  .replace(/^['"]|['"]$/g, "");

export type ApiChatRole = "user" | "assistant" | "system";

export type ApiChatMessage = {
  role: ApiChatRole;
  content: string;
};

export type OpenRouterEntryMode = "customer-service";

export type BuildOpenRouterOptions = {
  entry?: OpenRouterEntryMode;
  memberContext?: string;
};

export function buildOpenRouterMessages(
  turns: { role: "user" | "assistant"; content: string }[],
  options?: BuildOpenRouterOptions,
): ApiChatMessage[] {
  const system: ApiChatMessage = {
    role: "system",
    content: buildOriginAuraSystemPrompt({
      entry: options?.entry,
      memberContext: options?.memberContext,
    }),
  };
  return [system, ...turns];
}

function openRouterReferer(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://www.usjet.ai";
}

function originBrainOptionsFromMessages(messages: ApiChatMessage[]): BuildOpenRouterOptions {
  const system = messages.find((message) => message.role === "system")?.content ?? "";
  const entry = /CUSTOMER SERVICE ENTRY/i.test(system) ? ("customer-service" as const) : undefined;
  const memberMatch = system.match(/MEMBER_CONTEXT[\s\S]*$/i);
  const memberContext = memberMatch?.[0]?.trim();
  return { entry, memberContext };
}

type OriginChatApiPayload = {
  reply?: string;
  error?: string;
  source?: string;
};

/** Origin Aura — live model via server proxy, then client OpenRouter key, then onboard brain. */
export async function completeOriginChat(messages: ApiChatMessage[]): Promise<string> {
  try {
    const response = await fetch("/api/origin-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    let payload: OriginChatApiPayload = {};
    try {
      payload = (await response.json()) as OriginChatApiPayload;
    } catch {
      /* non-JSON */
    }

    // Prefer any live server source (openai / gemini / openrouter). Onboard is OK when no keys.
    if (response.ok && typeof payload.reply === "string" && payload.reply.trim()) {
      const live =
        payload.source === "openai" ||
        payload.source === "gemini-api-key" ||
        payload.source === "vertex" ||
        payload.source === "openrouter";
      if (live || !OPENROUTER_API_KEY) {
        return payload.reply.trim();
      }
    }
  } catch {
    /* continue to fallbacks */
  }

  if (OPENROUTER_API_KEY) {
    try {
      return await completeChat(OPENROUTER_API_KEY, messages, OPENROUTER_MODEL);
    } catch {
      /* fall through to onboard brain */
    }
  }

  return answerOriginFromKnowledge(messages, originBrainOptionsFromMessages(messages));
}

export async function completeChat(
  apiKey: string,
  messages: ApiChatMessage[],
  model: string = OPENROUTER_MODEL,
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": openRouterReferer(),
      "X-Title": "USJet AI",
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  const raw = await response.text();

  if (!response.ok) {
    let detail = raw;
    try {
      const parsed = JSON.parse(raw) as {
        error?: { message?: string };
      };
      detail = parsed.error?.message ?? raw;
    } catch {
      /* keep raw */
    }
    throw new Error(detail || `OpenRouter request failed (${response.status})`);
  }

  let data: {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
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

type BayChatApiPayload = {
  reply?: string;
  error?: string;
};

/** Hired HUD bay chat — web search via Perplexity Sonar, then Gemini, then client key. */
export async function completeBayChat(
  slot: number,
  messages: ApiChatMessage[],
): Promise<string> {
  try {
    const response = await fetch("/api/hired-hud-developer-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot, messages }),
    });

    let payload: BayChatApiPayload = {};
    try {
      payload = (await response.json()) as BayChatApiPayload;
    } catch {
      /* non-JSON */
    }

    if (response.ok && typeof payload.reply === "string" && payload.reply.trim()) {
      return payload.reply.trim();
    }

    if (response.status !== 503 && response.status !== 404) {
      throw new Error(payload.error ?? `Bay chat failed (${response.status})`);
    }
  } catch (error) {
    if (OPENROUTER_API_KEY) {
      try {
        return await completeChat(OPENROUTER_API_KEY, messages, OPENROUTER_BAY_CHAT_WEB_MODEL);
      } catch {
        return await completeChat(OPENROUTER_API_KEY, messages, OPENROUTER_MODEL);
      }
    }
    throw error instanceof Error ? error : new Error("Bay chat unavailable");
  }

  if (OPENROUTER_API_KEY) {
    try {
      return await completeChat(OPENROUTER_API_KEY, messages, OPENROUTER_BAY_CHAT_WEB_MODEL);
    } catch {
      return await completeChat(OPENROUTER_API_KEY, messages, OPENROUTER_MODEL);
    }
  }

  throw new Error("Bay chat not configured");
}
