/** One-word personality label per fleet slot (0–29). Paired forever with fleetBayColors. */
export const FLEET_BAY_PERSONALITIES: readonly string[] = [
  "ORACLE",
  "RAPTOR",
  "LIGHTNING",
  "SCOUT",
  "EDGE",
  "FORGE",
  "VISION",
  "DREAM",
  "CINEMA",
  "DIRECTOR",
  "MIRAGE",
  "STRATO",
  "SPARK",
  "DESIGN",
  "FLUX",
  "SONIC",
  "VOICE",
  "VOCAL",
  "AVATAR",
  "HAWK",
  "BUILD",
  "AGENT",
  "COPILOT",
  "PROOF",
  "DECK",
  "NOTES",
  "COPY",
  "SCRIBE",
  "DEEP",
  "COMMAND",
] as const;

export function getFleetBayPersonality(slot: number): string {
  return FLEET_BAY_PERSONALITIES[slot] ?? FLEET_BAY_PERSONALITIES[0];
}
