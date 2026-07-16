/** Normalize captain input into an https URL for Jet Browser tiles. */

const BLOCKED_SCHEMES = /^(javascript|data|vbscript|file):/i;

export function normalizeJetBrowserUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || BLOCKED_SCHEMES.test(trimmed)) {
    return null;
  }

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    if (candidate.startsWith("//")) {
      candidate = `https:${candidate}`;
    } else if (candidate.startsWith("/")) {
      return null;
    } else {
      candidate = `https://${candidate.replace(/^\/+/, "")}`;
    }
  }

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    if (!url.hostname.includes(".")) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function jetBrowserTileLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return url;
  }
}
