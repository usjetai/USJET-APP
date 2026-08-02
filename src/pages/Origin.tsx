import {
  FormEvent,
  KeyboardEvent,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LoaderCircle, Mic, MicOff, Send, Settings2 } from "lucide-react";
import type { OriginAvatarHandle } from "../components/origin/OriginAvatarStage";
import OriginMemberStrip from "../components/origin/OriginMemberStrip";
import {
  ORIGIN_CHAT_ERROR,
  ORIGIN_WELCOME_ASSISTANT,
  sendOriginTurn,
  type OriginChatTurn,
} from "../lib/originChatTurn";
import {
  buildOriginCsMemberScreenGreet,
  ORIGIN_CS_SCREEN_GREET,
} from "../lib/speakableBrand";
import { isOriginCustomerServiceEntry } from "../lib/memberAccessLevel";
import { useMemberAuth } from "../context/MemberAuthContext";
import {
  fetchOriginRealtimeStatus,
  OriginRealtimeClient,
  type OriginRealtimeStatus,
  type OriginRealtimeToolHandlers,
} from "../lib/originRealtimeClient";
import { OriginS2SSocketClient } from "../lib/originS2SSocket";
import {
  captionForStatus,
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  type OriginVoiceStatus,
} from "../lib/originVoiceSession";

const OriginAvatarStage = lazy(() => import("../components/origin/OriginAvatarStage"));

/**
 * Origin command android — text chat box is primary (history + composer + Enter).
 * Voice remains optional: S2S / Realtime when armed, else Web Speech → /api/origin-chat → TTS.
 */
export default function Origin() {
  const [searchParams] = useSearchParams();
  const { session } = useMemberAuth();
  const isCustomerServiceEntry = isOriginCustomerServiceEntry(`?${searchParams.toString()}`);

  const csScreenGreet = useMemo(() => {
    if (isCustomerServiceEntry && session?.active) {
      return buildOriginCsMemberScreenGreet(session);
    }
    return isCustomerServiceEntry ? ORIGIN_CS_SCREEN_GREET : null;
  }, [isCustomerServiceEntry, session]);

  const avatarRef = useRef<OriginAvatarHandle | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const realtimeRef = useRef<OriginRealtimeClient | OriginS2SSocketClient | null>(null);
  const realtimeProbeRef = useRef<OriginRealtimeStatus | null>(null);
  const sessionActiveRef = useRef(false);
  const mutedRef = useRef(false);
  const busyRef = useRef(false);
  const turnsRef = useRef<OriginChatTurn[]>([ORIGIN_WELCOME_ASSISTANT]);

  const speechSupported = useMemo(() => isSpeechRecognitionSupported(), []);
  const [avatarReady, setAvatarReady] = useState(false);
  const [status, setStatus] = useState<OriginVoiceStatus>("loading");
  const [sessionLive, setSessionLive] = useState(false);
  const [realtimeArmed, setRealtimeArmed] = useState(false);
  const [s2sTransport, setS2sTransport] = useState<"webrtc" | "websocket" | "none">("none");
  const [muted, setMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [subtitles, setSubtitles] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  /** Text channel is the primary UX — always open like a normal chat box. */
  const [composerOpen, setComposerOpen] = useState(true);
  const [turns, setTurns] = useState<OriginChatTurn[]>([ORIGIN_WELCOME_ASSISTANT]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const chatLogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchOriginRealtimeStatus().then((probe) => {
      if (cancelled) return;
      realtimeProbeRef.current = probe;
      const armed =
        probe.available && (probe.transport === "webrtc" || probe.transport === "websocket");
      setRealtimeArmed(armed);
      setS2sTransport(probe.transport);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onAvatarReady = useCallback((value: boolean) => {
    setAvatarReady(value);
  }, []);

  const onAvatarLoadError = useCallback((message: string) => {
    // Soft notice — do not force composer; character presence still works.
    setError(message);
  }, []);

  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const node = chatLogRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [turns, status]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Origin · Face to face · USJet.ai";
    return () => {
      document.title = prevTitle;
      sessionActiveRef.current = false;
      recognitionRef.current?.stop();
      void realtimeRef.current?.disconnect(true);
      realtimeRef.current = null;
      window.speechSynthesis?.cancel();
      avatarRef.current?.stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (avatarReady && status === "loading") {
      setStatus("idle");
    }
  }, [avatarReady, status]);

  const caption = captionForStatus(status, speechSupported);

  const runTurn = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busyRef.current) return;

      busyRef.current = true;
      setError(null);
      setStatus("processing");
      setSubtitles("");
      avatarRef.current?.stopSpeaking();

      // Show the user line immediately — normal chat-box feel while Origin thinks.
      const priorTurns = turnsRef.current;
      const optimisticTurns: OriginChatTurn[] = [...priorTurns, { role: "user", content: text }];
      setTurns(optimisticTurns);
      turnsRef.current = optimisticTurns;

      const result = await sendOriginTurn({
        text,
        turns: priorTurns,
        session: session?.active ? session : null,
        isCustomerServiceEntry,
      });

      setTurns(result.turns);
      turnsRef.current = result.turns;

      if (result.error) {
        setError(result.error);
      }

      // Text chat is primary — only speak aloud when a voice session is live.
      if (sessionActiveRef.current) {
        setStatus("speaking");
        setSubtitles(showSubtitles ? result.reply : "");
        try {
          await avatarRef.current?.speakText(result.reply, (chunk) => {
            if (showSubtitles) setSubtitles(chunk);
          });
        } catch {
          setError(ORIGIN_CHAT_ERROR);
        }
      } else {
        setSubtitles("");
      }

      busyRef.current = false;
      if (sessionActiveRef.current && !mutedRef.current && speechSupported) {
        setStatus("listening");
        avatarRef.current?.setListening(true);
        try {
          recognitionRef.current?.start();
        } catch {
          /* already started */
        }
      } else {
        setStatus("idle");
      }
    },
    [isCustomerServiceEntry, session, showSubtitles, speechSupported],
  );

  const stopSession = useCallback(() => {
    sessionActiveRef.current = false;
    setSessionLive(false);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    void realtimeRef.current?.disconnect(false);
    avatarRef.current?.stopSpeaking();
    window.speechSynthesis?.cancel();
    busyRef.current = false;
    setStatus(avatarReady ? "idle" : "loading");
    setSubtitles("");
  }, [avatarReady]);

  const buildRealtimeHandlers = useCallback((): OriginRealtimeToolHandlers => {
    return {
      setMood: (mood) => avatarRef.current?.setMood(mood),
      makeHandGesture: (gesture) => avatarRef.current?.playGesture(gesture),
      makeFacialExpression: (emoji) => avatarRef.current?.speakEmoji(emoji),
      onSpeechStarted: () => {
        setStatus("listening");
        avatarRef.current?.setListening(true);
        avatarRef.current?.setRemoteSpeaking(false);
      },
      onSpeakingChange: (speaking) => {
        setStatus(speaking ? "speaking" : sessionActiveRef.current ? "listening" : "idle");
        avatarRef.current?.setRemoteSpeaking(speaking);
        if (!speaking) avatarRef.current?.setListening(Boolean(sessionActiveRef.current));
      },
      onRemoteAudioStream: (stream) => {
        avatarRef.current?.attachRemoteAudio(stream);
      },
      onError: (message) => {
        setError(message);
        setStatus("error");
      },
    };
  }, []);

  const startRealtimeSession = useCallback(async () => {
    avatarRef.current?.start();
    setError(null);
    setStatus("processing");
    setSubtitles(showSubtitles ? "Connecting Origin Realtime…" : "");

    const handlers = buildRealtimeHandlers();
    const probe = realtimeProbeRef.current;
    const instructionsExtra = isCustomerServiceEntry
      ? "Customer Service entry: prioritize ops@usjet.ai, Stripe Member ID login, and Hangar help."
      : undefined;

    try {
      if (probe?.transport === "websocket" && probe.wsUrl) {
        const socketClient = new OriginS2SSocketClient(handlers);
        realtimeRef.current = socketClient;
        await socketClient.connect({ wsUrl: probe.wsUrl, instructionsExtra });
      } else {
        const webrtcClient = new OriginRealtimeClient(handlers);
        realtimeRef.current = webrtcClient;
        await webrtcClient.connect({ instructionsExtra });
      }
      sessionActiveRef.current = true;
      setSessionLive(true);
      setStatus("listening");
      avatarRef.current?.setListening(true);
      setSubtitles(
        showSubtitles
          ? probe?.transport === "websocket"
            ? "Origin S2S live — mic streams PCM16; speak naturally."
            : "Origin Realtime live — speak naturally."
          : "",
      );
    } catch (err) {
      realtimeRef.current = null;
      const message = err instanceof Error ? err.message : "Realtime connect failed";
      setError(message);
      setStatus("error");
      setSessionLive(false);
      throw err;
    }
  }, [buildRealtimeHandlers, isCustomerServiceEntry, showSubtitles]);

  const startLegacySpeechSession = useCallback(() => {
    if (!speechSupported) {
      setComposerOpen(true);
      setStatus("idle");
      setSessionLive(false);
      return;
    }

    const recognition = createSpeechRecognition();
    if (!recognition) {
      setComposerOpen(true);
      setStatus("idle");
      return;
    }

    recognition.onresult = (event) => {
      if (mutedRef.current || busyRef.current) return;
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result) continue;
        const piece = result[0]?.transcript ?? "";
        if (result.isFinal) finalText += piece;
        else interim += piece;
      }
      if (interim && showSubtitles) {
        setSubtitles(interim);
      }
      if (finalText.trim()) {
        recognition.stop();
        void runTurn(finalText);
      }
    };

    recognition.onerror = () => {
      if (!sessionActiveRef.current) return;
      setStatus("error");
      setError("Mic hiccup — try Start talking again, or type below.");
    };

    recognition.onend = () => {
      if (!sessionActiveRef.current || busyRef.current || mutedRef.current) return;
      try {
        recognition.start();
      } catch {
        /* ignore */
      }
    };

    recognitionRef.current = recognition;
    sessionActiveRef.current = true;
    setSessionLive(true);
    setStatus("listening");
    avatarRef.current?.setListening(true);
    try {
      recognition.start();
    } catch {
      setError("Could not start the microphone.");
      stopSession();
    }
  }, [runTurn, showSubtitles, speechSupported, stopSession]);

  const startSession = useCallback(() => {
    avatarRef.current?.start();
    setError(null);

    if (realtimeArmed) {
      void startRealtimeSession().catch(() => {
        setError((prev) => `${prev ?? "Realtime unavailable."} Falling back to browser speech.`);
        startLegacySpeechSession();
      });
      return;
    }

    startLegacySpeechSession();
  }, [realtimeArmed, startLegacySpeechSession, startRealtimeSession]);

  const toggleMain = () => {
    if (sessionLive) stopSession();
    else startSession();
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    realtimeRef.current?.setMicEnabled(!next);
    if (next) {
      recognitionRef.current?.stop();
      if (sessionActiveRef.current && !busyRef.current) setStatus("idle");
    } else if (sessionActiveRef.current && !busyRef.current) {
      setStatus("listening");
      avatarRef.current?.setListening(true);
      if (!realtimeRef.current && speechSupported) {
        try {
          recognitionRef.current?.start();
        } catch {
          /* ignore */
        }
      }
    }
  };

  const onComposerSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || status === "processing") return;
    setDraft("");
    void runTurn(text);
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    if (!draft.trim() || status === "processing") return;
    const text = draft.trim();
    setDraft("");
    void runTurn(text);
  };

  const mainLabel = !avatarReady
    ? "Loading…"
    : sessionLive
      ? "End conversation"
      : realtimeArmed || speechSupported
        ? "Start talking"
        : "Type to Origin";

  return (
    <div className="origin-avatar-app page-nav-offset">
      <Suspense
        fallback={
          <div className="origin-avatar-stage origin-avatar-stage--loading-shell">
            <p className="origin-avatar-stage__loading">Loading avatar…</p>
          </div>
        }
      >
        <OriginAvatarStage
          ref={avatarRef}
          onReadyChange={onAvatarReady}
          onLoadError={onAvatarLoadError}
        />
      </Suspense>

      <header className="origin-avatar-app__topbar">
        <div className="origin-avatar-app__identity">
          <h1>Origin</h1>
          <p>
            Talk to <strong>USJET.AI</strong> face to face — white-and-gold command android.{" "}
            {realtimeArmed
              ? s2sTransport === "websocket"
                ? "S2S WebSocket · "
                : "Realtime S2S · "
              : "Browser speech · "}
            HeadAudio lip-sync
            {isCustomerServiceEntry ? " · Customer Service channel" : ""}
          </p>
          {csScreenGreet ? <p className="origin-avatar-app__cs">{csScreenGreet}</p> : null}
        </div>
        <div className="origin-avatar-app__top-actions">
          <Link to="/" className="origin-avatar-app__ghost glass-effect-interactive">
            Hangar
          </Link>
          <button
            type="button"
            className="origin-avatar-app__icon-btn"
            aria-label="Settings"
            title="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings2 size={16} aria-hidden />
          </button>
        </div>
      </header>

      <footer className="origin-avatar-app__controls">
        {composerOpen ? (
          <div
            ref={chatLogRef}
            className="origin-avatar-app__chat-log liquid-glass-background glass-effect glass-effect--rounded-rect"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="Origin conversation"
          >
            {turns.map((turn, index) => (
              <article
                key={`origin-turn-${index}-${turn.role}`}
                className={[
                  "origin-avatar-app__chat-line",
                  turn.role === "user"
                    ? "origin-avatar-app__chat-line--user"
                    : "origin-avatar-app__chat-line--assistant",
                ].join(" ")}
              >
                <span className="origin-avatar-app__chat-speaker">
                  {turn.role === "user" ? "You" : "Origin"}
                </span>
                <p className="origin-avatar-app__chat-text">{turn.content}</p>
              </article>
            ))}
            {status === "processing" ? (
              <div className="origin-avatar-app__chat-line origin-avatar-app__chat-line--assistant origin-avatar-app__chat-line--pending">
                <span className="origin-avatar-app__chat-speaker">Origin</span>
                <p className="origin-avatar-app__chat-text">
                  <LoaderCircle size={14} aria-hidden className="origin-avatar-app__chat-spinner" />
                  Thinking…
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {composerOpen ? (
          <form className="origin-avatar-app__composer" onSubmit={onComposerSubmit}>
            <label className="sr-only" htmlFor="origin-avatar-input">
              Message Origin
            </label>
            <textarea
              id="origin-avatar-input"
              className="origin-avatar-app__input"
              rows={2}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onComposerKeyDown}
              placeholder="Message Origin… (Enter to send)"
              disabled={status === "processing"}
              autoComplete="off"
            />
            <button
              type="submit"
              className="origin-avatar-app__send btn-glass-prominent glass-effect-interactive"
              disabled={!draft.trim() || status === "processing"}
              aria-label="Send message"
            >
              <Send size={16} aria-hidden />
              Send
            </button>
          </form>
        ) : null}

        <div
          className={[
            "origin-avatar-app__subtitles",
            showSubtitles && subtitles ? "origin-avatar-app__subtitles--visible" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-live="polite"
        >
          {subtitles}
        </div>

        <div
          className={[
            "origin-avatar-app__caption",
            status === "listening" || status === "speaking" ? "origin-avatar-app__caption--live" : "",
            status === "error" ? "origin-avatar-app__caption--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="status"
        >
          {caption}
        </div>

        <div className="origin-avatar-app__buttons">
          <button
            type="button"
            className={[
              "origin-avatar-app__main-btn",
              sessionLive ? "origin-avatar-app__main-btn--live" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={!avatarReady && speechSupported}
            onClick={toggleMain}
          >
            {mainLabel}
          </button>
          {sessionLive ? (
            <button
              type="button"
              className={[
                "origin-avatar-app__icon-btn",
                muted ? "origin-avatar-app__icon-btn--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              title={muted ? "Unmute microphone" : "Mute microphone"}
              onClick={toggleMute}
            >
              {muted ? <MicOff size={16} aria-hidden /> : <Mic size={16} aria-hidden />}
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="origin-avatar-app__error" role="status">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          className="origin-avatar-app__composer-toggle glass-effect-interactive"
          onClick={() => setComposerOpen((v) => !v)}
        >
          {composerOpen ? "Hide chat" : "Show chat"}
        </button>

        {session?.active ? (
          <div className="origin-avatar-app__member-bar">
            <OriginMemberStrip session={session} />
          </div>
        ) : null}
      </footer>

      {settingsOpen ? (
        <div
          className="origin-avatar-app__dialog-backdrop"
          role="presentation"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="origin-avatar-app__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="origin-avatar-settings-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="origin-avatar-settings-title">Settings</h2>
            <label className="origin-avatar-app__check-row">
              <input
                type="checkbox"
                checked={showSubtitles}
                onChange={(event) => setShowSubtitles(event.target.checked)}
              />
              Show subtitles while she speaks
            </label>
            <p className="origin-avatar-app__dialog-note">
              {realtimeArmed
                ? s2sTransport === "websocket"
                  ? "S2S WebSocket armed — PCM16 input_audio_buffer.append + output_audio.delta, HeadAudio lip-sync, tools: set_mood / make_hand_gesture / make_facial_expression."
                  : "Realtime S2S armed — OpenAI WebRTC + HeadAudio lip-sync on Origin. Tools: set_mood, make_hand_gesture, make_facial_expression."
                : "S2S offline — set OPENAI_API_KEY (WebRTC) or ORIGIN_S2S_WS_URL (WebSocket). Until then: browser mic → Origin chat → TTS. Official look uses Origin’s white/gold pilot video."}
            </p>
            <div className="origin-avatar-app__dialog-actions">
              <button type="button" className="origin-avatar-app__dialog-done" onClick={() => setSettingsOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
