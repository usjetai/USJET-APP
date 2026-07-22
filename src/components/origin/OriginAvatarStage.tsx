import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ORIGIN_CHARACTER_POSTER,
  ORIGIN_CHARACTER_URL,
  ORIGIN_CHARACTER_VIDEO,
} from "../../lib/originAvatarConfig";
import { pickBrowserVoice } from "../../lib/originVoiceSession";
import { toSpeakableText } from "../../lib/speakableBrand";

export type OriginAvatarHandle = {
  ready: boolean;
  start: () => void;
  stopSpeaking: () => void;
  setListening: (listening: boolean) => void;
  speakText: (text: string, onSubtitles?: (chunk: string) => void) => Promise<void>;
};

type OriginAvatarStageProps = {
  onReadyChange?: (ready: boolean) => void;
  onLoadError?: (message: string) => void;
};

type Presence = "idle" | "listening" | "speaking";

/**
 * Origin face-to-face stage — Founder's USJET android video presence
 * with idle / listening / speaking states. Browser TTS for voice replies.
 */
const OriginAvatarStage = forwardRef<OriginAvatarHandle, OriginAvatarStageProps>(
  function OriginAvatarStage({ onReadyChange, onLoadError }, ref) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const readyRef = useRef(false);
    const onReadyChangeRef = useRef(onReadyChange);
    const onLoadErrorRef = useRef(onLoadError);
    onReadyChangeRef.current = onReadyChange;
    onLoadErrorRef.current = onLoadError;

    const [ready, setReady] = useState(false);
    const [presence, setPresence] = useState<Presence>("idle");
    const [mediaError, setMediaError] = useState<string | null>(null);
    const [reducedMotion] = useState(() => {
      if (typeof window === "undefined") return false;
      if (new URLSearchParams(window.location.search).has("forceMotion")) return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });

    const markReady = useCallback((value: boolean) => {
      readyRef.current = value;
      setReady(value);
      onReadyChangeRef.current?.(value);
    }, []);

    useEffect(() => {
      markReady(true);
    }, [markReady]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || reducedMotion) return;

      const play = () => {
        void video.play().catch(() => {});
      };
      play();

      const onVis = () => {
        if (document.hidden) video.pause();
        else play();
      };
      document.addEventListener("visibilitychange", onVis);
      return () => document.removeEventListener("visibilitychange", onVis);
    }, [reducedMotion]);

    useImperativeHandle(
      ref,
      (): OriginAvatarHandle => ({
        get ready() {
          return readyRef.current;
        },
        start() {
          setPresence("idle");
          const video = videoRef.current;
          if (video && video.paused) void video.play().catch(() => {});
        },
        stopSpeaking() {
          window.speechSynthesis?.cancel();
          setPresence("idle");
        },
        setListening(listening: boolean) {
          setPresence(listening ? "listening" : "idle");
        },
        async speakText(text: string, onSubtitles?: (chunk: string) => void) {
          const cleaned = text.replace(/\s+/g, " ").trim();
          if (!cleaned) return;
          const spoken = toSpeakableText(cleaned);
          setPresence("speaking");
          const video = videoRef.current;
          if (video && video.paused) void video.play().catch(() => {});
          try {
            await speakBrowserOnly(spoken, onSubtitles);
          } finally {
            setPresence("idle");
          }
        },
      }),
      [],
    );

    return (
      <div
        className={[
          "origin-avatar-stage",
          "origin-avatar-stage--character",
          `origin-avatar-stage--${presence}`,
          reducedMotion ? "origin-avatar-stage--reduced" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Origin — USJET android command unit"
      >
        <div className="origin-avatar-stage__brand-bg" aria-hidden>
          <img src="/founder/usjet-hero-logo.png" alt="" />
        </div>

        <div className="origin-avatar-stage__character-wrap">
          {reducedMotion ? (
            <img
              src={ORIGIN_CHARACTER_URL}
              alt="Origin, USJET android command unit"
              className="origin-avatar-stage__character"
              onLoad={() => markReady(true)}
              onError={() => {
                const message = "Origin portrait failed to load.";
                setMediaError(message);
                onLoadErrorRef.current?.(message);
                markReady(true);
              }}
            />
          ) : (
            <video
              ref={videoRef}
              className="origin-avatar-stage__character origin-avatar-stage__character--video"
              src={ORIGIN_CHARACTER_VIDEO}
              poster={ORIGIN_CHARACTER_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Origin, USJET android command unit — live presence"
              onLoadedData={() => {
                setMediaError(null);
                markReady(true);
              }}
              onError={() => {
                const message = "Origin video failed to load.";
                setMediaError(message);
                onLoadErrorRef.current?.(message);
                markReady(true);
              }}
            />
          )}
          <div className="origin-avatar-stage__character-glow" aria-hidden />
        </div>

        {!ready ? (
          <div className="origin-avatar-stage__loading" aria-live="polite">
            Loading Origin…
          </div>
        ) : null}
        {mediaError ? (
          <div className="origin-avatar-stage__loading origin-avatar-stage__loading--soft" aria-live="polite">
            {mediaError}
          </div>
        ) : null}
      </div>
    );
  },
);

export default OriginAvatarStage;

function speakBrowserOnly(
  text: string,
  onSubtitles?: (chunk: string) => void,
  onEnd?: () => void,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onSubtitles?.(text);
      onEnd?.();
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickBrowserVoice();
    if (voice) utter.voice = voice;
    utter.rate = 1.02;
    utter.pitch = 1.05;
    utter.onstart = () => onSubtitles?.(text);
    utter.onend = () => {
      onEnd?.();
      resolve();
    };
    utter.onerror = () => {
      onEnd?.();
      resolve();
    };

    if (!window.speechSynthesis.getVoices().length) {
      window.speechSynthesis.onvoiceschanged = () => {
        const v = pickBrowserVoice();
        if (v) utter.voice = v;
        window.speechSynthesis.speak(utter);
      };
    } else {
      window.speechSynthesis.speak(utter);
    }
  });
}
