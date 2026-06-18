import {
  buildHiredHudDeveloperChatSystemPrompt,
  HIRED_HUD_DEVELOPER_CHAT_OFFLINE,
} from "../data/hiredHudDeveloperChat";
import type { FleetUnit } from "../types/fleet";
import {
  completeChat,
  OPENROUTER_API_KEY,
  type ApiChatMessage,
} from "./openrouter";

export type HiredHudDeveloperChatTurn = {
  role: "user" | "assistant";
  content: string;
};

type DeveloperChatApiPayload = {
  reply?: string;
  error?: string;
};

export function buildHiredHudDeveloperChatMessages(
  unit: FleetUnit,
  turns: readonly HiredHudDeveloperChatTurn[],
): ApiChatMessage[] {
  return [
    { role: "system", content: buildHiredHudDeveloperChatSystemPrompt(unit) },
    ...turns,
  ];
}

/** Hub tile developer chat — server proxy first, client OpenRouter key for local dev. */
export async function completeHiredHudDeveloperChat(
  unit: FleetUnit,
  turns: readonly HiredHudDeveloperChatTurn[],
): Promise<string> {
  const messages = buildHiredHudDeveloperChatMessages(unit, turns);

  try {
    const response = await fetch("/api/hired-hud-developer-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot: unit.slot, messages }),
    });

    let payload: DeveloperChatApiPayload = {};
    try {
      payload = (await response.json()) as DeveloperChatApiPayload;
    } catch {
      /* non-JSON */
    }

    if (response.ok && typeof payload.reply === "string" && payload.reply.trim()) {
      return payload.reply.trim();
    }

    if (response.status !== 503 && response.status !== 404) {
      throw new Error(payload.error ?? `Developer chat failed (${response.status})`);
    }
  } catch (error) {
    if (OPENROUTER_API_KEY) {
      return completeChat(OPENROUTER_API_KEY, messages);
    }
    throw error instanceof Error ? error : new Error(HIRED_HUD_DEVELOPER_CHAT_OFFLINE);
  }

  if (OPENROUTER_API_KEY) {
    return completeChat(OPENROUTER_API_KEY, messages);
  }

  throw new Error(HIRED_HUD_DEVELOPER_CHAT_OFFLINE);
}
