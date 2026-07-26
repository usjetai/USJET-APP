import { TalkingHead } from "@met4citizen/talkinghead";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { HeadAudio } from "../../lib/headaudio/headaudio.mjs";
import {
  ORIGIN_AVATAR_BODY,
  ORIGIN_AVATAR_URL,
  ORIGIN_CHARACTER_POSTER,
  ORIGIN_CHARACTER_VIDEO,
  ORIGIN_HEADAUDIO_MODEL,
  ORIGIN_HEADAUDIO_PROCESSOR,
  ORIGIN_MOOD_ALIASES,
  ORIGIN_USE_TALKINGHEAD,
} from "../../lib/originAvatarConfig";
import { pickBrowserVoice } from "../../lib/originVoiceSession";
import { toSpeakableText } from "../../lib/speakableBrand";

export type OriginAvatarHandle = {
  ready: boolean;
  start: () => void;
  stopSpeaking: () => void;
  setListening: (listening: boolean) => void;
  setMood: (mood: string) => void;
  playGesture: (gesture: string) => void;
  speakEmoji: (emoji: string) => void;
  attachRemoteAudio: (stream: MediaStream) => void;
  setRemoteSpeaking: (speaking: boolean) => void;
  speakText: (text: string, onSubtitles?: (chunk: string) => void) => Promise<void>;
};

type OriginAvatarStageProps = {
  onReadyChange?: (ready: boolean) => void;
  onLoadError?: (message: string) => void;
};

type Presence = "idle" | "listening" | "speaking";

type HeadAudioInstance = {
  onvalue: ((key: string, value: number) => void) | null;
  onstarted: ((data: unknown) => void) | null;
  onended: ((data: unknown) => void) | null;
  loadModel: (url: string) => Promise<void>;
  update: (dt: number) => void;
  start: () => void;
  stop: () => void;
};

/**
 * Official Origin stage — white/gold pilot video + HeadAudio lip-sync.
 * Optional TalkingHead when VITE_ORIGIN_AVATAR_URL points at a viseme GLB.
 */
const OriginAvatarStage = forwardRef<OriginAvatarHandle, OriginAvatarStageProps>(
  function OriginAvatarStage({ onReadyChange, onLoadError }, ref) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mouthRef = useRef<HTMLDivElement | null>(null);
    const headRef = useRef<TalkingHead | null>(null);
    const headAudioRef = useRef<HeadAudioInstance | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const speechGainRef = useRef<GainNode | null>(null);
    const remoteSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const idleRafRef = useRef(0);
    const readyRef = useRef(false);
    const onReadyChangeRef = useRef(onReadyChange);
    const onLoadErrorRef = useRef(onLoadError);
    onReadyChangeRef.current = onReadyChange;
    onLoadErrorRef.current = onLoadError;

    const [ready, setReady] = useState(false);
    const [mode, setMode] = useState<"character" | "3d">("character");
    const [presence, setPresence] = useState<Presence>("idle");
    const [mood, setMoodState] = useState("neutral");
    const [gesture, setGestureState] = useState<string | null>(null);
    const [expression, setExpression] = useState<string | null>(null);
    const [mouthOpen, setMouthOpen] = useState(0);
    const [loadLabel, setLoadLabel] = useState("Loading Origin…");

    const markReady = useCallback((value: boolean) => {
      readyRef.current = value;
      setReady(value);
      onReadyChangeRef.current?.(value);
    }, []);

    const applyVisemeValue = useCallback((key: string, value: number) => {
      const head = headRef.current;
      if (head?.mtAvatar?.[key]) {
        Object.assign(head.mtAvatar[key], { newvalue: value, needsUpdate: true });
      }
      if (key === "viseme_aa" || key === "viseme_O" || key === "viseme_U" || key === "viseme_E") {
        setMouthOpen((prev) => Math.max(prev * 0.55, Math.min(1, value)));
      } else if (key === "viseme_sil") {
        setMouthOpen((prev) => prev * 0.35);
      }
    }, []);

    const armHeadAudio = useCallback(
      async (audioCtx: AudioContext, speechGain: GainNode) => {
        await audioCtx.audioWorklet.addModule(ORIGIN_HEADAUDIO_PROCESSOR);
        const headaudio = new HeadAudio(audioCtx, {
          parameterData: {
            vadGateActiveDb: -40,
            vadGateInactiveDb: -60,
          },
        }) as unknown as HeadAudioInstance;
        await headaudio.loadModel(ORIGIN_HEADAUDIO_MODEL);
        speechGain.connect(headaudio as unknown as AudioNode);
        headaudio.onvalue = applyVisemeValue;
        let lastEnded = 0;
        headaudio.onended = () => {
          lastEnded = Date.now();
          setMouthOpen(0);
        };
        headaudio.onstarted = () => {
          if (Date.now() - lastEnded > 150) {
            headRef.current?.lookAtCamera(500);
            headRef.current?.speakWithHands();
          }
        };
        headaudio.start();
        headAudioRef.current = headaudio;
        return headaudio;
      },
      [applyVisemeValue],
    );

    useEffect(() => {
      let disposed = false;

      const boot = async () => {
        try {
          setLoadLabel("Arming Origin…");
          const audioCtx = new AudioContext();
          audioCtxRef.current = audioCtx;
          const analyzer = audioCtx.createAnalyser();
          analyzer.fftSize = 256;
          analyzer.smoothingTimeConstant = 0.12;
          analyzerRef.current = analyzer;
          const speechGain = audioCtx.createGain();
          speechGain.gain.value = 1;
          speechGainRef.current = speechGain;
          analyzer.connect(speechGain);
          speechGain.connect(audioCtx.destination);

          setLoadLabel("Arming lip-sync…");
          await armHeadAudio(audioCtx, speechGain);
          if (disposed) return;

          if (ORIGIN_USE_TALKINGHEAD && mountRef.current) {
            setLoadLabel("Loading Origin mesh…");
            const head = new TalkingHead(mountRef.current, {
              ttsEndpoint: "N/A",
              lipsyncModules: ["en"],
              cameraView: "upper",
              mixerGainSpeech: 3,
              cameraDistance: -0.55,
              cameraRotateEnable: false,
              lightAmbientIntensity: 1.15,
              lightDirectIntensity: 0.9,
              lightSpotIntensity: 0.55,
            });
            headRef.current = head;
            try {
              await head.showAvatar({
                url: ORIGIN_AVATAR_URL,
                body: ORIGIN_AVATAR_BODY,
                avatarMood: "neutral",
                lipsyncLang: "en",
              });
              if (disposed) return;
              head.start();
              if (headAudioRef.current) {
                head.opt.update = headAudioRef.current.update.bind(headAudioRef.current);
                head.audioSpeechGainNode.connect(headAudioRef.current as unknown as AudioNode);
              }
              setMode("3d");
            } catch (meshError) {
              console.error("[Origin] TalkingHead mesh load failed:", meshError);
              console.error("[Origin] GLB URL:", ORIGIN_AVATAR_URL);
              console.error("[Origin] Error details:", meshError instanceof Error ? meshError.message : String(meshError));
              try {
                head.dispose();
              } catch {
                /* ignore */
              }
              headRef.current = null;
              setMode("character");
              onLoadErrorRef.current?.(`3D avatar failed to load: ${meshError instanceof Error ? meshError.message : 'Unknown error'}. Using video fallback.`);
            }
          } else {
            setMode("character");
          }

          if (disposed) return;
          setLoadLabel("");
          markReady(true);

          const tick = () => {
            const headaudio = headAudioRef.current;
            if (headaudio && typeof headaudio.update === "function") {
              headaudio.update(1 / 60);
            }
            idleRafRef.current = requestAnimationFrame(tick);
          };
          idleRafRef.current = requestAnimationFrame(tick);
        } catch (error) {
          console.warn("[Origin] boot failed", error);
          if (disposed) return;
          setMode("character");
          setLoadLabel("");
          markReady(true);
          onLoadErrorRef.current?.("Origin lip-sync arming delayed — character presence is live.");
        }
      };

      void boot();

      return () => {
        disposed = true;
        cancelAnimationFrame(idleRafRef.current);
        markReady(false);
        try {
          remoteSourceRef.current?.disconnect();
        } catch {
          /* ignore */
        }
        remoteSourceRef.current = null;
        try {
          headAudioRef.current?.stop();
        } catch {
          /* ignore */
        }
        headAudioRef.current = null;
        try {
          headRef.current?.dispose();
        } catch {
          /* ignore */
        }
        headRef.current = null;
        void audioCtxRef.current?.close().catch(() => {});
        audioCtxRef.current = null;
        analyzerRef.current = null;
        speechGainRef.current = null;
      };
    }, [armHeadAudio, markReady]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || mode !== "character") return;
      void video.play().catch(() => {});
    }, [mode]);

    useEffect(() => {
      if (!gesture) return;
      const t = window.setTimeout(() => setGestureState(null), 1600);
      return () => window.clearTimeout(t);
    }, [gesture]);

    useEffect(() => {
      if (!expression) return;
      const t = window.setTimeout(() => setExpression(null), 1200);
      return () => window.clearTimeout(t);
    }, [expression]);

    useImperativeHandle(
      ref,
      (): OriginAvatarHandle => ({
        get ready() {
          return readyRef.current;
        },
        start() {
          setPresence("idle");
          void audioCtxRef.current?.resume().catch(() => {});
          headAudioRef.current?.start();
          const head = headRef.current;
          if (head) {
            head.start();
            void head.audioCtx.resume().catch(() => {});
            head.lookAtCamera(400);
          }
          const video = videoRef.current;
          if (video?.paused) void video.play().catch(() => {});
        },
        stopSpeaking() {
          window.speechSynthesis?.cancel();
          headRef.current?.stopSpeaking();
          setMouthOpen(0);
          setPresence("idle");
        },
        setListening(listening: boolean) {
          setPresence(listening ? "listening" : "idle");
          if (listening) headRef.current?.lookAtCamera(500);
        },
        setMood(nextMood: string) {
          const resolved = ORIGIN_MOOD_ALIASES[nextMood] ?? nextMood;
          setMoodState(resolved);
          try {
            headRef.current?.setMood(resolved);
          } catch {
            /* ignore */
          }
        },
        playGesture(nextGesture: string) {
          setGestureState(nextGesture);
          try {
            headRef.current?.playGesture(nextGesture);
          } catch {
            /* ignore */
          }
        },
        speakEmoji(emoji: string) {
          setExpression(emoji);
          try {
            headRef.current?.speakEmoji(emoji);
          } catch {
            /* ignore */
          }
        },
        attachRemoteAudio(stream: MediaStream) {
          const audioCtx = audioCtxRef.current;
          const analyzer = analyzerRef.current;
          const speechGain = speechGainRef.current;
          if (!audioCtx || !analyzer || !speechGain) return;
          void audioCtx.resume().catch(() => {});
          try {
            remoteSourceRef.current?.disconnect();
          } catch {
            /* ignore */
          }
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyzer);
          source.connect(speechGain);
          remoteSourceRef.current = source;
          if (headRef.current) {
            try {
              const thSource = headRef.current.audioCtx.createMediaStreamSource(stream);
              thSource.connect(headRef.current.audioAnalyzerNode);
              thSource.connect(headRef.current.audioSpeechGainNode);
              headRef.current.isSpeaking = true;
            } catch {
              /* ignore */
            }
          }
          setPresence("speaking");
        },
        setRemoteSpeaking(speaking: boolean) {
          if (headRef.current) headRef.current.isSpeaking = speaking;
          if (!speaking) setMouthOpen(0);
          setPresence(speaking ? "speaking" : "listening");
        },
        async speakText(text: string, onSubtitles?: (chunk: string) => void) {
          const cleaned = text.replace(/\s+/g, " ").trim();
          if (!cleaned) return;
          const spoken = toSpeakableText(cleaned);
          setPresence("speaking");
          const head = headRef.current;
          if (head) {
            await new Promise<void>((resolve) => {
              try {
                head.speakText(spoken, { lipsyncLang: "en" }, (chunk) => {
                  onSubtitles?.(chunk);
                });
                const poll = window.setInterval(() => {
                  if (!head.isSpeaking) {
                    window.clearInterval(poll);
                    resolve();
                  }
                }, 80);
                window.setTimeout(() => {
                  window.clearInterval(poll);
                  resolve();
                }, Math.min(45_000, 800 + spoken.length * 70));
              } catch {
                void speakBrowserOnly(spoken, onSubtitles, setMouthOpen).finally(resolve);
              }
            });
          } else {
            await speakBrowserOnly(spoken, onSubtitles, setMouthOpen);
          }
          setMouthOpen(0);
          setPresence("idle");
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
          `origin-avatar-stage--mood-${mood}`,
          mode === "3d" ? "origin-avatar-stage--talkinghead" : "origin-avatar-stage--origin",
          gesture ? `origin-avatar-stage--gesture-${gesture}` : "",
          expression ? "origin-avatar-stage--expression" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ ["--origin-mouth-open" as string]: String(mouthOpen) }}
      >
        <div className="origin-avatar-stage__brand-plane" aria-hidden />
        {/* Keep mount in DOM when a viseme GLB is configured */}
        <div
          ref={mountRef}
          className="origin-avatar-stage__head"
          hidden={mode !== "3d"}
          aria-hidden={mode !== "3d"}
        />
        {mode !== "3d" ? (
          <div className="origin-avatar-stage__character-wrap">
            <div className="origin-avatar-stage__character-glow" aria-hidden />
            <video
              ref={videoRef}
              className="origin-avatar-stage__video origin-avatar-stage__character origin-avatar-stage__character--video"
              src={ORIGIN_CHARACTER_VIDEO}
              poster={ORIGIN_CHARACTER_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Origin — USJET.AI command android in white-and-gold armor"
            />
            <div
              ref={mouthRef}
              className="origin-avatar-stage__mouth"
              aria-hidden
              style={{ transform: `translate(-50%, 0) scaleY(${0.12 + mouthOpen * 1.45})` }}
            />
            {expression ? (
              <span className="origin-avatar-stage__expression" aria-hidden>
                {expression}
              </span>
            ) : null}
          </div>
        ) : null}
        {!ready || loadLabel ? (
          <div className="origin-avatar-stage__boot" role="status">
            <img src={ORIGIN_CHARACTER_POSTER} alt="" className="origin-avatar-stage__boot-poster" />
            <p>{loadLabel || "Arming Origin…"}</p>
          </div>
        ) : null}
        <div className="origin-avatar-stage__presence" aria-hidden>
          <span className={`origin-avatar-stage__dot origin-avatar-stage__dot--${presence}`} />
          <span>
            Origin · {presence}
            {mood !== "neutral" ? ` · ${mood}` : ""}
          </span>
        </div>
      </div>
    );
  },
);

export default OriginAvatarStage;

function speakBrowserOnly(
  text: string,
  onSubtitles?: (chunk: string) => void,
  onMouth?: (open: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      onSubtitles?.(text);
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickBrowserVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 1.02;
    utterance.pitch = 1;
    let pulse: number | undefined;
    utterance.onstart = () => {
      pulse = window.setInterval(() => {
        onMouth?.(0.25 + Math.random() * 0.55);
      }, 90);
    };
    utterance.onboundary = (event) => {
      if (event.name === "word" && typeof event.charIndex === "number") {
        onSubtitles?.(text.slice(0, event.charIndex + (event.charLength ?? 0)));
        onMouth?.(0.35 + Math.random() * 0.45);
      }
    };
    utterance.onend = () => {
      if (pulse) window.clearInterval(pulse);
      onMouth?.(0);
      onSubtitles?.(text);
      resolve();
    };
    utterance.onerror = () => {
      if (pulse) window.clearInterval(pulse);
      onMouth?.(0);
      resolve();
    };
    onSubtitles?.(text.slice(0, Math.min(48, text.length)));
    window.speechSynthesis.speak(utterance);
  });
}
