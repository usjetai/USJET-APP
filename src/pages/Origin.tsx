import { FormEvent, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mic, MicOff, Send, Settings2 } from "lucide-react";
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
  captionForStatus,
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  type OriginVoiceStatus,
} from "../lib/originVoiceSession";

const OriginAvatarStage = lazy(() => import("../components/origin/OriginAvatarStage"));

/**
 * Origin command node — full-bleed Founder android stage
 * with browser mic STT → Origin chat → TTS presence.
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
  const sessionActiveRef = useRef(false);
  const mutedRef = useRef(false);
  const busyRef = useRef(false);
  const turnsRef = useRef<OriginChatTurn[]>([ORIGIN_WELCOME_ASSISTANT]);

  const speechSupported = useMemo(() => isSpeechRecognitionSupported(), []);
  const [avatarReady, setAvatarReady] = useState(false);
  const [status, setStatus] = useState<OriginVoiceStatus>("loading");
  const [sessionLive, setSessionLive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [subtitles, setSubtitles] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(!isSpeechRecognitionSupported());
  const [turns, setTurns] = useState<OriginChatTurn[]>([ORIGIN_WELCOME_ASSISTANT]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onAvatarReady = useCallback((value: boolean) => {
    setAvatarReady(value);
  }, []);

  const onAvatarLoadError = useCallback((message: string) => {
    setError(message);
    setComposerOpen(true);
  }, []);

  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Origin · Face to face · USJet.ai";
    return () => {
      document.title = prevTitle;
      sessionActiveRef.current = false;
      recognitionRef.current?.stop();
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

      const result = await sendOriginTurn({
        text,
        turns: turnsRef.current,
        session: session?.active ? session : null,
        isCustomerServiceEntry,
      });

      setTurns(result.turns);
      turnsRef.current = result.turns;

      if (result.error) {
        setError(result.error);
      }

      setStatus("speaking");
      setSubtitles(showSubtitles ? result.reply : "");
      try {
        await avatarRef.current?.speakText(result.reply, (chunk) => {
          if (showSubtitles) setSubtitles(chunk);
        });
      } catch {
        setError(ORIGIN_CHAT_ERROR);
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
    avatarRef.current?.stopSpeaking();
    window.speechSynthesis?.cancel();
    busyRef.current = false;
    setStatus(avatarReady ? "idle" : "loading");
    setSubtitles("");
  }, [avatarReady]);

  const startSession = useCallback(() => {
    avatarRef.current?.start();
    setError(null);

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

  const toggleMain = () => {
    if (sessionLive) stopSession();
    else startSession();
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (next) {
      recognitionRef.current?.stop();
      if (sessionActiveRef.current && !busyRef.current) setStatus("idle");
    } else if (sessionActiveRef.current && !busyRef.current && speechSupported) {
      setStatus("listening");
      avatarRef.current?.setListening(true);
      try {
        recognitionRef.current?.start();
      } catch {
        /* ignore */
      }
    }
  };

  const onComposerSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    void runTurn(text);
  };

  const mainLabel = !avatarReady
    ? "Loading…"
    : sessionLive
      ? "End conversation"
      : speechSupported
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
            Talk to <strong>USJET.AI</strong> face to face. Browser mic · live command ·
            Origin&nbsp;android
            {isCustomerServiceEntry ? " · Customer Service channel" : ""}
          </p>
          {csScreenGreet ? <p className="origin-avatar-app__cs">{csScreenGreet}</p> : null}
          {session?.active ? (
            <div className="origin-avatar-app__member">
              <OriginMemberStrip session={session} />
            </div>
          ) : null}
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
          {sessionLive && speechSupported ? (
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
          {composerOpen ? "Hide text channel" : "Type instead"}
        </button>

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
              placeholder="Ask about Hangar, Fleet, tiers, or a partner bay…"
              disabled={busyRef.current && status === "processing"}
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
              Day-one voice uses your browser mic and speech engine — not a hosted speech-to-speech
              backend. Swap the GLB via <code>VITE_ORIGIN_AVATAR_URL</code> when Origin&apos;s final
              mesh is ready.
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
