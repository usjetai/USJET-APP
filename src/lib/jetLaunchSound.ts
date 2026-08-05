/**
 * Hangar / Fleet tile takeoff click — YouTube jet takeoff/flyby source,
 * trimmed for UI, with per-tile pitch / filter / pan so every bay sounds different.
 * Source: https://www.youtube.com/watch?v=OUNwFrt5IEQ (SoundEffectsFactory)
 */

/** Cache-bust when replacing SFX assets. */
const JET_LAUNCH_ASSET_VER = "yt1";

export const JET_LAUNCH_SOUND_POOL = [
  `/sounds/jet-launch-01.mp3?v=${JET_LAUNCH_ASSET_VER}`,
  `/sounds/jet-launch-02.mp3?v=${JET_LAUNCH_ASSET_VER}`,
  `/sounds/jet-launch-03.mp3?v=${JET_LAUNCH_ASSET_VER}`,
  `/sounds/jet-launch-04.mp3?v=${JET_LAUNCH_ASSET_VER}`,
  `/sounds/jet-launch-05.mp3?v=${JET_LAUNCH_ASSET_VER}`,
  `/sounds/jet-launch-06.mp3?v=${JET_LAUNCH_ASSET_VER}`,
] as const;

export const JET_LAUNCH_SOUND_SRC = `/sounds/jet-launch.mp3?v=${JET_LAUNCH_ASSET_VER}`;

let sharedCtx: AudioContext | null = null;
let masterBuffer: AudioBuffer | null = null;
let masterLoadPromise: Promise<AudioBuffer | null> | null = null;
let lastPoolIdx = -1;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) {
    return null;
  }
  if (!sharedCtx || sharedCtx.state === "closed") {
    sharedCtx = new Ctx();
  }
  return sharedCtx;
}

async function loadMasterBuffer(ctx: AudioContext): Promise<AudioBuffer | null> {
  if (masterBuffer) {
    return masterBuffer;
  }
  if (!masterLoadPromise) {
    masterLoadPromise = (async () => {
      try {
        const response = await fetch(JET_LAUNCH_SOUND_SRC);
        if (!response.ok) {
          return null;
        }
        const bytes = await response.arrayBuffer();
        masterBuffer = await ctx.decodeAudioData(bytes.slice(0));
        return masterBuffer;
      } catch {
        return null;
      }
    })();
  }
  return masterLoadPromise;
}

/**
 * Deterministic per-tile flavor so Hangar bay 03 never sounds like bay 17.
 * Slot maps to pitch, filter, and stereo pan — slight random jitter each click.
 */
function tileFlavor(slot?: number): {
  playbackRate: number;
  filterHz: number;
  pan: number;
  poolIdx: number;
} {
  const base =
    typeof slot === "number" && Number.isFinite(slot)
      ? Math.abs(Math.trunc(slot))
      : Math.floor(Math.random() * 30);

  // Spread 30 hangar slots across a clear pitch/filter range.
  const t = (base % 30) / 29;
  const playbackRate = 0.84 + t * 0.42; // ~0.84 → 1.26
  const filterHz = 900 + t * 2800;
  const pan = -0.55 + t * 1.1;
  const poolIdx = base % JET_LAUNCH_SOUND_POOL.length;

  // Tiny per-click jitter so repeats of the same bay still feel alive.
  const jitter = (Math.random() - 0.5) * 0.04;
  return {
    playbackRate: Math.min(1.35, Math.max(0.78, playbackRate + jitter)),
    filterHz: filterHz + (Math.random() - 0.5) * 180,
    pan: Math.min(0.9, Math.max(-0.9, pan + (Math.random() - 0.5) * 0.12)),
    poolIdx,
  };
}

function playBufferedWhoosh(
  ctx: AudioContext,
  buffer: AudioBuffer,
  volume: number,
  flavor: ReturnType<typeof tileFlavor>,
): void {
  const now = ctx.currentTime;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = flavor.playbackRate;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.85;
  filter.frequency.value = flavor.filterHz;

  const panner = ctx.createStereoPanner();
  panner.pan.value = flavor.pan;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.02);
  // Soft tail so the clip doesn't click off.
  const end = now + buffer.duration / flavor.playbackRate + 0.02;
  gain.gain.setValueAtTime(Math.max(0.0001, volume), Math.max(now + 0.05, end - 0.18));
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  source.connect(filter);
  filter.connect(panner);
  panner.connect(gain);
  gain.connect(ctx.destination);

  source.start(now);
  source.stop(end + 0.03);
}

/** HTMLAudio fallback — pick a pre-pitched pool clip when Web Audio is unavailable. */
function playPoolFallback(volume: number, poolIdx: number): void {
  let idx = poolIdx;
  if (idx === lastPoolIdx && JET_LAUNCH_SOUND_POOL.length > 1) {
    idx = (idx + 1) % JET_LAUNCH_SOUND_POOL.length;
  }
  lastPoolIdx = idx;
  const src = JET_LAUNCH_SOUND_POOL[idx] ?? JET_LAUNCH_SOUND_SRC;
  const node = new Audio(src);
  node.volume = volume;
  void node.play().catch(() => {
    /* autoplay / missing asset */
  });
}

type PlayJetLaunchOptions = {
  volume?: number;
  /** Fleet / Hangar bay slot — drives a distinct pitch/filter/pan per tile. */
  slot?: number;
};

/** Preload master takeoff so the first click is not cold. */
export function preloadJetLaunchSounds(): void {
  if (typeof window === "undefined") {
    return;
  }
  const ctx = getAudioContext();
  if (ctx) {
    void loadMasterBuffer(ctx);
    if (ctx.state === "suspended") {
      void ctx.resume().catch(() => {
        /* wait for gesture */
      });
    }
  }
  // Also warm HTMLAudio pool for fallback.
  for (const src of JET_LAUNCH_SOUND_POOL) {
    const clip = new Audio(src);
    clip.preload = "auto";
  }
}

/** Play the YouTube jet takeoff hit, flavored uniquely per Hangar/Fleet tile. */
export function playJetLaunchSound(volumeOrOptions: number | PlayJetLaunchOptions = 0.8): void {
  if (typeof window === "undefined") {
    return;
  }

  const options: PlayJetLaunchOptions =
    typeof volumeOrOptions === "number" ? { volume: volumeOrOptions } : volumeOrOptions;
  const volume = Math.min(1, Math.max(0, options.volume ?? 0.8));
  const flavor = tileFlavor(options.slot);

  try {
    const ctx = getAudioContext();
    if (!ctx) {
      playPoolFallback(volume, flavor.poolIdx);
      return;
    }

    const start = async () => {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      const buffer = await loadMasterBuffer(ctx);
      if (!buffer) {
        playPoolFallback(volume, flavor.poolIdx);
        return;
      }
      playBufferedWhoosh(ctx, buffer, volume, flavor);
    };

    void start().catch(() => {
      playPoolFallback(volume, flavor.poolIdx);
    });
  } catch {
    playPoolFallback(volume, flavor.poolIdx);
  }
}
