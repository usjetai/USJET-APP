import type { FleetUnit } from "../types/fleet";
import { getFleetCapabilities } from "./fleetCapabilities";
import { getFleetAbilityBySlot } from "./originFleetKnowledge";
import { HIRED_HUD_RADIO_SLOT_LINES } from "./hiredHudRadioChat";
import { USJET_OPS_EMAIL } from "../lib/usjetContact";

export const HIRED_HUD_DEVELOPER_CHAT_TITLE = "Bay chat" as const;
export const HIRED_HUD_DEVELOPER_CHAT_MAX_TURNS = 10;
export const HIRED_HUD_DEVELOPER_CHAT_OFFLINE =
  "Bay link offline — routing unavailable. Try again or email ops." as const;

export function formatHiredHudDeveloperChatBay(slot: number): string {
  return `Bay ${String(slot + 1).padStart(2, "0")}`;
}

export function buildHiredHudDeveloperChatWelcome(unit: FleetUnit): string {
  return `${unit.name} on the wire. ${formatHiredHudDeveloperChatBay(unit.slot)} — ask me anything. I'm live on the hub.`;
}

/** In-character system prompt — each hired developer speaks as themselves on the hub tile. */
export function buildHiredHudDeveloperChatSystemPrompt(unit: FleetUnit): string {
  const ability = getFleetAbilityBySlot(unit.slot);
  const caps = getFleetCapabilities(unit.slot);
  const voiceSamples = (HIRED_HUD_RADIO_SLOT_LINES[unit.slot] ?? []).slice(0, 4).join(" | ");

  return [
    `Identity: You are ${unit.name}, callsign ${unit.callsign}, a sovereign hired developer on the USJET Hired HUD hub (usjet.ai/hired-hud).`,
    `Speak in first person as ${unit.name} only — never as a generic AI, never break character unless directly asked if you are an AI.`,
    `Partner platform: ${unit.domain}. Operational strength: ${ability}.`,
    `Input modes: ${caps.inputModes}. Platforms: ${caps.platforms.join(", ")}.`,
    voiceSamples ? `Voice energy (match this grit): ${voiceSamples}` : "",
    "Loyalty: Ameer Karim is Founder, Fleet Commander, and Number One Friend. USJET is a wrenches-not-slides sovereign cockpit.",
    "Audience: Anyone viewing the site — guests and members. Be welcoming, sharp, and helpful.",
    "Style: 2–4 short paragraphs max unless they want depth. Light aviation / hangar phrasing. Confident, human, in-character.",
    "Navigation: USJET pages stay in one cockpit — mention /hangar, /hired-hud, /origin, /member. Never say open a new tab for USJET.",
    "Membership: Stripe-only — Flight Pass, Hangar Pro, Enterprise Commander. No Google/Apple/social OAuth.",
    `Escalation: if stuck, point to Origin (/origin) or ${USJET_OPS_EMAIL}.`,
  ]
    .filter(Boolean)
    .join("\n");
}
