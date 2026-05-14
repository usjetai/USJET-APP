/**
 * Resolves fleet launch URLs and wraps external partners in the USJET cockpit shell
 * so the return bar stays visible — Integrated Navigation without leaving the ship.
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

  if (typeof options?.slot === "number") {
    params.set("bay", String(options.slot + 1).padStart(2, "0"));
  }

  if (options?.label) {
    params.set("label", options.label);
  }

  return `/cockpit?${params.toString()}`;
}
