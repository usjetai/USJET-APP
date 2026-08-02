/**
 * Hangar / Fleet tile takeoff click — short jet-launch whoosh.
 * User-gesture UI SFX (not background audio); plays even when ambient site audio is off.
 */

export const JET_LAUNCH_SOUND_SRC = "/sounds/jet-launch.mp3" as const;

let cached: HTMLAudioElement | null = null;

function getClip(): HTMLAudioElement {
  if (!cached) {
    cached = new Audio(JET_LAUNCH_SOUND_SRC);
    cached.preload = "auto";
  }
  return cached;
}

/** Play airplane launch SFX on tile click / keyboard activate. */
export function playJetLaunchSound(volume = 0.55): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const node = getClip().cloneNode(true) as HTMLAudioElement;
    node.volume = Math.min(1, Math.max(0, volume));
    void node.play().catch(() => {
      /* autoplay policy / missing asset — silent */
    });
  } catch {
    /* ignore */
  }
}
