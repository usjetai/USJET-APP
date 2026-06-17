/** Best-effort TikTok iframe mute control (cross-origin; remount is the reliable fallback). */

export function findTikTokEmbedIframe(root: HTMLElement | null): HTMLIFrameElement | null {
  if (!root) {
    return null;
  }
  return root.querySelector("iframe");
}

export function postTikTokMuteCommand(iframe: HTMLIFrameElement | null, mute: boolean): void {
  if (!iframe?.contentWindow) {
    return;
  }
  const payloads = [
    { type: mute ? "mute" : "unmute", "x-tiktok-player": true },
    { method: mute ? "mute" : "unMute" },
    { event: mute ? "mute" : "unmute" },
  ];
  for (const payload of payloads) {
    try {
      iframe.contentWindow.postMessage(JSON.stringify(payload), "*");
      iframe.contentWindow.postMessage(payload, "*");
    } catch {
      /* cross-origin */
    }
  }
}

export function applyTikTokEmbedMute(root: HTMLElement | null, mute: boolean): void {
  postTikTokMuteCommand(findTikTokEmbedIframe(root), mute);
}
