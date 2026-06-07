/** Loads the YouTube IFrame API once; safe for concurrent callers. */

type YTReadyCallback = () => void;

/** Minimal surface used by Silent Hangar wiring */
export interface YoutubePlayer {
  destroy(): void;
  mute(): void;
  unMute(): void;
  setVolume(volume: number): void;
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(videoId: string): void;
}

declare global {
  interface Window {
    YT?: { Player: new (container: HTMLElement | string, options: Record<string, unknown>) => YoutubePlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const pendingReady: YTReadyCallback[] = [];

function flushPendingReady() {
  while (pendingReady.length) {
    const next = pendingReady.shift();
    next?.();
  }
}

if (typeof window !== "undefined") {
  const w = window;
  const previous = w.onYouTubeIframeAPIReady;
  w.onYouTubeIframeAPIReady = () => {
    previous?.();
    flushPendingReady();
  };
}

const SCRIPT_SELECTOR = 'script[src="https://www.youtube.com/iframe_api"]';

function injectIframeApiScript() {
  if (typeof document === "undefined" || document.querySelector(SCRIPT_SELECTOR)) {
    return;
  }
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(tag, firstScript);
}

export function loadYoutubeIFrameApi(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube iframe API requires a browser"));
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    pendingReady.push(resolve);
    injectIframeApiScript();
  });
}
