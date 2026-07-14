/**
 * Partners that send X-Frame-Options / CSP frame-ancestors blocking embed.
 * Hangar bays gate these behind an in-tile Launch tap (iframe src set on click).
 *
 * Hosts verified via HEAD — June 2026 fleet manifest.
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
  ].map((host) => host.toLowerCase()),
);

/** Hosts that allowed framing in HEAD checks — auto-load inside the bay iframe. */
const HANGAR_IFRAME_AUTO_EMBED_HOSTS = new Set(
  [
    "runway.com",
    "heygen.com",
    "replit.com",
    "otter.ai",
    "openai-whisper.hf.space",
    "stabilityai-stable-diffusion-3-5-large-turbo.hf.space",
    "stabilityai-stable-diffusion-3-5-medium.hf.space",
    "black-forest-labs-flux-1-schnell.hf.space",
    "huggingface-projects-llama-3-2-3b-instruct.hf.space",
    "instantx-instantid.hf.space",
  ].map((host) => host.toLowerCase()),
);

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

  if (HANGAR_IFRAME_AUTO_EMBED_HOSTS.has(host) || isHfSpace(host)) {
    return false;
  }

  if (HANGAR_IFRAME_BLOCKED_HOSTS.has(host)) {
    return true;
  }

  // Unknown external partner — gate behind Launch until verified.
  return true;
}
