import { useEffect } from "react";
import { useSilentHangarOptional } from "../../context/SilentHangarContext";

export const USJET_PRIME_AUDIO_EVENT = "usjet-prime-audio" as const;

/** First tap / key anywhere arms site audio (browser gesture unlock for background beat). */
export default function SiteAudioPrime() {
  const { setAudioArmed } = useSilentHangarOptional();

  useEffect(() => {
    const prime = () => {
      setAudioArmed(true);
      window.dispatchEvent(new CustomEvent(USJET_PRIME_AUDIO_EVENT));
    };

    const opts: AddEventListenerOptions = { capture: true, passive: true, once: true };
    window.addEventListener("pointerdown", prime, opts);
    window.addEventListener("keydown", prime, opts);
    window.addEventListener("touchstart", prime, opts);

    return () => {
      window.removeEventListener("pointerdown", prime, opts);
      window.removeEventListener("keydown", prime, opts);
      window.removeEventListener("touchstart", prime, opts);
    };
  }, [setAudioArmed]);

  return null;
}
