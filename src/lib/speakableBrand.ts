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

export function speakWithBrandVoice(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
    onError?: () => void;
  },
): boolean {
  if (!("speechSynthesis" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(toSpeakableText(text));
  utterance.rate = options?.rate ?? 0.95;
  utterance.pitch = options?.pitch ?? 0.92;
  utterance.onend = () => options?.onEnd?.();
  utterance.onerror = () => options?.onError?.();
  window.speechSynthesis.speak(utterance);
  return true;
}
