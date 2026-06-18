import {
  buildHiredHudDeveloperChatFallbackReply,
  buildHiredHudDeveloperChatSystemPrompt,
} from "../data/hiredHudDeveloperChat";
import type { FleetUnit } from "../types/fleet";
import { completeBayChat, type ApiChatMessage } from "./openrouter";

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

/** Hub tile chat — Perplexity Sonar web search, then in-character fallback pool. */
export async function completeHiredHudDeveloperChat(
  unit: FleetUnit,
  turns: readonly HiredHudDeveloperChatTurn[],
): Promise<string> {
  const messages = buildHiredHudDeveloperChatMessages(unit, turns);
  const lastQuestion = [...turns].reverse().find((turn) => turn.role === "user")?.content ?? "";

  try {
    return await completeBayChat(unit.slot, messages);
  } catch {
    return buildHiredHudDeveloperChatFallbackReply(unit, lastQuestion);
  }
}
