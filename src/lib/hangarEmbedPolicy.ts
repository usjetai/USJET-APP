/**
 * Hangar iframe policy — only hosts that actually frame in-browser.
 *
 * Commercial marketing sites (Runway, Replit, Voiceflow, Dify, Yellow.ai, etc.)
 * send X-Frame-Options / CSP frame-ancestors that blank the bay. Do not allowlist
 * them. Hugging Face Spaces (*.hf.space) are the proven in-tile runway.
 */

const HANGAR_IFRAME_BLOCKED_HOSTS = new Set(
  [
    "gemini.google.com",
    "chatgpt.com",
    "claude.ai",
    "perplexity.ai",
    "grok.com",
    "x.ai",
    "cursor.com",
    "midjourney.com",
    "lumalabs.ai",
    "higgsfield.ai",
    "leonardo.ai",
    "firefly.adobe.com",
    "adobe.com",
    "bfl.ai",
    "suno.com",
    "elevenlabs.io",
    "play.ht",
    "v0.dev",
    "github.com",
    "consensus.app",
    "gamma.app",
    "notion.so",
    "jasper.ai",
    "deepseek.com",
    "chat.deepseek.com",
    "canva.com",
    "synthesia.io",
    "runway.com",
    "heygen.com",
    "replit.com",
    "otter.ai",
    "pickaxe.co",
    "customgpt.ai",
    "voiceflow.com",
    "botpress.com",
    "dify.ai",
    "mindstudio.ai",
    "featurebase.app",
    "chatbot.com",
    "unifyapps.com",
    "openassistantgpt.io",
    "commoninja.com",
    "thoughtspot.com",
    "ada.cx",
    "yellow.ai",
    "forethought.ai",
    "embeddable.com",
    "lindy.ai",
    "usefini.com",
    "stackai.com",
    "huggingface.co",
  ].map((host) => host.toLowerCase()),
);

/** Explicit allowlist beyond *.hf.space — keep empty unless a host is verified to frame. */
const HANGAR_IFRAME_AUTO_EMBED_HOSTS = new Set<string>([]);

/** Hugging Face Spaces allow embedding by default — all *.hf.space subdomains. */
function isHfSpace(host: string): boolean {
  return host.endsWith(".hf.space");
}

function normalizeHostname(hostname: string): string {
  return hostname.replace(/^www\./i, "").toLowerCase();
}

export function hostFromUrl(url: string): string | null {
  try {
    return normalizeHostname(new URL(url).hostname);
  } catch {
    return null;
  }
}

/** True when the partner must show Launch before setting iframe src (stays in tile). */
export function isHangarIframeBlocked(url: string): boolean {
  if (!url.trim() || url.startsWith("/")) {
    return false;
  }

  const host = hostFromUrl(url);
  if (!host) {
    return true;
  }

  if (isHfSpace(host)) {
    return false;
  }

  if (HANGAR_IFRAME_AUTO_EMBED_HOSTS.has(host)) {
    return false;
  }

  for (const allowed of HANGAR_IFRAME_AUTO_EMBED_HOSTS) {
    if (host === allowed || host.endsWith(`.${allowed}`)) {
      return false;
    }
  }

  if (HANGAR_IFRAME_BLOCKED_HOSTS.has(host)) {
    return true;
  }

  for (const blocked of HANGAR_IFRAME_BLOCKED_HOSTS) {
    if (host === blocked || host.endsWith(`.${blocked}`)) {
      return true;
    }
  }

  // Unknown external partner — gate behind Launch until verified.
  return true;
}
