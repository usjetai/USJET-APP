import { Link } from "react-router-dom";
import { Mic, Shield, Volume2, Wrench } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AuraFrame from "../components/aura/AuraFrame";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import EkgPulseLine from "../components/intel/EkgPulseLine";
import { fleetManifest } from "../data/fleetManifest";
import { integratedLaunchUrl } from "../lib/fleetLaunchUrl";
import { speakWithBrandVoice } from "../lib/speakableBrand";

type VoiceMode = "idle" | "speaking";

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

const ORIGIN_WELCOME =
  "Welcome to USJET. USJET Origin online. Thirty partner systems are networked. Hangar bays launch direct. Intel pulse is live. Command acknowledged.";

const ORIGIN_MIC_GREET = "Welcome to USJET. USJET Origin online.";

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

export default function Origin() {
  const [micEnabled, setMicEnabled] = useState(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("idle");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [statusLine, setStatusLine] = useState("Status: Online // Port 8080 Active");
  const micEnabledRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speakHandleRef = useRef<{ cancel: () => void } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const sortedFleet = useMemo(
    () => [...fleetManifest].sort((a, b) => a.slot - b.slot),
    [],
  );

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
    window.speechSynthesis?.cancel();
    setVoiceMode("idle");
    setStatusLine((line) =>
      line.startsWith("Transmitting") ||
      line.startsWith("Voice transmit") ||
      line.startsWith("Origin acknowledging")
        ? micEnabledRef.current
          ? "Mic live — Origin listening"
          : "Status: Online // 8080 Active"
        : line,
    );
  }, []);

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

  const stopRecognition = useCallback(() => {
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
  }, []);

  const disableMic = useCallback(() => {
    micEnabledRef.current = false;
    setMicEnabled(false);
    stopRecognition();
    stopAudioLevelLoop();
    setStatusLine((line) =>
      line.startsWith("Heard:") || line.startsWith("Mic live") || line.startsWith("Listening")
        ? "Status: Online // 8080 Active"
        : line,
    );
  }, [stopAudioLevelLoop, stopRecognition]);

  const restartRecognition = useCallback(() => {
    if (!micEnabledRef.current) return;

    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) return;

    stopRecognition();

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      const text = last?.[0]?.transcript?.trim();
      if (text && last.isFinal) {
        setStatusLine(`Heard: “${text.slice(0, 72)}${text.length > 72 ? "…" : ""}”`);
      }
    };

    recognition.onerror = (event) => {
      if (!micEnabledRef.current) return;

      if (event.error === "no-speech" || event.error === "aborted") {
        window.setTimeout(() => restartRecognition(), 120);
        return;
      }

      if (event.error === "network") {
        window.setTimeout(() => restartRecognition(), 400);
        return;
      }

      setShowTroubleshoot(true);
      disableMic();
      setStatusLine("Mic channel error — troubleshoot open.");
    };

    recognition.onend = () => {
      if (!micEnabledRef.current) return;
      window.setTimeout(() => restartRecognition(), 80);
    };

    try {
      recognition.start();
    } catch {
      window.setTimeout(() => restartRecognition(), 200);
    }
  }, [disableMic, stopRecognition]);

  const speakMicGreet = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      setStatusLine("Mic live — Origin listening");
      return;
    }

    speakHandleRef.current?.cancel();
    setVoiceMode("speaking");
    setStatusLine("Origin acknowledging mic channel…");

    const handle = speakWithBrandVoice(ORIGIN_MIC_GREET, {
      rate: 0.95,
      pitch: 0.92,
      onEnd: () => {
        speakHandleRef.current = null;
        setVoiceMode("idle");
        if (micEnabledRef.current) {
          setStatusLine("Mic live — Origin listening");
        } else {
          setStatusLine("Status: Online // 8080 Active");
        }
      },
      onError: () => {
        speakHandleRef.current = null;
        setVoiceMode("idle");
        if (micEnabledRef.current) {
          setStatusLine("Mic live — Origin listening");
        } else {
          setStatusLine("Voice transmit interrupted.");
        }
      },
    });

    if (handle) {
      speakHandleRef.current = handle;
    } else {
      setVoiceMode("idle");
      setStatusLine("Mic live — Origin listening");
    }
  }, []);

  const enableMic = useCallback(async () => {
    stopSpeaking();

    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) {
      setShowTroubleshoot(true);
      setStatusLine("Speech recognition not supported — see troubleshoot.");
      return;
    }

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

      restartRecognition();
      speakMicGreet();
    } catch {
      micEnabledRef.current = false;
      setMicEnabled(false);
      setShowTroubleshoot(true);
      stopAudioLevelLoop();
      setStatusLine("Microphone permission denied.");
    }
  }, [restartRecognition, speakMicGreet, stopAudioLevelLoop, stopSpeaking]);

  const startSpeak = useCallback(() => {
    disableMic();
    stopSpeaking();

    if (!("speechSynthesis" in window)) {
      setStatusLine("Speech output unavailable in this browser.");
      return;
    }

    setVoiceMode("speaking");
    setStatusLine("Transmitting Origin briefing…");

    const handle = speakWithBrandVoice(ORIGIN_WELCOME, {
      rate: 0.95,
      pitch: 0.92,
      onEnd: () => {
        speakHandleRef.current = null;
        setVoiceMode("idle");
        setStatusLine("Status: Online // 8080 Active");
      },
      onError: () => {
        speakHandleRef.current = null;
        setVoiceMode("idle");
        setStatusLine("Voice transmit interrupted.");
      },
    });

    if (!handle) {
      setVoiceMode("idle");
      setStatusLine("Speech output unavailable in this browser.");
      return;
    }

    speakHandleRef.current = handle;
  }, [disableMic, stopSpeaking]);

  useEffect(
    () => () => {
      disableMic();
      stopSpeaking();
    },
    [disableMic, stopSpeaking],
  );

  const shellClass = [
    "origin-voice-shell",
    micEnabled ? "origin-voice-shell--listening" : "",
    voiceMode === "speaking" ? "origin-voice-shell--speaking" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const shieldAura = micEnabled ? "listening" : voiceMode === "speaking" ? "talking" : "idle";

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
            The only bay that commands the full fleet. Thirty partner AIs report through this node — you fly
            the hangar, not a single vendor silo.
          </p>
        </header>

        <div className="origin-page__core mb-12 flex w-full max-w-3xl flex-col items-center">
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
                micEnabled
                  ? "border-cyan-400/60 bg-cyan-500/10 hover:border-cyan-300/80 hover:bg-cyan-500/15"
                  : "border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10"
              }`}
              onClick={micEnabled ? disableMic : enableMic}
              aria-pressed={micEnabled}
              aria-label={micEnabled ? "Turn off Origin mic" : "Turn on Origin mic"}
            >
              <Mic
                className={`h-8 w-8 transition-colors ${
                  micEnabled ? "text-cyan-300" : "text-white/40 group-hover:text-cyan-400"
                }`}
              />
              <span
                className={`absolute -bottom-8 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-widest sm:block ${
                  micEnabled ? "text-cyan-300" : "text-white/20 group-hover:text-cyan-400"
                }`}
              >
                {micEnabled ? "Stop" : "Mic"}
              </span>
            </button>

            <button
              type="button"
              className="origin-shield-hit"
              onClick={() => {
                if (voiceMode === "speaking") {
                  stopSpeaking();
                } else {
                  startSpeak();
                }
              }}
              aria-pressed={voiceMode === "speaking"}
              aria-label={voiceMode === "speaking" ? "Stop Origin briefing" : "Origin shield — transmit briefing"}
            >
              <AuraFrame aura={shieldAura} variant="orb" className="h-56 w-56 sm:h-72 sm:w-72">
                <Shield className="relative z-20 h-14 w-14 text-white/90 sm:h-16 sm:w-16" strokeWidth={1} />
              </AuraFrame>
            </button>

            <button
              type="button"
              className="group absolute -right-6 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-cyan-400/50 hover:bg-white/10 sm:-right-28"
              onClick={voiceMode === "speaking" ? stopSpeaking : startSpeak}
              aria-pressed={voiceMode === "speaking"}
              aria-label={voiceMode === "speaking" ? "Stop Origin briefing" : "Speak Origin briefing"}
            >
              <Volume2
                className={`h-8 w-8 transition-colors ${
                  voiceMode === "speaking" ? "text-cyan-300" : "text-white/40 group-hover:text-cyan-400"
                }`}
              />
              <span className="absolute -bottom-8 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-widest text-white/20 group-hover:text-cyan-400 sm:block">
                {voiceMode === "speaking" ? "Stop" : "Speak"}
              </span>
            </button>
          </div>

          <p className="origin-page__status mt-8 font-mono text-[10px] uppercase tracking-widest text-cyan-300/70">
            {statusLine}
          </p>
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
                    {unit.name}
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
                  {unit.name}
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
            <p className="origin-troubleshoot-panel__mono">Origin / Bay 30 / COMMAND-01</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
