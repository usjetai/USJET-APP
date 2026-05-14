/**
 * OpenRouter chat (OpenAI-compatible). Model and endpoint are centralized here.
 * Production Aura on Origin: set VITE_OPENROUTER_API_KEY in Vercel — admin-only; never speak env names in user TTS.
 */

import { buildOriginAuraSystemPrompt } from "../data/originFleetKnowledge";

export const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";

/** Requested model — https://openrouter.ai/models */
export const OPENROUTER_MODEL = "google/gemini-2.0-flash-001";

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

export async function completeChat(
  apiKey: string,
  messages: ApiChatMessage[]
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
      model: OPENROUTER_MODEL,
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
