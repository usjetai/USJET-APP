/**
 * Hangar / Fleet tile takeoff click — Apple Mail "sent" style airplane whoosh.
 * Procedural Web Audio (original USJET synthesis). We cannot ship Apple's
 * copyrighted Mail Sent.aiff; this matches that short flyby UI feel.
 */

let sharedCtx: AudioContext | null = null;
let lastVariant = -1;

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

function pickVariant(slot?: number): number {
  // 6 micro-variants so bays don't feel identical.
  let idx = Math.floor(Math.random() * 6);
  if (typeof slot === "number" && Number.isFinite(slot) && Math.random() < 0.35) {
    idx = Math.abs(Math.trunc(slot)) % 6;
  }
  if (idx === lastVariant) {
    idx = (idx + 1) % 6;
  }
  lastVariant = idx;
  return idx;
}

/** Soft pink-ish buffer for air rush. */
function makeNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch += 1) {
    const data = buffer.getChannelData(ch);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      data[i] = pink * 0.11;
    }
  }
  return buffer;
}

/**
 * Build one Mail-Sent-style whoosh: fast attack, soft decay, L→R flyby,
 * descending pitch (takeoff / send).
 */
function playMailSentStyleWhoosh(ctx: AudioContext, volume: number, variant: number): void {
  const now = ctx.currentTime;
  const duration = 1.35;
  const pitchStart = 420 + variant * 18;
  const pitchEnd = 155 + (variant % 3) * 12;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.9), now + 0.045);
  master.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.35), now + 0.35);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  // Stereo flyby pan (Mail Sent character).
  const panner = ctx.createStereoPanner();
  panner.pan.setValueAtTime(-0.75, now);
  panner.pan.linearRampToValueAtTime(0.85, now + duration * 0.85);
  panner.connect(master);
  master.connect(ctx.destination);

  // Tonal whoosh body.
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(pitchStart, now);
  osc.frequency.exponentialRampToValueAtTime(pitchEnd, now + duration);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.exponentialRampToValueAtTime(0.22, now + 0.05);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const oscFilter = ctx.createBiquadFilter();
  oscFilter.type = "bandpass";
  oscFilter.Q.value = 0.9;
  oscFilter.frequency.setValueAtTime(1400 + variant * 40, now);
  oscFilter.frequency.exponentialRampToValueAtTime(500, now + duration);

  osc.connect(oscFilter);
  oscFilter.connect(oscGain);
  oscGain.connect(panner);

  // Air rush layer.
  const noise = ctx.createBufferSource();
  noise.buffer = makeNoiseBuffer(ctx, duration + 0.05);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.Q.value = 0.7;
  noiseFilter.frequency.setValueAtTime(2200, now);
  noiseFilter.frequency.exponentialRampToValueAtTime(700, now + duration);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.55, now + 0.04);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(panner);

  osc.start(now);
  noise.start(now);
  osc.stop(now + duration + 0.02);
  noise.stop(now + duration + 0.02);
}

type PlayJetLaunchOptions = {
  volume?: number;
  /** Fleet / Hangar bay slot — optional flavor bias for which variant plays. */
  slot?: number;
};

/** Preload / warm AudioContext on first user gesture if needed. */
export function preloadJetLaunchSounds(): void {
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }
  if (ctx.state === "suspended") {
    void ctx.resume().catch(() => {
      /* wait for click */
    });
  }
}

/** Play Mail-Sent-style airplane whoosh on tile click / keyboard activate. */
export function playJetLaunchSound(volumeOrOptions: number | PlayJetLaunchOptions = 0.78): void {
  if (typeof window === "undefined") {
    return;
  }

  const options: PlayJetLaunchOptions =
    typeof volumeOrOptions === "number" ? { volume: volumeOrOptions } : volumeOrOptions;
  const volume = Math.min(1, Math.max(0, options.volume ?? 0.78));
  const variant = pickVariant(options.slot);

  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }
    const start = () => playMailSentStyleWhoosh(ctx, volume, variant);
    if (ctx.state === "suspended") {
      void ctx.resume().then(start).catch(() => {
        /* autoplay policy */
      });
      return;
    }
    start();
  } catch {
    /* ignore */
  }
}

/** @deprecated Kept for any lingering imports — procedural path has no URL. */
export const JET_LAUNCH_SOUND_SRC = "";
export const JET_LAUNCH_SOUND_POOL: readonly string[] = [];
