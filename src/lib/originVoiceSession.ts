export type OriginVoiceStatus =
  | "loading"
  | "idle"
  | "listening"
  | "processing"
  | "speaking"
  | "error";

export type OriginVoiceCaption =
  | "LOADING…"
  | "WAKING HER UP…"
  | "TAP TO TALK"
  | "GO AHEAD, I'M LISTENING"
  | "LISTENING"
  | "THINKING…"
  | "SPEAKING"
  | "MIC UNAVAILABLE — TYPE BELOW"
  | "SOMETHING BROKE, TAP TO RETRY";

export function captionForStatus(status: OriginVoiceStatus, speechSupported: boolean): OriginVoiceCaption {
  if (!speechSupported && (status === "idle" || status === "listening")) {
    return "MIC UNAVAILABLE — TYPE BELOW";
  }
  switch (status) {
    case "loading":
      return "WAKING HER UP…";
    case "listening":
      return "GO AHEAD, I'M LISTENING";
    case "processing":
      return "THINKING…";
    case "speaking":
      return "SPEAKING";
    case "error":
      return "SOMETHING BROKE, TAP TO RETRY";
    case "idle":
    default:
      return "TAP TO TALK";
  }
}

export function createSpeechRecognition(): SpeechRecognition | null {
  const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  return recognition;
}

export function isSpeechRecognitionSupported(): boolean {
  return Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
}

/** Rough word timings for TalkingHead lipsync while browser TTS plays the voice. */
export function estimateWordTimings(text: string, msPerWord = 310): {
  words: string[];
  wtimes: number[];
  wdurations: number[];
  durationMs: number;
} {
  const words = text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  const wtimes = words.map((_, i) => i * msPerWord);
  const wdurations = words.map((w) => Math.max(160, Math.min(520, w.length * 42)));
  const durationMs = words.length ? wtimes[wtimes.length - 1]! + wdurations[wdurations.length - 1]! + 200 : 800;
  return { words, wtimes, wdurations, durationMs };
}

export function createSilentAudioBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
  const seconds = Math.max(0.35, durationSec);
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  return ctx.createBuffer(1, length, ctx.sampleRate);
}

export function pickBrowserVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const preferred =
    voices.find((v) => /en-US/i.test(v.lang) && /female|samantha|karen|moira|zira|google us english/i.test(v.name)) ||
    voices.find((v) => /en-US/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang));
  return preferred ?? voices[0] ?? null;
}
