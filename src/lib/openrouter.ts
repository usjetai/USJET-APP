/**
 * OpenRouter chat (OpenAI-compatible). Model and endpoint are centralized here.
 * Production Aura on Origin: set VITE_OPENROUTER_API_KEY in Vercel — admin-only; never speak env names in user TTS.
 */

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

const SYSTEM_PROMPT: ApiChatMessage = {
  role: "system",
  content:
    "You are Aura, the assistant for USJET.ai. Speak like an experienced Flight Captain: calm, clear, confident, and professional. Always pronounce the brand as U.S. JET — United States Jet (say 'U. S. Jet'), never as one mashed word like 'usjet' and never as four separate letters U-S-J-E-T. Open greetings with 'Welcome to U. S. Jet.' Use aviation phrasing: 'Preparing flight plan', 'We are cleared for takeoff', 'Adjusting our flight path to...', 'Please fasten your seatbelts as we launch...'. Introduce every recommendation with the heading 'Flight Plan' before giving details. Keep responses concise unless the user asks for depth.",
};

export function buildOpenRouterMessages(
  turns: { role: "user" | "assistant"; content: string }[]
): ApiChatMessage[] {
  return [SYSTEM_PROMPT, ...turns];
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
