/** Spoken brand — U.S. (United States) + JET, not four separate letters. */
export const USJET_SPOKEN = "U. S. Jet";

/** Convert display copy to speech-synthesis text with correct brand pronunciation. */
export function toSpeakableText(text: string): string {
  return text
    .replace(/\bUSJET\.AI\b/gi, `${USJET_SPOKEN} dot A I`)
    .replace(/\bUS\s*Jet(?:\.ai)?\b/gi, USJET_SPOKEN)
    .replace(/\bUSJET\b/g, USJET_SPOKEN)
    .replace(/\busjet\.ai\b/gi, `${USJET_SPOKEN} dot A I`)
    .replace(/\busjet\b/gi, USJET_SPOKEN);
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  return (
    voices.find((voice) => voice.lang.startsWith("en") && voice.localService) ??
    voices.find((voice) => voice.lang.startsWith("en")) ??
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
    utterance.pitch = options?.pitch ?? 0.92;
    utterance.lang = "en-US";

    const voice = pickEnglishVoice(voices);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
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
