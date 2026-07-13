import type { FleetCapabilities, FleetPlatform } from "../types/fleet";

const DEFAULT_CAPABILITIES: FleetCapabilities = {
  inputModes: "text",
  platforms: ["web"],
};

/** Partner capability matrix — slot-keyed; defaults to web + text when unknown. */
const FLEET_CAPABILITIES_BY_SLOT: Record<number, FleetCapabilities> = {
  // Conversational LLMs
  0: { inputModes: "both", platforms: ["web", "ios", "android"] }, // Gemini
  1: { inputModes: "both", platforms: ["web", "mac", "windows", "ios", "android"] }, // ChatGPT
  2: { inputModes: "both", platforms: ["web", "mac", "ios", "android"] }, // Claude
  3: { inputModes: "both", platforms: ["web", "mac", "ios", "android"] }, // Perplexity
  4: { inputModes: "both", platforms: ["web", "ios", "android"] }, // Grok (X / grok.com)
  5: { inputModes: "text", platforms: ["mac", "windows"] }, // Cursor IDE
  // Creative / media
  6: { inputModes: "text", platforms: ["web"] }, // Midjourney (web + Discord)
  7: { inputModes: "text", platforms: ["web"] }, // Luma Dream Machine
  8: { inputModes: "text", platforms: ["web"] }, // Sora (ChatGPT web)
  9: { inputModes: "text", platforms: ["web"] }, // Higgsfield
  10: { inputModes: "text", platforms: ["web"] }, // Leonardo.ai
  11: { inputModes: "text", platforms: ["web"] }, // Runway
  12: { inputModes: "text", platforms: ["web"] }, // Adobe Firefly
  13: { inputModes: "text", platforms: ["web", "ios", "android"] }, // Canva Magic
  14: { inputModes: "text", platforms: ["web"] }, // Flux.1 Pro
  // Audio / voice
  15: { inputModes: "both", platforms: ["web", "ios", "android"] }, // Suno
  16: { inputModes: "both", platforms: ["web"] }, // ElevenLabs (TTS + voice clone)
  17: { inputModes: "both", platforms: ["web"] }, // Play.ht
  18: { inputModes: "text", platforms: ["web"] }, // Synthesia
  19: { inputModes: "both", platforms: ["web"] }, // HeyGen (avatar + voice)
  // Dev / productivity
  20: { inputModes: "text", platforms: ["web"] }, // v0.dev
  21: { inputModes: "text", platforms: ["web"] }, // Replit Agent
  22: { inputModes: "text", platforms: ["web", "mac", "windows"] }, // GitHub Copilot (IDE + web)
  23: { inputModes: "text", platforms: ["web"] }, // Consensus
  24: { inputModes: "text", platforms: ["web"] }, // Gamma
  25: { inputModes: "text", platforms: ["web", "mac", "windows", "ios", "android"] }, // Notion AI
  26: { inputModes: "text", platforms: ["web"] }, // Jasper
  27: { inputModes: "both", platforms: ["web", "ios", "android"] }, // Otter.ai (voice-first)
  28: { inputModes: "text", platforms: ["web", "ios", "android"] }, // DeepSeek
  29: { inputModes: "both", platforms: ["web"] }, // USJet Origin
};

export function getFleetCapabilities(slot: number): FleetCapabilities {
  return FLEET_CAPABILITIES_BY_SLOT[slot] ?? DEFAULT_CAPABILITIES;
}

/** Partner AI product label on runway tiles (slot 0–29). */
export const FLEET_PARTNER_LABEL_BY_SLOT: Record<number, string> = {
  0: "Gemini",
  1: "ChatGPT",
  2: "Claude",
  3: "Perplexity",
  4: "Grok",
  5: "Cursor",
  6: "Midjourney",
  7: "Luma Dream Machine",
  8: "Sora",
  9: "Higgsfield",
  10: "Leonardo.ai",
  11: "Runway",
  12: "Adobe Firefly",
  13: "Canva Magic Studio",
  14: "Flux.1 Pro",
  15: "Suno",
  16: "ElevenLabs",
  17: "Play.ht",
  18: "Synthesia",
  19: "HeyGen",
  20: "v0.dev",
  21: "Replit Agent",
  22: "GitHub Copilot",
  23: "Consensus",
  24: "Gamma",
  25: "Notion AI",
  26: "Jasper",
  27: "Otter.ai",
  28: "DeepSeek",
  29: "Origin · Aura",
};

export function getFleetPartnerLabel(slot: number): string {
  return FLEET_PARTNER_LABEL_BY_SLOT[slot] ?? "Partner AI";
}

export const PLATFORM_LABELS: Record<FleetPlatform, string> = {
  web: "Web",
  mac: "Mac app",
  windows: "PC app",
  ios: "iOS",
  android: "Android",
};
