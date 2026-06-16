import { Link, useSearchParams } from "react-router-dom";
import { Mic, Shield, Volume2, VolumeX, Wrench } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AuraFrame from "../components/aura/AuraFrame";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import OriginBrowserConnectModal from "../components/origin/OriginBrowserConnectModal";
import OriginMemberStrip from "../components/origin/OriginMemberStrip";
import EkgPulseLine from "../components/intel/EkgPulseLine";
import DeveloperRedBlinkName from "../components/DeveloperRedBlinkName";
import { fleetManifest } from "../data/fleetManifest";
import { integratedLaunchUrl } from "../lib/fleetLaunchUrl";
import {
  isConnectGuideIntent,
  ORIGIN_CONNECT_ACK,
  ORIGIN_CONNECT_PROMPT,
} from "../lib/originConnectGuide";
import {
  buildOpenRouterMessages,
  completeChat,
  OPENROUTER_API_KEY,
} from "../lib/openrouter";
import {
  buildOriginMemberContext,
  readMemberProjects,
} from "../lib/memberProjectTracker";
import {
  adoptCsSubjectFromText,
  augmentMemberContextForCs,
  buildCsEstablishSubjectSpokenReply,
  buildCsGuestVerificationSpokenReply,
  buildCsOverwhelmSpokenReply,
  buildCsOverwhelmSystemNudge,
  buildCsSubjectSystemNudge,
  buildCsTopicShiftSpokenReply,
  buildCsVerificationSystemNudge,
  bumpCsUserTurn,
  detectCsOverwhelm,
  detectCsTopicShift,
  detectCsVerificationIntent,
  readOriginCsSubjectState,
  seedCsSubjectFromMember,
} from "../lib/originCsSubject";
import {
  buildOriginCsMemberScreenGreet,
  buildOriginCsMemberSpokenGreet,
  ORIGIN_SPOKEN_LOAD_GREET,
  ORIGIN_SPOKEN_WELCOME,
  ORIGIN_CS_SPOKEN_GREET,
  ORIGIN_CS_SCREEN_GREET,
  speakWithBrandVoice,
} from "../lib/speakableBrand";
import { isOriginCustomerServiceEntry } from "../lib/memberAccessLevel";
import { useMemberAuth } from "../context/MemberAuthContext";

import type { FleetAuraMode } from "../types/fleet";

type OriginInteractionState = "idle" | "listening" | "processing" | "speaking";

const COMMAND_ROUTES = [
  { to: "/hangar", label: "Hangar" },
  { to: "/intel", label: "Intel Pulse" },
  { to: "/founder", label: "Founder" },
  { to: "/special", label: "Founder Special" },
] as const;

const BULLETIN_LINES = [
  "ORIGIN CORE ONLINE — COMMAND AUTHORITY OVER 30 PARTNER AIS",
  "HANGAR LINKS: DIRECT FLIGHT TO GEMINI · CHATGPT · CLAUDE · PERPLEXITY · GROK",
  "INTEL PULSE: CYAN EKG + LIVE MARKET CANDLES — WRENCHES NOT SLIDES",
  "FLEET MANIFEST: 29 EXTERNAL COCKPITS + 1 USJET ORIGIN COMMAND NODE",
  "LAT 40.7128° N · LONG 74.0060° W · PROTOCOL USJET-v5 · LIQUID GLASS ACTIVE",
];

const ORIGIN_IDLE_STATUS = "Tap Aura when ready to speak";
const ORIGIN_SPEAKERS_OFF_STATUS = "Speakers off — USJET website audio muted";

const AURA_STATE_LABELS: Record<OriginInteractionState, string> = {
  idle: "Origin idle — tap Aura to listen",
  listening: "Origin listening for your question",
  processing: "Origin processing your question",
  speaking: "Aura speaking — tap to mute website audio",
};

/** Spoken briefing from the Speak control — separate from conversational loop */
const ORIGIN_WELCOME = ORIGIN_SPOKEN_WELCOME;

/** Short greet on load — speakableBrand renders as U. S. Jet */
const ORIGIN_LOAD_GREET = ORIGIN_SPOKEN_LOAD_GREET;

/** Pause after last speech chunk before treating utterance as complete */
const UTTERANCE_SILENCE_MS = 700;
/** Shorter dead-air when the recognizer marks a final segment */
const UTTERANCE_FINAL_MS = 450;

/** Spoken when Aura link is not live — no deployment jargon in TTS */
const ORIGIN_OFFLINE_PROMPT = ORIGIN_CONNECT_PROMPT;

const ORIGIN_AURA_LINK_LOST =
  "Origin online. Aura link is quiet right now — mic is still live. Try again in a moment, Commander.";

type ChatTurn = { role: "user" | "assistant"; content: string };

/** Survives React Strict Mode remount — true once welcome audio actually starts */
let originWelcomeAudioStarted = false;
/** Survives Strict Mode remount — bootstrap finished (welcome done + mic path armed) */
let originBootstrapDone = false;

function bulletinTrackText(): string {
  return BULLETIN_LINES.map((line) => `◆ ${line}`).join("     ");
}

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognition)
  | undefined {
  return (
    window.SpeechRecognition ??
    (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition
  );
}

function isIosLike(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function collectRecognitionTranscript(event: SpeechRecognitionEvent): {
  text: string;
  hasFinal: boolean;
} {
  let text = "";
  let hasFinal = false;
  for (let i = 0; i < event.results.length; i += 1) {
    const result = event.results[i];
    text += result?.[0]?.transcript ?? "";
    if (result?.isFinal) hasFinal = true;
  }
  return { text: text.trim(), hasFinal };
}

export default function Origin() {
  const [searchParams] = useSearchParams();
  const { session } = useMemberAuth();
  const isCustomerServiceEntry = isOriginCustomerServiceEntry(`?${searchParams.toString()}`);
  const loadGreet = useMemo(() => {
    if (isCustomerServiceEntry && session?.active) {
      return buildOriginCsMemberSpokenGreet(session);
    }
    return isCustomerServiceEntry ? ORIGIN_CS_SPOKEN_GREET : ORIGIN_LOAD_GREET;
  }, [isCustomerServiceEntry, session]);
  const csScreenGreet = useMemo(() => {
    if (isCustomerServiceEntry && session?.active) {
      return buildOriginCsMemberScreenGreet(session);
    }
    return ORIGIN_CS_SCREEN_GREET;
  }, [isCustomerServiceEntry, session]);
  const memberContext = useMemo(
    () => buildOriginMemberContext(session?.active ? session : null),
    [session],
  );

  const [micEnabled, setMicEnabled] = useState(false);
  const [interactionState, setInteractionState] = useState<OriginInteractionState>("idle");
  const [speakLive, setSpeakLive] = useState(false);
  const [siteMuted, setSiteMuted] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [showBrowserConnect, setShowBrowserConnect] = useState(false);
  const [showAutoplayBanner, setShowAutoplayBanner] = useState(false);
  const [statusLine, setStatusLine] = useState("Status: Online // Port 8080 Active");
  const micEnabledRef = useRef(false);
  const interactionStateRef = useRef<OriginInteractionState>("idle");
  const speakLiveRef = useRef(false);
  const siteMutedRef = useRef(false);
  const bootstrapRef = useRef(false);
  const greetStartedRef = useRef(false);
  const autoplayProbeRef = useRef<number | null>(null);
  const pendingTranscriptRef = useRef("");
  const silenceTimerRef = useRef<number | null>(null);
  const processingRef = useRef(false);
  const listeningPausedRef = useRef(false);
  const chatTurnsRef = useRef<ChatTurn[]>([]);
  const restartRecognitionRef = useRef<() => void>(() => undefined);
  const handleTranscriptRef = useRef<(raw: string) => void>(() => undefined);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speakHandleRef = useRef<{ cancel: () => void } | null>(null);
  const voiceSpeakingRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const sortedFleet = useMemo(
    () => [...fleetManifest].sort((a, b) => a.slot - b.slot),
    [],
  );

  const setInteraction = useCallback((state: OriginInteractionState) => {
    interactionStateRef.current = state;
    setInteractionState(state);
  }, []);

  const clearAutoplayProbe = useCallback(() => {
    if (autoplayProbeRef.current !== null) {
      window.clearTimeout(autoplayProbeRef.current);
      autoplayProbeRef.current = null;
    }
  }, []);

  const armSpeakChannel = useCallback(() => {
    speakLiveRef.current = true;
    setSpeakLive(true);
    setShowAutoplayBanner(false);
    clearAutoplayProbe();
  }, [clearAutoplayProbe]);

  const disarmSpeakChannel = useCallback(() => {
    speakLiveRef.current = false;
    setSpeakLive(false);
  }, []);

  const setSiteMutedState = useCallback((muted: boolean) => {
    siteMutedRef.current = muted;
    setSiteMuted(muted);
  }, []);

  const muteSiteAudio = useCallback(() => {
    speakHandleRef.current?.cancel();
    speakHandleRef.current = null;
    voiceSpeakingRef.current = false;
    window.speechSynthesis?.cancel();
    disarmSpeakChannel();
    setSiteMutedState(true);
    if (interactionStateRef.current === "speaking") {
      setInteraction("idle");
    }
    setStatusLine(ORIGIN_SPEAKERS_OFF_STATUS);
  }, [disarmSpeakChannel, setInteraction, setSiteMutedState]);

  useEffect(() => {
    if (isCustomerServiceEntry && chatTurnsRef.current.length === 0) {
      chatTurnsRef.current = [{ role: "assistant", content: csScreenGreet }];
    }
  }, [csScreenGreet, isCustomerServiceEntry]);

  useEffect(() => {
    if (isCustomerServiceEntry) {
      seedCsSubjectFromMember(session?.active ? session : null);
    }
  }, [isCustomerServiceEntry, session]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Origin · USJet.ai Command";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    speakHandleRef.current?.cancel();
    speakHandleRef.current = null;
    voiceSpeakingRef.current = false;
    window.speechSynthesis?.cancel();
    setInteraction("idle");
    setStatusLine((line) =>
      line.startsWith("Transmitting") ||
      line.startsWith("Voice transmit") ||
      line.startsWith("Origin acknowledging") ||
      line.startsWith("Origin responding")
        ? ORIGIN_IDLE_STATUS
        : line,
    );
  }, [setInteraction]);

  const stopAudioLevelLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setVoiceLevel(0);
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const stopRecognition = useCallback(() => {
    clearSilenceTimer();
    pendingTranscriptRef.current = "";
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    try {
      recognition.stop();
    } catch {
      /* already stopped */
    }
  }, [clearSilenceTimer]);

  const pauseListening = useCallback(() => {
    listeningPausedRef.current = true;
    clearSilenceTimer();
    pendingTranscriptRef.current = "";
    stopRecognition();
  }, [clearSilenceTimer, stopRecognition]);

  const enterIdle = useCallback(
    (status = ORIGIN_IDLE_STATUS) => {
      processingRef.current = false;
      pauseListening();
      setInteraction("idle");
      setStatusLine(status);
    },
    [pauseListening, setInteraction],
  );

  const disableMic = useCallback(() => {
    micEnabledRef.current = false;
    setMicEnabled(false);
    processingRef.current = false;
    stopRecognition();
    stopAudioLevelLoop();
    enterIdle("Status: Online // 8080 Active");
  }, [enterIdle, stopAudioLevelLoop, stopRecognition]);

  const speakOriginReply = useCallback(
    (text: string, onComplete?: () => void) => {
      if (siteMutedRef.current) {
        onComplete?.();
        return;
      }

      if (!("speechSynthesis" in window)) {
        onComplete?.();
        return;
      }

      speakHandleRef.current?.cancel();
      pauseListening();
      setInteraction("speaking");
      setStatusLine("Origin responding…");

      const handle = speakWithBrandVoice(text, {
        rate: 0.95,
        pitch: 0.92,
        onStart: () => {
          voiceSpeakingRef.current = true;
          armSpeakChannel();
        },
        onEnd: () => {
          voiceSpeakingRef.current = false;
          speakHandleRef.current = null;
          if (siteMutedRef.current) return;
          onComplete?.();
        },
        onError: () => {
          voiceSpeakingRef.current = false;
          speakHandleRef.current = null;
          if (siteMutedRef.current) return;
          onComplete?.();
        },
      });

      if (handle) {
        speakHandleRef.current = handle;
      } else {
        onComplete?.();
      }
    },
    [armSpeakChannel, pauseListening, setInteraction],
  );

  const openBrowserConnectModal = useCallback(() => {
    setShowBrowserConnect(true);
  }, []);

  const closeBrowserConnectModal = useCallback(() => {
    setShowBrowserConnect(false);
  }, []);

  const finishTranscriptCycle = useCallback(() => {
    enterIdle();
  }, [enterIdle]);

  const enterProcessing = useCallback(() => {
    processingRef.current = true;
    listeningPausedRef.current = true;
    clearSilenceTimer();
    pendingTranscriptRef.current = "";
    stopRecognition();
    setInteraction("processing");
    setStatusLine("Origin thinking…");
  }, [clearSilenceTimer, setInteraction, stopRecognition]);

  const handleTranscript = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (
        !text ||
        processingRef.current ||
        interactionStateRef.current !== "listening"
      ) {
        return;
      }

      setStatusLine(`Heard: “${text.slice(0, 72)}${text.length > 72 ? "…" : ""}”`);

      if (isConnectGuideIntent(text)) {
        setStatusLine("Origin online — browser connect guide");
        speakOriginReply(ORIGIN_CONNECT_ACK, () => {
          openBrowserConnectModal();
          finishTranscriptCycle();
        });
        return;
      }

      if (!OPENROUTER_API_KEY) {
        const offlineReply = ORIGIN_OFFLINE_PROMPT;
        setStatusLine("Origin online — standby briefing");
        speakOriginReply(offlineReply, () => {
          openBrowserConnectModal();
          finishTranscriptCycle();
        });
        return;
      }

      enterProcessing();

      const turns = [...chatTurnsRef.current, { role: "user" as const, content: text }];
      chatTurnsRef.current = turns;

      let csPreface: string | null = null;
      const csNudges: string[] = [];
      let csState = readOriginCsSubjectState();

      if (isCustomerServiceEntry) {
        csState = seedCsSubjectFromMember(session?.active ? session : null);
        const projects = session?.active ? readMemberProjects(session.customerId) : [];

        if (detectCsOverwhelm(text)) {
          csPreface = buildCsOverwhelmSpokenReply();
          csNudges.push(buildCsOverwhelmSystemNudge());
        } else if (detectCsVerificationIntent(text)) {
          if (session?.active) {
            csNudges.push(buildCsVerificationSystemNudge(true));
          } else {
            csPreface = buildCsGuestVerificationSpokenReply();
            csNudges.push(buildCsVerificationSystemNudge(false));
          }
        } else {
          const shift = detectCsTopicShift(text, csState, projects);
          if (shift.shifted) {
            csPreface = buildCsTopicShiftSpokenReply(csState);
            csNudges.push(buildCsSubjectSystemNudge(csState));
          } else {
            csState = adoptCsSubjectFromText(text, csState, session?.active ? session : null);
            if (!csState.activeCsSubject && csState.userTurnCount === 0) {
              csPreface = buildCsEstablishSubjectSpokenReply();
            }
          }
        }

        csState = bumpCsUserTurn(csState);
      }

      const augmentedMemberContext = isCustomerServiceEntry
        ? augmentMemberContextForCs(memberContext, csState, csNudges)
        : memberContext;

      try {
        const reply = await completeChat(
          OPENROUTER_API_KEY,
          buildOpenRouterMessages(turns, {
            entry: isCustomerServiceEntry ? "customer-service" : undefined,
            memberContext: augmentedMemberContext,
          }),
        );
        chatTurnsRef.current = [...turns, { role: "assistant", content: reply }];
        const deliverReply = () => {
          speakOriginReply(reply, () => {
            finishTranscriptCycle();
          });
        };
        if (csPreface) {
          speakOriginReply(csPreface, deliverReply);
        } else {
          deliverReply();
        }
      } catch {
        speakOriginReply(ORIGIN_AURA_LINK_LOST, () => {
          finishTranscriptCycle();
        });
      }
    },
    [
      enterProcessing,
      finishTranscriptCycle,
      openBrowserConnectModal,
      speakOriginReply,
      isCustomerServiceEntry,
      memberContext,
      session,
    ],
  );

  handleTranscriptRef.current = (raw: string) => {
    void handleTranscript(raw);
  };

  const scheduleTranscriptProcessing = useCallback((delayMs = UTTERANCE_SILENCE_MS) => {
    clearSilenceTimer();
    silenceTimerRef.current = window.setTimeout(() => {
      silenceTimerRef.current = null;
      const text = pendingTranscriptRef.current.trim();
      pendingTranscriptRef.current = "";
      if (text) {
        handleTranscriptRef.current(text);
      }
    }, delayMs);
  }, [clearSilenceTimer]);

  const restartRecognition = useCallback(() => {
    if (
      interactionStateRef.current !== "listening" ||
      !micEnabledRef.current ||
      listeningPausedRef.current ||
      processingRef.current ||
      voiceSpeakingRef.current
    ) {
      return;
    }

    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) return;

    stopRecognition();

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    recognition.continuous = !isIosLike();
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      if (
        processingRef.current ||
        listeningPausedRef.current ||
        interactionStateRef.current !== "listening"
      ) {
        return;
      }

      const { text, hasFinal } = collectRecognitionTranscript(event);
      if (!text) return;

      pendingTranscriptRef.current = text;
      setStatusLine(
        `Listening: “${text.slice(0, 72)}${text.length > 72 ? "…" : ""}”`,
      );
      scheduleTranscriptProcessing(hasFinal ? UTTERANCE_FINAL_MS : UTTERANCE_SILENCE_MS);
    };

    recognition.onerror = (event) => {
      if (!micEnabledRef.current || listeningPausedRef.current) return;

      const speechError = (event as SpeechRecognitionErrorEvent).error;
      if (speechError === "no-speech" || speechError === "aborted") {
        window.setTimeout(() => restartRecognitionRef.current(), 120);
        return;
      }

      if (speechError === "network") {
        window.setTimeout(() => restartRecognitionRef.current(), 400);
        return;
      }

      setShowTroubleshoot(true);
      disableMic();
      setStatusLine("Mic channel error — troubleshoot open.");
    };

    recognition.onend = () => {
      if (
        interactionStateRef.current !== "listening" ||
        !micEnabledRef.current ||
        listeningPausedRef.current ||
        processingRef.current ||
        voiceSpeakingRef.current
      ) {
        return;
      }
      window.setTimeout(() => restartRecognitionRef.current(), 80);
    };

    try {
      recognition.start();
    } catch {
      window.setTimeout(() => restartRecognitionRef.current(), 200);
    }
  }, [disableMic, scheduleTranscriptProcessing, stopRecognition]);

  restartRecognitionRef.current = restartRecognition;

  const speakWelcomeGreet = useCallback(
    (onComplete?: () => void) => {
      if (!("speechSynthesis" in window)) {
        onComplete?.();
        return;
      }

      greetStartedRef.current = false;
      clearAutoplayProbe();

      speakHandleRef.current?.cancel();
      setInteraction("speaking");
      setStatusLine("Origin voice channel opening…");

      autoplayProbeRef.current = window.setTimeout(() => {
        if (!greetStartedRef.current) {
          setShowAutoplayBanner(true);
          enterIdle("Tap banner to enable Origin voice");
        }
      }, 1800);

      const handle = speakWithBrandVoice(loadGreet, {
        rate: 0.95,
        pitch: 0.92,
        onStart: () => {
          voiceSpeakingRef.current = true;
          greetStartedRef.current = true;
          originWelcomeAudioStarted = true;
          armSpeakChannel();
        },
        onEnd: () => {
          voiceSpeakingRef.current = false;
          speakHandleRef.current = null;
          clearAutoplayProbe();
          if (siteMutedRef.current) return;
          originBootstrapDone = true;
          onComplete?.();
        },
        onError: () => {
          voiceSpeakingRef.current = false;
          speakHandleRef.current = null;
          clearAutoplayProbe();
          if (siteMutedRef.current) return;
          if (!greetStartedRef.current) {
            setShowAutoplayBanner(true);
            setStatusLine("Voice transmit blocked — tap banner to enable.");
            return;
          }
          originBootstrapDone = true;
          onComplete?.();
        },
      });

      if (handle) {
        speakHandleRef.current = handle;
      } else {
        setShowAutoplayBanner(true);
        setStatusLine("Tap banner to enable Origin voice");
      }
    },
    [armSpeakChannel, clearAutoplayProbe, enterIdle, loadGreet, setInteraction],
  );

  const enableMicSession = useCallback(async () => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) {
      setShowTroubleshoot(true);
      setStatusLine("Speech recognition not supported — see troubleshoot.");
      return;
    }

    if (micEnabledRef.current) return;

    micEnabledRef.current = true;
    setMicEnabled(true);
    setStatusLine("Opening Origin mic channel…");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!micEnabledRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        if (!micEnabledRef.current || !analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) sum += data[i];
        const avg = sum / data.length / 255;
        setVoiceLevel(avg);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      restartRecognitionRef.current();
      setInteraction("listening");
      setStatusLine("Mic live — Origin listening");
    } catch {
      micEnabledRef.current = false;
      setMicEnabled(false);
      setShowTroubleshoot(true);
      stopAudioLevelLoop();
      if (isIosLike()) {
        setShowAutoplayBanner(true);
        setStatusLine("Tap Enable Origin voice — iPhone requires a tap for mic access.");
      } else {
        setStatusLine("Microphone permission denied.");
      }
    }
  }, [setInteraction, stopAudioLevelLoop]);

  const enterListening = useCallback(async () => {
    if (
      interactionStateRef.current === "processing" ||
      interactionStateRef.current === "speaking"
    ) {
      return;
    }

    if (!micEnabledRef.current) {
      await enableMicSession();
      return;
    }

    listeningPausedRef.current = false;
    processingRef.current = false;
    setInteraction("listening");
    setStatusLine("Mic live — Origin listening");
    restartRecognitionRef.current();
  }, [enableMicSession, setInteraction]);

  const enableMic = useCallback(async () => {
    stopSpeaking();
    await enterListening();
  }, [enterListening, stopSpeaking]);

  const resumeAutoplayVoice = useCallback(() => {
    setSiteMutedState(false);
    speakWelcomeGreet(() => {
      enterIdle();
    });
  }, [enterIdle, setSiteMutedState, speakWelcomeGreet]);

  const startSpeak = useCallback(() => {
    disableMic();
    stopSpeaking();
    setSiteMutedState(false);

    if (!("speechSynthesis" in window)) {
      setStatusLine("Speech output unavailable in this browser.");
      return;
    }

    setInteraction("speaking");
    setStatusLine("Transmitting Origin briefing…");

    const handle = speakWithBrandVoice(ORIGIN_WELCOME, {
      rate: 0.95,
      pitch: 0.92,
      onStart: () => {
        voiceSpeakingRef.current = true;
        armSpeakChannel();
      },
      onEnd: () => {
        voiceSpeakingRef.current = false;
        speakHandleRef.current = null;
        if (siteMutedRef.current) return;
        enterIdle("Status: Online // 8080 Active");
      },
      onError: () => {
        voiceSpeakingRef.current = false;
        speakHandleRef.current = null;
        if (siteMutedRef.current) return;
        enterIdle("Voice transmit interrupted.");
      },
    });

    if (!handle) {
      enterIdle("Speech output unavailable in this browser.");
      return;
    }

    speakHandleRef.current = handle;
  }, [armSpeakChannel, disableMic, enterIdle, setInteraction, setSiteMutedState, stopSpeaking]);

  const handleAuraClick = useCallback(() => {
    if (
      interactionStateRef.current === "speaking" ||
      speakLiveRef.current ||
      voiceSpeakingRef.current
    ) {
      muteSiteAudio();
      return;
    }

    if (interactionStateRef.current === "idle") {
      void enterListening();
    }
  }, [enterListening, muteSiteAudio]);

  useEffect(() => {
    if (bootstrapRef.current) return;
    bootstrapRef.current = true;

    if (originBootstrapDone) {
      if (isIosLike()) {
        setShowAutoplayBanner(true);
        setStatusLine("Tap Enable Origin voice to open mic on iPhone.");
      } else {
        enterIdle();
      }
      return;
    }

    if (originWelcomeAudioStarted) {
      originBootstrapDone = true;
      if (isIosLike()) {
        setShowAutoplayBanner(true);
        setStatusLine("Tap Enable Origin voice to open mic on iPhone.");
      } else {
        enterIdle();
      }
      return;
    }

    speakWelcomeGreet(() => {
      if (isIosLike()) {
        setShowAutoplayBanner(true);
        setStatusLine("Tap Enable Origin voice to open mic on iPhone.");
        return;
      }
      enterIdle();
    });
  }, [enterIdle, speakWelcomeGreet]);

  useEffect(
    () => () => {
      clearAutoplayProbe();
      clearSilenceTimer();
      disableMic();
      stopSpeaking();
      disarmSpeakChannel();
    },
    [clearAutoplayProbe, clearSilenceTimer, disableMic, disarmSpeakChannel, stopSpeaking],
  );

  const isSpeaking = interactionState === "speaking";
  const speakersLive = speakLive || isSpeaking;
  const speakButtonMuted = siteMuted && !speakersLive;

  const shellClass = [
    "origin-voice-shell",
    `origin-voice-shell--${interactionState}`,
    siteMuted ? "origin-voice-shell--site-muted" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const shieldAura: FleetAuraMode =
    interactionState === "speaking"
      ? "talking"
      : interactionState === "processing"
        ? "processing"
        : interactionState === "listening"
          ? "listening"
          : "idle";

  return (
    <div className="origin-page page-atmosphere page-nav-offset relative min-h-screen overflow-hidden pb-24">
      <div className="origin-page__ekg" aria-hidden>
        <EkgPulseLine variant="hero" seed={29} />
      </div>

      <button
        type="button"
        className="origin-troubleshoot-btn"
        onClick={() => setShowTroubleshoot(true)}
      >
        <Wrench size={12} aria-hidden />
        Troubleshoot
      </button>

      <div className="origin-page__shell mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6">
        <header className="origin-page__header mb-10 text-center">
          <UsjetWordmark size="hero" className="origin-page__wordmark" />
          <p className="origin-page__kicker">Command node · Bay 30</p>
          <h1 className="origin-page__title">Origin Intelligence Core</h1>
          <p className="origin-page__lede">
            {isCustomerServiceEntry
              ? "Customer Service routes here — Aura handles support and fleet guidance from the sovereign command node."
              : "The only bay that commands the full fleet. Thirty partner AIs report through this node — you fly the hangar, not a single vendor silo."}
          </p>
        </header>

        {session?.active ? <OriginMemberStrip session={session} /> : null}

        <div className="origin-page__core mb-12 flex w-full max-w-3xl flex-col items-center">
          {isCustomerServiceEntry ? (
            <p className="origin-page__cs-greet mb-4 max-w-lg text-center text-sm leading-relaxed text-cyan-200/90">
              {csScreenGreet}
            </p>
          ) : null}
          {showAutoplayBanner ? (
            <div className="origin-autoplay-banner mb-4 w-full max-w-lg" role="status">
              <p className="origin-autoplay-banner__text">
                {isIosLike()
                  ? "iPhone needs one tap to open voice and mic. Tap below, then speak to Origin."
                  : "Browser blocked auto voice. Tap once to hear the Origin welcome."}
              </p>
              <button type="button" className="origin-autoplay-banner__btn" onClick={resumeAutoplayVoice}>
                Enable Origin voice
              </button>
            </div>
          ) : null}
          <div
            className={shellClass}
            style={{ ["--voice-level" as string]: String(voiceLevel.toFixed(3)) }}
          >
            <span className="origin-voice-ripple origin-voice-ripple--a" aria-hidden />
            <span className="origin-voice-ripple origin-voice-ripple--b" aria-hidden />
            <span className="origin-voice-ripple origin-voice-ripple--c" aria-hidden />

            <button
              type="button"
              className={`group absolute -left-6 top-1/2 z-10 -translate-y-1/2 rounded-full border p-5 shadow-xl backdrop-blur-xl transition-all sm:-left-28 ${
                interactionState === "listening"
                  ? "border-cyan-400/60 bg-cyan-500/10 hover:border-cyan-300/80 hover:bg-cyan-500/15"
                  : "border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10"
              }`}
              onClick={interactionState === "listening" ? disableMic : () => void enterListening()}
              aria-pressed={interactionState === "listening"}
              aria-label={
                interactionState === "listening" ? "Turn off Origin mic" : "Turn on Origin mic"
              }
            >
              <Mic
                className={`h-8 w-8 transition-colors ${
                  interactionState === "listening" ? "text-cyan-300" : "text-white/40 group-hover:text-cyan-400"
                }`}
              />
              <span
                className={`absolute -bottom-8 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-widest sm:block ${
                  interactionState === "listening" ? "text-cyan-300" : "text-white/20 group-hover:text-cyan-400"
                }`}
              >
                {interactionState === "listening" ? "Stop" : "Mic"}
              </span>
            </button>

            <button
              type="button"
              className="origin-shield-hit"
              onClick={handleAuraClick}
              aria-pressed={interactionState === "listening" || interactionState === "speaking"}
              aria-label={AURA_STATE_LABELS[interactionState]}
            >
              <AuraFrame
                aura={shieldAura}
                variant="orb"
                className={`origin-aura origin-aura--${interactionState} h-56 w-56 sm:h-72 sm:w-72`}
              >
                <Shield className="relative z-20 h-14 w-14 text-white/90 sm:h-16 sm:w-16" strokeWidth={1} />
              </AuraFrame>
            </button>

            <button
              type="button"
              className={`group absolute -right-6 top-1/2 z-10 -translate-y-1/2 rounded-full border p-5 shadow-xl backdrop-blur-xl transition-all sm:-right-28 ${
                speakersLive
                  ? "border-cyan-400/60 bg-cyan-500/10 hover:border-cyan-300/80 hover:bg-cyan-500/15"
                  : speakButtonMuted
                    ? "border-amber-400/50 bg-amber-500/10 hover:border-amber-300/70 hover:bg-amber-500/15"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10"
              }`}
              onClick={speakersLive ? muteSiteAudio : startSpeak}
              aria-pressed={speakersLive || speakButtonMuted}
              aria-label={
                speakersLive
                  ? "Mute website audio"
                  : speakButtonMuted
                    ? "Turn USJET website audio back on"
                    : "Turn on website audio"
              }
              title={
                speakersLive
                  ? "Mute website audio — speakers off to USJET"
                  : speakButtonMuted
                    ? "Speakers off — tap to turn USJET audio back on"
                    : "Turn on website audio"
              }
            >
              {speakersLive || speakButtonMuted ? (
                <VolumeX
                  className={`h-8 w-8 transition-colors ${
                    speakersLive ? "text-cyan-300" : "text-amber-300/90"
                  }`}
                />
              ) : (
                <Volume2
                  className="h-8 w-8 text-white/40 transition-colors group-hover:text-cyan-400"
                />
              )}
              <span
                className={`absolute -bottom-8 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-widest sm:block ${
                  speakersLive
                    ? "text-cyan-300"
                    : speakButtonMuted
                      ? "text-amber-300/80"
                      : "text-white/20 group-hover:text-cyan-400"
                }`}
              >
                {speakersLive ? "Mute" : speakButtonMuted ? "Speakers off" : "Speak"}
              </span>
            </button>
          </div>

          <p
            className="origin-page__status mt-8 font-mono text-[10px] uppercase tracking-widest text-cyan-300/70"
            role="status"
            aria-live="polite"
          >
            {statusLine}
          </p>
          <button
            type="button"
            className="origin-connect-btn"
            onClick={openBrowserConnectModal}
          >
            Connect through your browser
          </button>
        </div>

        <GlassEffectContainer className="origin-page__deck glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan mb-10 w-full max-w-4xl flex-col items-stretch gap-0 p-0">
          <div className="origin-page__deck-head">
            <p className="origin-page__deck-kicker">USJET command deck</p>
            <p className="origin-page__deck-title">Internal routes</p>
          </div>
          <nav className="origin-page__deck-nav" aria-label="USJET command routes">
            {COMMAND_ROUTES.map((route) => (
              <Link key={route.to} to={route.to} className="origin-page__deck-link btn-glass glass-effect-interactive">
                {route.label}
              </Link>
            ))}
          </nav>
        </GlassEffectContainer>

        <section className="origin-page__fleet w-full max-w-5xl" aria-labelledby="origin-fleet-heading">
          <div className="origin-page__fleet-head">
            <h2 id="origin-fleet-heading" className="origin-page__fleet-title">
              Fleet manifest — 30 bays
            </h2>
            <p className="origin-page__fleet-copy">Launch any partner from Origin — integrated navigation across the fleet.</p>
          </div>
          <div className="origin-page__fleet-grid">
            {sortedFleet.map((unit) => {
              const url = integratedLaunchUrl(unit.domain, unit.href, unit.slot, {
                returnTo: "/origin",
                label: unit.name,
              });
              const isOrigin = unit.href === "/origin" || unit.slot === 29;

              if (isOrigin) {
                return (
                  <span
                    key={unit.id}
                    className="origin-page__fleet-chip origin-page__fleet-chip--command"
                    aria-current="page"
                  >
                    <span className="origin-page__fleet-slot">30</span>
                    <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
                  </span>
                );
              }

              return (
                <a
                  key={unit.id}
                  href={url}
                  className="origin-page__fleet-chip"
                >
                  <span className="origin-page__fleet-slot">{String(unit.slot + 1).padStart(2, "0")}</span>
                  <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
                </a>
              );
            })}
          </div>
        </section>
      </div>

      <div className="origin-intel-bulletin" aria-hidden>
        <div className="origin-intel-bulletin__track">
          <span className="origin-intel-bulletin__text">{bulletinTrackText()}</span>
          <span className="origin-intel-bulletin__text">{bulletinTrackText()}</span>
        </div>
      </div>

      <div className="origin-page__hud origin-page__hud--left font-mono text-[10px] uppercase tracking-tighter text-white/25">
        <p>Lat: 40.7128° N</p>
        <p>Long: 74.0060° W</p>
      </div>
      <div className="origin-page__hud origin-page__hud--right text-right font-mono text-[10px] uppercase tracking-tighter text-white/25">
        <p>Protocol: USJET-v5</p>
        <p>System: Liquid Glass</p>
      </div>

      <OriginBrowserConnectModal
        open={showBrowserConnect}
        onClose={closeBrowserConnectModal}
        onRequestMic={enableMic}
      />

      {showTroubleshoot ? (
        <>
          <button
            type="button"
            className="origin-troubleshoot-backdrop"
            aria-label="Close troubleshoot"
            onClick={() => setShowTroubleshoot(false)}
          />
          <div className="origin-troubleshoot-panel" role="dialog" aria-labelledby="origin-troubleshoot-title">
            <h2 id="origin-troubleshoot-title" className="origin-troubleshoot-panel__title">
              Voice troubleshoot
            </h2>
            <p className="origin-troubleshoot-panel__body">
              Origin needs microphone permission for Mic mode. Use HTTPS, allow mic access in browser settings,
              and try again. Speak mode uses your device voice synthesizer — no mic required.
            </p>
            <div className="origin-troubleshoot-panel__actions">
              <button type="button" className="origin-troubleshoot-panel__btn" onClick={enableMic}>
                Retry mic
              </button>
              <button type="button" className="origin-troubleshoot-panel__btn" onClick={startSpeak}>
                Test speak
              </button>
              <button
                type="button"
                className="origin-troubleshoot-panel__btn origin-troubleshoot-panel__btn--ghost"
                onClick={() => setShowTroubleshoot(false)}
              >
                Dismiss
              </button>
            </div>
            <p className="origin-troubleshoot-panel__mono">Origin / Bay 30 / SOVEREIGN-30</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
