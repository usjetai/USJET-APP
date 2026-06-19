/** Production home — apex resolves to www in Search Console. */
export const USJET_RETURN_HOME_URL = "https://usjet.ai" as const;

export function isLocalUsjetDevHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/** Immediate return to sovereign home (production) or fleet root (local dev). */
export function navigateToUsjetHome(): void {
  if (typeof window === "undefined") {
    return;
  }

  const { hostname } = window.location;
  window.location.assign(isLocalUsjetDevHost(hostname) ? "/" : USJET_RETURN_HOME_URL);
}
