/** Twitch player embed — parent must match the page hostname (Twitch requirement). */

const STATIC_PARENTS = ["localhost", "127.0.0.1", "usjet.ai", "www.usjet.ai"] as const;

export function getTwitchEmbedParents(): string[] {
  const parents = new Set<string>(STATIC_PARENTS);
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host) {
      parents.add(host);
    }
  }
  return [...parents];
}

export function buildTwitchChannelEmbedUrl(channel: string, options?: { muted?: boolean }): string {
  const params = new URLSearchParams();
  params.set("channel", channel);
  if (options?.muted !== undefined) {
    params.set("muted", String(options.muted));
  }
  getTwitchEmbedParents().forEach((parent) => params.append("parent", parent));
  return `https://player.twitch.tv/?${params.toString()}`;
}

/** Twitch chat popout embed — parent must match page hostname. */
export function buildTwitchChatEmbedUrl(channel: string): string {
  const params = new URLSearchParams();
  params.set("darkpopout", "");
  getTwitchEmbedParents().forEach((parent) => params.append("parent", parent));
  const query = params.toString();
  return `https://www.twitch.tv/embed/${encodeURIComponent(channel)}/chat${query ? `?${query}` : ""}`;
}

/** Twitch clip embed — parent must match page hostname. */
export function buildTwitchClipEmbedUrl(clipSlug: string): string {
  const params = new URLSearchParams();
  params.set("clip", clipSlug);
  getTwitchEmbedParents().forEach((parent) => params.append("parent", parent));
  return `https://clips.twitch.tv/embed?${params.toString()}`;
}
