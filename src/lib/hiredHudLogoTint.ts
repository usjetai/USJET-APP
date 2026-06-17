import { FLEET_HIRED_SLOTS } from "../data/fleetRoster";

export type HiredHudLogoTint = "pink" | "red";

/** Hired HUD only — alternating roster order yields exactly 5 pink + 5 red overlays. */
const HIRED_HUD_PINK_LOGO_SLOTS = new Set(
  FLEET_HIRED_SLOTS.filter((_, index) => index % 2 === 0),
);

export function getHiredHudLogoTint(slot: number): HiredHudLogoTint {
  return HIRED_HUD_PINK_LOGO_SLOTS.has(slot) ? "pink" : "red";
}
