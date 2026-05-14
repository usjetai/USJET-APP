/**
 * Resolves fleet launch URLs and wraps external partners in the USJET cockpit shell
 * so the return bar stays visible — Integrated Navigation without leaving the ship.
 *
 * Trusted Fleet Launch: first visit = sovereign handoff interstitial; repeat visits
 * carry handoff=trusted and skip embed wait (partners control X-Frame-Options).
 */
import { FLEET_PARTNER_HREFS } from "./fleetManifestAudit";

export const FLEET_TRUSTED_STORAGE_PREFIX = "usjet-fleet-trusted-" as const;

export function fleetBayIdFromSlot(slot?: number): string | null {
  if (typeof slot !== "number") {
    return null;
  }
  return String(slot + 1).padStart(2, "0");
}

export function trustedFleetStorageKey(bayId: string): string {
  return `${FLEET_TRUSTED_STORAGE_PREFIX}${bayId}`;
}

/** Browser remembers authorized handoff after first sovereign launch. */
export function isFleetBayTrusted(bayId: string | null | undefined): boolean {
  if (!bayId || typeof window === "undefined") {
    return false;
  }
  try {
    const raw = localStorage.getItem(trustedFleetStorageKey(bayId));
    return raw !== null && raw !== "";
  } catch {
    return false;
  }
}

export function markFleetBayTrusted(bayId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(trustedFleetStorageKey(bayId), String(Date.now()));
  } catch {
    // storage full or private mode
  }
}

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

export function sanitizeCockpitSrc(raw: string | null): string | null {
  if (!raw?.trim()) {
    return null;
  }

  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

type CockpitWrapOptions = {
  slot?: number;
  returnTo?: string;
  label?: string;
};

/** Route external partner URLs through /cockpit so the USJET return bar stays mounted. */
export function integratedLaunchUrl(
  domain: string,
  href?: string,
  slot?: number,
  options?: CockpitWrapOptions,
): string {
  const raw = fleetLaunchUrl(domain, href, slot);
  return wrapExternalInCockpit(raw, {
    slot,
    returnTo: options?.returnTo,
    label: options?.label ?? domain,
  });
}

export function wrapExternalInCockpit(rawUrl: string, options?: CockpitWrapOptions): string {
  if (rawUrl.startsWith("/")) {
    return rawUrl;
  }

  const safe = sanitizeCockpitSrc(rawUrl);
  if (!safe) {
    return "/hangar";
  }

  const params = new URLSearchParams({ src: safe });
  const returnTo = options?.returnTo ?? "/hangar";
  params.set("return", returnTo);

  const bayId = fleetBayIdFromSlot(options?.slot);
  if (bayId) {
    params.set("bay", bayId);
    if (isFleetBayTrusted(bayId)) {
      params.set("handoff", "trusted");
    }
  }

  if (options?.label) {
    params.set("label", options.label);
  }

  return `/cockpit?${params.toString()}`;
}
