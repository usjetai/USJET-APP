import type { FleetUnit } from "../types/fleet";

/** Resolve hangar bay href — always uses the hangar manifest entry, never fleet runway fallbacks. */
export function resolveHangarUnitHref(unit: FleetUnit): string {
  const trimmed = unit.href?.trim();
  if (trimmed) {
    return trimmed;
  }

  const host = unit.domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return host ? `https://${host}` : "/hangar";
}
