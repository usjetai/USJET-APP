/**
 * Hangar / Fleet tile takeoff click — random jet-launch whoosh from a sortie pool.
 * User-gesture UI SFX (not background audio); plays even when ambient site audio is off.
 */

export const JET_LAUNCH_SOUND_POOL = [
  "/sounds/jet-launch-01.mp3",
  "/sounds/jet-launch-02.mp3",
  "/sounds/jet-launch-03.mp3",
  "/sounds/jet-launch-04.mp3",
  "/sounds/jet-launch-05.mp3",
  "/sounds/jet-launch-06.mp3",
] as const;

/** @deprecated Prefer pool — kept so old caches still resolve. */
export const JET_LAUNCH_SOUND_SRC = JET_LAUNCH_SOUND_POOL[0];

const audioCache = new Map<string, HTMLAudioElement>();
let lastSrc: string | null = null;

function getClip(src: string): HTMLAudioElement {
  let clip = audioCache.get(src);
  if (!clip) {
    clip = new Audio(src);
    clip.preload = "auto";
    audioCache.set(src, clip);
  }
  return clip;
}

/** Pick a random launch clip; avoids repeating the previous sortie when possible. */
function pickLaunchSrc(slot?: number): string {
  const pool = JET_LAUNCH_SOUND_POOL;
  if (pool.length === 1) {
    return pool[0];
  }

  // Prefer a fresh random pick; lightly bias with slot so bays don't always feel identical.
  let idx = Math.floor(Math.random() * pool.length);
  if (typeof slot === "number" && Number.isFinite(slot)) {
    const roll = Math.random();
    if (roll < 0.35) {
      idx = Math.abs(Math.trunc(slot)) % pool.length;
    }
  }

  let src = pool[idx] ?? pool[0];
  if (src === lastSrc) {
    idx = (idx + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length;
    src = pool[idx] ?? pool[0];
  }
  lastSrc = src;
  return src;
}

/** Preload the sortie library so the first click is not cold. */
export function preloadJetLaunchSounds(): void {
  if (typeof window === "undefined") {
    return;
  }
  for (const src of JET_LAUNCH_SOUND_POOL) {
    getClip(src);
  }
}

type PlayJetLaunchOptions = {
  volume?: number;
  /** Fleet / Hangar bay slot — optional flavor bias for which sortie plays. */
  slot?: number;
};

/** Play a random airplane launch SFX on tile click / keyboard activate. */
export function playJetLaunchSound(volumeOrOptions: number | PlayJetLaunchOptions = 0.55): void {
  if (typeof window === "undefined") {
    return;
  }

  const options: PlayJetLaunchOptions =
    typeof volumeOrOptions === "number" ? { volume: volumeOrOptions } : volumeOrOptions;
  const volume = Math.min(1, Math.max(0, options.volume ?? 0.55));

  try {
    const src = pickLaunchSrc(options.slot);
    const node = getClip(src).cloneNode(true) as HTMLAudioElement;
    node.volume = volume;
    void node.play().catch(() => {
      /* autoplay policy / missing asset — silent */
    });
  } catch {
    /* ignore */
  }
}
