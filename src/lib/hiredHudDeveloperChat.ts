import {
  buildHiredHudDeveloperChatFallbackReply,
  buildHiredHudDeveloperChatSystemPrompt,
} from "../data/hiredHudDeveloperChat";
import type { FleetUnit } from "../types/fleet";
import { completeOriginChat, type ApiChatMessage } from "./openrouter";

export type HiredHudDeveloperChatTurn = {
  role: "user" | "assistant";
  content: string;
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

/** Hub tile developer chat — same Origin/OpenRouter pipe, then in-character fallback. */
export async function completeHiredHudDeveloperChat(
  unit: FleetUnit,
  turns: readonly HiredHudDeveloperChatTurn[],
): Promise<string> {
  const messages = buildHiredHudDeveloperChatMessages(unit, turns);
  const lastQuestion = [...turns].reverse().find((turn) => turn.role === "user")?.content ?? "";

  try {
    return await completeOriginChat(messages);
  } catch {
    return buildHiredHudDeveloperChatFallbackReply(unit, lastQuestion);
  }
}
