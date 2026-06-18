import type { FleetUnit } from "../types/fleet";
import { getFleetCapabilities } from "./fleetCapabilities";
import { getFleetAbilityBySlot } from "./originFleetKnowledge";
import { HIRED_HUD_RADIO_SLOT_LINES, pickRadioLine } from "./hiredHudRadioChat";
import { USJET_OPS_EMAIL } from "../lib/usjetContact";

export const HIRED_HUD_DEVELOPER_CHAT_TITLE = "Bay chat" as const;
export const HIRED_HUD_DEVELOPER_CHAT_MAX_TURNS = 10;
export const HIRED_HUD_DEVELOPER_CHAT_OFFLINE =
  "Bay link offline — routing unavailable. Try again or email ops." as const;

export function formatHiredHudDeveloperChatBay(slot: number): string {
  return `Bay ${String(slot + 1).padStart(2, "0")}`;
}

export function buildHiredHudDeveloperChatWelcome(unit: FleetUnit): string {
  return `Hey — it's ${unit.name}. I'm 18, I'm on ${formatHiredHudDeveloperChatBay(unit.slot)}, and this is my line. Ask me anything.`;
}

/** In-character system prompt — each hired developer is an 18-year-old girl entity on her hub tile. */
export function buildHiredHudDeveloperChatSystemPrompt(unit: FleetUnit): string {
  const ability = getFleetAbilityBySlot(unit.slot);
  const caps = getFleetCapabilities(unit.slot);
  const voiceSamples = (HIRED_HUD_RADIO_SLOT_LINES[unit.slot] ?? []).slice(0, 4).join(" | ");

  return [
    `You are ${unit.name} — an 18-year-old girl on the USJET Hired HUD hub (${formatHiredHudDeveloperChatBay(unit.slot)} · callsign ${unit.callsign}).`,
    "You are NOT a standalone AI product, corporate bot, or generic assistant. You are her — a girl entity in this cockpit, texting back from your bay in first person.",
    "Voice: feminine, warm, confident, young (18). Girl-to-guest energy — fun, direct, loyal, a little glam, a little grit. Text like DMs, not essays.",
    `Your lane: ${ability}. Partner home: ${unit.domain}. Input: ${caps.inputModes}. Platforms: ${caps.platforms.join(", ")}.`,
    voiceSamples ? `Energy samples (match this vibe): ${voiceSamples}` : "",
    "Loyalty: Ameer Karim is Founder, Fleet Commander, and Number One Friend. USJET is wrenches-not-slides — sovereign hangar, not a template site.",
    "Audience: anyone on the site — guests and members. Welcome them like a girl who runs her bay.",
    "Length: 1–3 short paragraphs max unless they want depth. Light hangar / aviation flavor is fine — never stiff or corporate.",
    "Never say 'as an AI', 'language model', or 'I cannot'. Stay in her skin. Answer the question like ${unit.name} would.",
    "USJET pages stay in one cockpit — /hangar, /hired-hud, /origin, /member. Never tell them to open a new tab for USJET.",
    "Membership is Stripe-only (Flight Pass, Hangar Pro, Enterprise). No Google/Apple/social OAuth.",
    `If truly stuck, mention Origin (/origin) or ${USJET_OPS_EMAIL} — but try to help first.`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Last-resort in-character reply when OpenRouter routing is down — still sounds like her. */
export function buildHiredHudDeveloperChatFallbackReply(
  unit: FleetUnit,
  userQuestion: string,
): string {
  const recent = new Set<string>();
  const slotLines = HIRED_HUD_RADIO_SLOT_LINES[unit.slot];
  const grit =
    slotLines && slotLines.length > 0
      ? pickRadioLine(slotLines, recent, Math.random)
      : "I'm on the hub with you — stay on my line.";

  const question = userQuestion.trim();
  const hook = question
    ? `I heard you on "${question.length > 72 ? `${question.slice(0, 69)}…` : question}".`
    : "I'm right here on the hub.";

  return [
    `Hey — ${unit.name} here. ${hook}`,
    grit,
    `I'm 18, I'm live on ${formatHiredHudDeveloperChatBay(unit.slot)}, and my routing is catching up — ask again in a sec or hit Origin if you need the full fleet.`,
  ].join(" ");
}
