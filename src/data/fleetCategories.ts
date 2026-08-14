/**
 * Zero-dependency category lookup, kept separate from fleetDirectorySeo.ts
 * (which does eager module-scope computation over the fleet manifest) so
 * lightweight, widely-shared components like FleetCard can show a bay's
 * category without pulling in that heavier module.
 */
export const CATEGORY_BY_SLOT: Record<number, string> = {
  0: "AI for creative & social presence",
  1: "AI for operators & field teams",
  2: "AI for long-form analysis & compliance",
  3: "AI for logistics & cited web research",
  4: "AI for real-time intelligence",
  5: "AI for software & fleet maintenance (code)",
  6: "AI for creative production",
  7: "AI for video & media ops",
  8: "AI for cinematic video",
  9: "AI for motion graphics",
  10: "AI for game & asset pipelines",
  11: "AI for professional video editing",
  12: "AI for brand & design systems",
  13: "AI for research & multimodal reasoning",
  14: "AI for photoreal imaging",
  15: "AI for audio & soundtrack",
  16: "AI for voice & dubbing",
  17: "AI for text-to-speech",
  18: "AI for training & presenter video",
  19: "AI for avatar video",
  20: "AI for rapid UI development",
  21: "AI for cloud development",
  22: "AI for enterprise code review",
  23: "AI for evidence & R&D",
  24: "AI for decks & investor updates",
  25: "AI for operations documentation",
  26: "AI for marketing copy",
  27: "AI for meeting notes & field voice",
  28: "AI for reasoning & chat",
  29: "AI command node — sovereign fleet orchestration",
};

export function getFleetCategory(slot: number): string {
  return CATEGORY_BY_SLOT[slot] ?? "AI for professional work";
}
