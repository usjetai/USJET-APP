/** Instagram Hangar bay — Lives are typically opened in-app; optional post/reel embed for replay shell. */

export const GAMING_INSTAGRAM_PROFILE_URL = "https://www.instagram.com/usjet/" as const;

export const GAMING_INSTAGRAM_HANDLE_DISPLAY = "@usjet" as const;

export const GAMING_INSTAGRAM_TAGLINE =
  "Lights are on IG too — Lives run in-app; pin a reel or post replay below via env embed." as const;

/**
 * Normalize a canonical Instagram reel/post URL into the official iframe embed endpoint.
 */
export function instagramPermalinkToEmbedSrc(permalink: string): string | null {
  const trimmed = permalink.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const url = trimmed.startsWith("http") ? new URL(trimmed) : new URL(`https://${trimmed}`);
    const host = url.hostname.replace(/^www\./, "");
    if (host !== "instagram.com") {
      return null;
    }
    const pathname = url.pathname.replace(/\/+$/, "");
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length < 2) {
      return null;
    }
    return `https://www.instagram.com${pathname}/embed/`;
  } catch {
    return null;
  }
}

/** Direct embed iframe src override (advanced). */
function readEmbedSrcOverride(): string | undefined {
  const raw = import.meta.env.VITE_GAMING_INSTAGRAM_EMBED_SRC;
  return typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : undefined;
}

function readPermalinkFromEnv(): string | undefined {
  const raw = import.meta.env.VITE_GAMING_INSTAGRAM_EMBED_PERMALINK;
  return typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : undefined;
}

/** Resolve iframe `src` for the Hangar Instagram bay — null renders the CTA placeholder only. */
export function resolveInstagramHangarEmbedSrc(): string | null {
  const direct = readEmbedSrcOverride();
  if (direct) {
    return direct;
  }
  const permalink = readPermalinkFromEnv();
  return permalink ? instagramPermalinkToEmbedSrc(permalink) : null;
}
