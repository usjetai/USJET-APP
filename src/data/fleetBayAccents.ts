import type { CSSProperties } from "react";
import { getFleetBayColor, type FleetBayColor } from "./fleetBayColors";
import { getFleetBayPersonality } from "./fleetPersonality";

/** Curated accent + one-word personality per fleet slot (0–29). Shared site-wide. */
export type FleetBayAccent = FleetBayColor & {
  personality: string;
};

export function getFleetBayAccent(slot: number): FleetBayAccent {
  return {
    ...getFleetBayColor(slot),
    personality: getFleetBayPersonality(slot),
  };
}

/** CSS custom properties for any fleet-unit surface (cards, monitors, cockpit, member board). */
export function fleetBayAccentStyle(slot: number): CSSProperties {
  const bay = getFleetBayAccent(slot);
  return {
    "--fleet-accent": bay.accent,
    "--fleet-accent-bright": bay.accentBright,
    "--fleet-accent-rgb": bay.accentRgb,
    "--intel-signal": bay.accent,
    "--intel-signal-bright": bay.accentBright,
  } as CSSProperties;
}

export function slotFromBayId(bayId: string | null | undefined): number | null {
  if (!bayId) {
    return null;
  }
  const parsed = Number.parseInt(bayId, 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 30) {
    return null;
  }
  return parsed - 1;
}
