/**
 * Resolves a fleet unit's launch URL for Hangar / Fleet cards.
 * External partners open in a new tab; internal USJET routes stay in-app.
 */
import { FLEET_PARTNER_HREFS } from "./fleetManifestAudit";

export function fleetLaunchUrl(domain: string, href?: string, slot?: number): string {
  const trimmed = href?.trim();

  if (trimmed?.startsWith("/")) {
    return trimmed;
  }

  if (trimmed && /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (typeof slot === "number" && FLEET_PARTNER_HREFS[slot] && !FLEET_PARTNER_HREFS[slot].startsWith("/")) {
    return FLEET_PARTNER_HREFS[slot];
  }

  const host = domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return `https://${host}`;
}

export function isExternalFleetUrl(url: string): boolean {
  return !url.startsWith("/");
}
