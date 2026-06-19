import type { FleetUnit } from "../types/fleet";

/**
 * Canonical partner launch URLs — bays 01–30.
 * Protect Ameer Karim's vision: every external bay resolves to a live partner, never a dead deployment.
 */
export const FLEET_PARTNER_HREFS: Record<number, string> = {
  0: "https://gemini.google.com/",
  1: "https://chatgpt.com",
  2: "https://claude.ai",
  3: "https://www.perplexity.ai",
  4: "https://grok.com",
  5: "https://cursor.com",
  6: "https://www.midjourney.com",
  7: "https://lumalabs.ai/dream-machine",
  8: "https://chatgpt.com",
  9: "https://higgsfield.ai",
  10: "https://leonardo.ai",
  11: "https://runway.com",
  12: "https://firefly.adobe.com",
  13: "https://gemini.google.com/app",
  14: "https://bfl.ai",
  15: "https://suno.com",
  16: "https://elevenlabs.io",
  17: "https://play.ht",
  18: "https://synthesia.io",
  19: "https://www.heygen.com",
  20: "https://v0.dev",
  21: "https://replit.com/refer/USJET",
  22: "https://github.com/features/copilot",
  23: "https://consensus.app",
  24: "https://gamma.app",
  25: "https://www.notion.so/product/ai",
  26: "https://jasper.ai",
  27: "https://otter.ai",
  28: "https://chat.deepseek.com",
  29: "/origin",
};

/** @deprecated Use FLEET_PARTNER_HREFS */
export const TOP_TIER_PARTNER_HREFS = FLEET_PARTNER_HREFS;

/** Resolve a fleet unit href — never returns empty for external bays. */
export function resolveFleetUnitHref(unit: FleetUnit): string {
  const trimmed = unit.href?.trim();

  if (trimmed?.startsWith("/")) {
    return trimmed;
  }

  if (trimmed && /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const fallback = FLEET_PARTNER_HREFS[unit.slot];
  if (fallback) {
    return fallback;
  }

  const host = unit.domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return `https://${host}`;
}
