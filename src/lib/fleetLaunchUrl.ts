/**
 * Resolves fleet partner URLs. External partners route through `/cockpit` with a
 * floating USJET return control — same window, no Launch step, no new browser tab.
 */
import { FLEET_PARTNER_HREFS } from "./fleetManifestAudit";

export const FLEET_TRUSTED_STORAGE_PREFIX = "usjet-fleet-trusted-" as const;
const FLEET_ALLOWED_EMBED_HOSTS = new Set(
  Object.values(FLEET_PARTNER_HREFS)
    .filter((href) => href.startsWith("http://") || href.startsWith("https://"))
    .map((href) => {
      try {
        return new URL(href).hostname.replace(/^www\./i, "");
      } catch {
        return "";
      }
    })
    .filter(Boolean),
);

/** Header media chips (US / Blue / B / J) — cockpit handoff, not fleet bays. */
const COCKPIT_MEDIA_ALLOWED_HOSTS = new Set(
  ["facebook.com", "tiktok.com", "beyonce.com", "jay-z.com", "lifeandtimes.com", "crazygames.com"].map((host) =>
    host.toLowerCase(),
  ),
);

function isAllowedFleetEmbedHost(hostname: string): boolean {
  const normalized = hostname.replace(/^www\./i, "").toLowerCase();
  if (FLEET_ALLOWED_EMBED_HOSTS.has(normalized) || COCKPIT_MEDIA_ALLOWED_HOSTS.has(normalized)) {
    return true;
  }
  const allowedBases = [...FLEET_ALLOWED_EMBED_HOSTS, ...COCKPIT_MEDIA_ALLOWED_HOSTS];
  return allowedBases.some((base) => normalized.endsWith(`.${base}`));
}

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
    if (!isAllowedFleetEmbedHost(url.hostname)) {
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
  callName?: string;
  /** Same-window redirect when partner blocks iframe embed (header media chips). */
  directHandoff?: boolean;
};

/** Fleet tiles and directory — external URLs open in `/cockpit` with USJET return. */
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
    callName: options?.callName ?? options?.label,
  });
}

export function wrapExternalInCockpit(rawUrl: string, options?: CockpitWrapOptions): string {
  if (rawUrl.startsWith("/")) {
    return rawUrl;
  }

  const safe = sanitizeCockpitSrc(rawUrl);
  if (!safe) {
    return options?.returnTo ?? "/";
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
  if (options?.callName?.trim()) {
    params.set("callName", options.callName.trim());
  }
  if (options?.directHandoff) {
    params.set("handoff", "direct");
  }

  return `/cockpit?${params.toString()}`;
}
