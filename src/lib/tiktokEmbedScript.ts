const TIKTOK_EMBED_SCRIPT = "https://www.tiktok.com/embed.js";

let embedScriptPromise: Promise<void> | null = null;

declare global {
  interface Window {
    tiktokEmbed?: {
      lib?: {
        render: (elements: HTMLElement | HTMLElement[]) => void;
      };
    };
  }
}

/** Load TikTok embed.js once (official blockquote embed). */
export function loadTikTokEmbedScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.tiktokEmbed?.lib?.render) {
    return Promise.resolve();
  }

  if (embedScriptPromise) {
    return embedScriptPromise;
  }

  embedScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${TIKTOK_EMBED_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("TikTok embed script failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = TIKTOK_EMBED_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("TikTok embed script failed"));
    document.body.appendChild(script);
  });

  return embedScriptPromise;
}

/** Render or refresh a blockquote.tiktok-embed node. */
export function renderTikTokEmbed(element: HTMLElement | null): void {
  if (!element || !window.tiktokEmbed?.lib?.render) {
    return;
  }
  window.tiktokEmbed.lib.render(element);
}
