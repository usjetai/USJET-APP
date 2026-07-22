/** Spoken welcome lines for Origin (she teaches all 29 partner AIs). */
import { memberClearanceDisplayLabel } from "./memberAccessLevel";
import { getMemberProjectStats } from "./memberProjectTracker";
import type { MemberSession } from "../types/member";

export const ORIGIN_SPOKEN_LOAD_GREET =
  "Welcome to USJET. USJET Origin online. I'm here to teach you about all twenty-nine partner AIs — what to do, how to use them, and which bay to open.";

/** Customer Service entry — Aura multitasks as support. */
export const ORIGIN_CS_SPOKEN_GREET =
  "Welcome to USJET. I see that you clicked on Customer Service — I'm also here to help. Ask about your account, the fleet, or how to reach USJET operations.";

export const ORIGIN_CS_SCREEN_GREET =
  "I see that you clicked on Customer Service. I'm also here to help.";

/** Brief spoken member status on CS entry — cite real clearance only. */
export function buildOriginCsMemberSpokenGreet(session: MemberSession): string {
  const tier = memberClearanceDisplayLabel(session);
  const stats = getMemberProjectStats(session.customerId);
  const projectPhrase =
    stats.projectCount === 0
      ? "no mission projects yet"
      : stats.projectCount === 1
        ? "one mission project"
        : `${stats.projectCount} mission projects`;
  const forkPhrase =
    stats.totalSessionForks === 0
      ? ""
      : stats.totalSessionForks === 1
        ? " and one session fork logged"
        : ` and ${stats.totalSessionForks} session forks logged`;

  return `Welcome to USJET Customer Service. You're on ${tier} — welcome back, Commander. I see ${projectPhrase}${forkPhrase}. How can I help today?`;
}

/** On-screen CS greet when a verified member is logged in. */
export function buildOriginCsMemberScreenGreet(session: MemberSession): string {
  const tier = memberClearanceDisplayLabel(session);
  const stats = getMemberProjectStats(session.customerId);
  return `Customer Service — ${tier} clearance confirmed. ${stats.projectCount} mission project${stats.projectCount === 1 ? "" : "s"}, ${stats.totalSessionForks} session fork${stats.totalSessionForks === 1 ? "" : "s"}. I'm here to help.`;
}

export const ORIGIN_SPOKEN_WELCOME =
  "Welcome to USJET. USJET Origin online. I'm here to teach you about all twenty-nine partner AIs — what each one does, how to use them, and which hangar bay to open. Ask me anything about the fleet. Command acknowledged.";

/** Spoken brand — U.S. (United States) + JET, not four separate letters. */
export const USJET_SPOKEN = "U. S. Jet";

/** Convert display copy to speech-synthesis text with correct brand pronunciation. */
export function toSpeakableText(text: string): string {
  return text
    .replace(/\bUSJET\.AI\b/gi, `${USJET_SPOKEN} dot A I`)
    .replace(/\bUS\s*Jet(?:\.ai)?\b/gi, USJET_SPOKEN)
    .replace(/\bUSJET\b/g, USJET_SPOKEN)
    .replace(/\busjet\.ai\b/gi, `${USJET_SPOKEN} dot A I`)
    .replace(/\busjet\b/gi, USJET_SPOKEN)
    // Pricing: "/mo" means month — never let TTS say "mo".
    .replace(/\/mo\b/gi, " per month")
    .replace(/\bper\s+mo\b/gi, "per month");
}

const AURA_VOICE_HINTS = [
  /samantha/i,
  /karen/i,
  /victoria/i,
  /zira/i,
  /susan/i,
  /allison/i,
  /ava/i,
  /serena/i,
  /female/i,
  /woman/i,
];

/** Aura (she/her) — prefer a feminine English voice when the browser exposes one. */
function pickAuraVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const english = voices.filter((voice) => voice.lang.startsWith("en"));
  return (
    english.find((voice) => AURA_VOICE_HINTS.some((hint) => hint.test(voice.name))) ??
    english.find((voice) => voice.lang.startsWith("en-US") && voice.localService) ??
    english.find((voice) => voice.lang.startsWith("en-US")) ??
    english.find((voice) => voice.localService) ??
    english[0] ??
    voices[0]
  );
}

function waitForVoices(timeoutMs = 750): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const existing = synth.getVoices();
  if (existing.length > 0) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      window.clearTimeout(timer);
      resolve(synth.getVoices());
    };

    const onVoicesChanged = () => finish();
    const timer = window.setTimeout(finish, timeoutMs);

    synth.addEventListener("voiceschanged", onVoicesChanged);
  });
}

export type SpeakWithBrandVoiceOptions = {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
};

export type SpeakHandle = {
  cancel: () => void;
};

export function speakWithBrandVoice(
  text: string,
  options?: SpeakWithBrandVoiceOptions,
): SpeakHandle | null {
  if (!("speechSynthesis" in window)) {
    return null;
  }

  const synth = window.speechSynthesis;
  let resumeTimer: number | null = null;
  let cancelled = false;

  const clearResumeTimer = () => {
    if (resumeTimer !== null) {
      window.clearInterval(resumeTimer);
      resumeTimer = null;
    }
  };

  const cancel = () => {
    cancelled = true;
    clearResumeTimer();
    synth.cancel();
  };

  const beginSpeak = (voices: SpeechSynthesisVoice[]) => {
    if (cancelled) return;

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(toSpeakableText(text));
    utterance.rate = options?.rate ?? 0.95;
    utterance.pitch = options?.pitch ?? 1.02;
    utterance.lang = "en-US";

    const voice = pickAuraVoice(voices);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      options?.onStart?.();
      clearResumeTimer();
      resumeTimer = window.setInterval(() => {
        if (!synth.speaking) {
          clearResumeTimer();
          return;
        }
        synth.resume();
      }, 120);
    };

    utterance.onend = () => {
      clearResumeTimer();
      options?.onEnd?.();
    };

    utterance.onerror = (event) => {
      clearResumeTimer();
      if (event.error === "interrupted" || event.error === "canceled") {
        return;
      }
      options?.onError?.();
    };

    synth.speak(utterance);

    window.setTimeout(() => {
      if (!cancelled && synth.paused) {
        synth.resume();
      }
    }, 0);
  };

  void waitForVoices().then(beginSpeak);

  return { cancel };
}
