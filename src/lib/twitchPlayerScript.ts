import { getTwitchEmbedParents } from "./twitchEmbed";

const TWITCH_PLAYER_SCRIPT = "https://player.twitch.tv/js/embed/v1.js";

let scriptPromise: Promise<void> | null = null;

export type TwitchPlayerInstance = {
  setMuted: (muted: boolean) => void;
  getMuted: () => boolean;
  setVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
  destroy: () => void;
  addEventListener: (event: string, callback: () => void) => void;
};

export type TwitchChannelOptions = {
  channel: string;
  width?: string | number;
  height?: string | number;
  muted?: boolean;
  autoplay?: boolean;
};

export type TwitchClipOptions = {
  clip: string;
  width?: string | number;
  height?: string | number;
  muted?: boolean;
  autoplay?: boolean;
};

declare global {
  interface Window {
    Twitch?: {
      Player: new (elementId: string, options: Record<string, unknown>) => TwitchPlayerInstance;
    };
  }
}

export function loadTwitchPlayerScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.Twitch?.Player) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${TWITCH_PLAYER_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Twitch player script failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = TWITCH_PLAYER_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Twitch player script failed"));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

function basePlayerOptions(muted: boolean, width?: string | number, height?: string | number) {
  return {
    width: width ?? "100%",
    height: height ?? "100%",
    parent: getTwitchEmbedParents(),
    muted,
    autoplay: true,
  };
}

export async function createTwitchChannelPlayer(
  elementId: string,
  options: TwitchChannelOptions,
): Promise<TwitchPlayerInstance> {
  await loadTwitchPlayerScript();
  if (!window.Twitch?.Player) {
    throw new Error("Twitch Player unavailable");
  }
  return new window.Twitch.Player(elementId, {
    ...basePlayerOptions(options.muted ?? true, options.width, options.height),
    channel: options.channel,
  });
}

export async function createTwitchClipPlayer(
  elementId: string,
  options: TwitchClipOptions,
): Promise<TwitchPlayerInstance> {
  await loadTwitchPlayerScript();
  if (!window.Twitch?.Player) {
    throw new Error("Twitch Player unavailable");
  }
  return new window.Twitch.Player(elementId, {
    ...basePlayerOptions(options.muted ?? true, options.width, options.height),
    clip: options.clip,
  });
}
