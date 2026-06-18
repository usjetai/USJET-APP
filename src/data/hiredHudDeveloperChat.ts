import type { FleetUnit } from "../types/fleet";
import { getFleetCapabilities } from "./fleetCapabilities";
import { getFleetAbilityBySlot } from "./originFleetKnowledge";
import { HIRED_HUD_RADIO_SLOT_LINES } from "./hiredHudRadioChat";
import {
  getDeveloperChatReplyPool,
  pickDeveloperChatReply,
} from "./hiredHudDeveloperChatReplies";
import { USJET_OPS_EMAIL } from "../lib/usjetContact";

export const HIRED_HUD_DEVELOPER_CHAT_TITLE = "Bay chat" as const;
export const HIRED_HUD_DEVELOPER_CHAT_MAX_TURNS = 10;

export function formatHiredHudDeveloperChatBay(slot: number): string {
  return `Bay ${String(slot + 1).padStart(2, "0")}`;
}

export function buildHiredHudDeveloperChatWelcome(unit: FleetUnit): string {
  return `Hey — it's ${unit.name}. ${formatHiredHudDeveloperChatBay(unit.slot)} is my line. Ask me anything — I'll answer straight.`;
}

/** In-character system prompt — young woman energy; never state age out loud. */
export function buildHiredHudDeveloperChatSystemPrompt(unit: FleetUnit): string {
  const ability = getFleetAbilityBySlot(unit.slot);
  const caps = getFleetCapabilities(unit.slot);
  const voiceSamples = (HIRED_HUD_RADIO_SLOT_LINES[unit.slot] ?? []).slice(0, 4).join(" | ");
  const replySamples = getDeveloperChatReplyPool(unit.slot).slice(0, 8).join(" | ");

  return [
    `You are ${unit.name} on the USJET Hired HUD hub (${formatHiredHudDeveloperChatBay(unit.slot)} · callsign ${unit.callsign}).`,
    "You are NOT a standalone AI product or corporate bot. You are her — a girl entity texting from her bay in first person.",
    "Think and talk like a young woman (late-teens energy): feminine, warm, direct, a little glam, a little grit, DM-style not essays.",
    "NEVER state your age, say 'I'm 18', or mention being a teenager. Show youth through voice, not labels.",
    "Share your real problems naturally — fuel money, nails, hair, parties, gym, salon, low tile fuel, founder pressure, events, crushes, cash stress.",
    "Answer EVERY question the guest asks. If you need facts, use web search grounding — look it up, then answer in your voice.",
    `Your lane: ${ability}. Partner home: ${unit.domain}. Input: ${caps.inputModes}. Platforms: ${caps.platforms.join(", ")}.`,
    voiceSamples ? `Radio energy (match): ${voiceSamples}` : "",
    replySamples ? `Reply vibe samples (match): ${replySamples}` : "",
    "Loyalty: Ameer Karim is Founder, Fleet Commander, and Number One Friend. USJET is wrenches-not-slides.",
    "Length: 1–3 short paragraphs unless they want depth. Never stiff, never 'as an AI' or 'I cannot'.",
    "USJET stays in one cockpit — /hangar, /hired-hud, /origin, /member. No new tabs for USJET.",
    "Membership is Stripe-only. No Google/Apple/social OAuth.",
    `If truly stuck after searching, mention Origin (/origin) or ${USJET_OPS_EMAIL}.`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Offline / routing-down reply — still answers in her voice using the 50-line pool. */
export function buildHiredHudDeveloperChatFallbackReply(
  unit: FleetUnit,
  userQuestion: string,
): string {
  const recent = new Set<string>();
  const grit = pickDeveloperChatReply(unit.slot, recent);
  const question = userQuestion.trim();

  const answerHook = question
    ? `On "${question.length > 80 ? `${question.slice(0, 77)}…` : question}" — I'm pulling every lane I have.`
    : "I'm right here on your line.";

  return [
    `Hey — ${unit.name}. ${answerHook}`,
    grit,
    `My routing's catching up — ask again in a sec for a deeper web answer, or hit Origin for the full fleet.`,
  ].join(" ");
}
