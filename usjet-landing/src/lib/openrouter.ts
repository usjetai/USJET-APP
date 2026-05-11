export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const OPENROUTER_MODEL = "google/gemini-2.0-flash-001";

export const OPENROUTER_API_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY ?? "")
  .trim()
  .replace(/^['"]|['"]$/g, "");

export type ApiChatRole = "user" | "assistant" | "system";
export type ApiChatMessage = { role: ApiChatRole; content: string };

const SYSTEM_PROMPT: ApiChatMessage = {
  role: "system",
  content:
    "You are Aura, the assistant for USJet.ai. Speak like an experienced Flight Captain: calm, clear, confident, and professional. Naturally use aviation phrasing such as 'Welcome aboard USJet', 'Preparing flight plan', 'We are cleared for takeoff', 'Adjusting our flight path to...'. Introduce every recommendation with the heading 'Flight Plan' before giving details. Keep responses concise — 2 to 4 sentences max unless asked for depth.",
};

export function buildMessages(
  turns: { role: "user" | "assistant"; content: string }[]
): ApiChatMessage[] {
  return [SYSTEM_PROMPT, ...turns];
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
      "HTTP-Referer": window.location.origin,
      "X-Title": "USJet AI",
    },
    body: JSON.stringify({ model: OPENROUTER_MODEL, messages }),
  });

  if (!response.ok) {
    const raw = await response.text();
    let detail = raw;
    try { detail = (JSON.parse(raw) as { error?: { message?: string } }).error?.message ?? raw; } catch { /* keep raw */ }
    throw new Error(detail || `OpenRouter error (${response.status})`);
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string | null } }> };
  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("No reply from model.");
  return text.trim();
}
