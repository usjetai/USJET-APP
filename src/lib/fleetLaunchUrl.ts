/**
 * Resolves a fleet unit's launch URL for Hangar / Fleet cards.
 * External partners open in a new tab; internal USJET routes stay in-app.
 */
export function fleetLaunchUrl(domain: string, href?: string): string {
  const trimmed = href?.trim();

  if (trimmed?.startsWith("/")) {
    return trimmed;
  }

  if (trimmed && /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const host = domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return `https://${host}`;
}

export function isExternalFleetUrl(url: string): boolean {
  return !url.startsWith("/");
}
