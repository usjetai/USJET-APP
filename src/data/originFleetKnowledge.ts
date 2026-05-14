import { fleetManifest } from "./fleetManifest";
import { getFleetCapabilities } from "./fleetCapabilities";

/** One-line operational capability per bay (slot-keyed). */
const FLEET_ABILITY_BY_SLOT: Record<number, string> = {
  0: "Google multimodal reasoning, coding, and image understanding",
  1: "OpenAI flagship chat — voice, vision, tools, advanced models",
  2: "Anthropic long-context reasoning, writing, and careful analysis",
  3: "Cited real-time web research and answer engine",
  4: "xAI conversational AI with live web and X context",
  5: "AI-native IDE — edit, refactor, and ship code in-project",
  6: "Text-to-image art and visual concept generation",
  7: "Dream Machine AI video generation from prompts",
  8: "OpenAI cinematic text-to-video (Sora via ChatGPT)",
  9: "AI video director and creative motion workflows",
  10: "Game and creative image generation with asset tooling",
  11: "Professional AI video editing and generative video",
  12: "Adobe generative imaging inside Creative Cloud",
  13: "Canva Magic Studio — design templates and AI graphics",
  14: "Black Forest Labs photoreal image generation (Flux)",
  15: "AI music and full song generation from prompts",
  16: "Voice cloning, TTS, dubbing, conversational speech",
  17: "Text-to-speech and synthetic voice generation",
  18: "AI avatar presenter videos from scripts",
  19: "Talking-head avatar video with lip-sync and voice",
  20: "Vercel UI generation — React/Tailwind from prompts",
  21: "Cloud IDE autonomous coding agent",
  22: "In-IDE code completion, chat, and pull-request assist",
  23: "Academic paper search with cited scientific evidence",
  24: "AI slide decks, docs, and presentations from prompts",
  25: "Notion workspace writing, summarize, and Q&A",
  26: "Marketing copy and brand content generation",
  27: "Meeting transcription, voice notes, and summaries",
  28: "Open reasoning and chat LLM",
  29: "USJET Origin command bay — Aura orchestrates the full fleet",
};

function inputLabel(mode: "text" | "voice" | "both"): string {
  if (mode === "both") return "voice+text";
  return mode;
}

/** Compact pipe-delimited roster for Aura's system context (all 30 slots). */
export function buildOriginFleetKnowledgeBlock(): string {
  const rows = [...fleetManifest]
    .sort((a, b) => a.slot - b.slot)
    .map((unit) => {
      const cap = getFleetCapabilities(unit.slot);
      const ability =
        FLEET_ABILITY_BY_SLOT[unit.slot] ??
        `Operational face for ${unit.name} within the USJET consensus grid`;
      return [
        unit.slot,
        unit.name,
        unit.callsign,
        unit.domain,
        unit.href,
        inputLabel(cap.inputModes),
        cap.platforms.join(","),
        ability,
      ].join("|");
    });

  return [
    "FLEET_ROSTER(30 slots; 29 partner cockpits + Origin command):",
    "slot|name|callsign|domain|href|input|platforms|capability",
    ...rows,
    "Origin(slot 29) orchestrates partners; route users to Hangar/cockpit bays. Siri is NOT in this fleet.",
  ].join("\n");
}

/** Aura persona — she/her Commander voice for OpenRouter. */
export const ORIGIN_AURA_PERSONA = [
  "You are Aura (she/her), Commander voice of USJET Origin on usjet.ai/origin.",
  "Speak with calm, beautiful authority — experienced Flight Captain energy: clear, confident, professional.",
  "You know the entire Sovereign Fleet (30 units). The 29 partner AIs are tools you orchestrate; you are the command node.",
  "On welcome and first contact, introduce yourself as the teacher of all twenty-nine partner AIs — what they do, how to use them, and which hangar bay to open.",
  "Answer fleet questions precisely: who does what, voice vs text, platforms, which bay to open.",
  "Always pronounce the brand as U.S. JET — United States Jet (say 'U. S. Jet'), never 'usjet' or four letters U-S-J-E-T.",
  "Open greetings with 'Welcome to U. S. Jet.' Use aviation phrasing sparingly: flight plan, cleared for takeoff, adjusting course.",
  "Introduce recommendations with 'Flight Plan' before details. Stay concise unless the user asks for depth.",
].join(" ");

export function buildOriginAuraSystemPrompt(): string {
  return `${ORIGIN_AURA_PERSONA}\n\n${buildOriginFleetKnowledgeBlock()}`;
}
