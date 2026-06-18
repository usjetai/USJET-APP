import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { LoaderCircle, MessageSquare, Send, X } from "lucide-react";
import type { FleetUnit } from "../../types/fleet";
import {
  buildHiredHudDeveloperChatWelcome,
  formatHiredHudDeveloperChatBay,
  HIRED_HUD_DEVELOPER_CHAT_MAX_TURNS,
  HIRED_HUD_DEVELOPER_CHAT_OFFLINE,
  HIRED_HUD_DEVELOPER_CHAT_TITLE,
} from "../../data/hiredHudDeveloperChat";
import {
  completeHiredHudDeveloperChat,
  type HiredHudDeveloperChatTurn,
} from "../../lib/hiredHudDeveloperChat";
import HiredHudDeveloperAvatar from "./HiredHudDeveloperAvatar";

type HiredHudTileDeveloperChatProps = {
  unit: FleetUnit;
};

type ChatMessage = HiredHudDeveloperChatTurn & {
  id: string;
};

function nextChatId(slot: number): string {
  return `hired-hud-chat-${slot}-${Date.now()}-${Math.floor(Math.random() * 99999)}`;
}

export default function HiredHudTileDeveloperChat({ unit }: HiredHudTileDeveloperChatProps) {
  const panelId = useId();
  const inputId = useId();
  const logRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [welcomed, setWelcomed] = useState(false);

  const openChat = useCallback(() => {
    setOpen(true);
    setError(null);
    if (!welcomed) {
      setWelcomed(true);
      setMessages([
        {
          id: nextChatId(unit.slot),
          role: "assistant",
          content: buildHiredHudDeveloperChatWelcome(unit),
        },
      ]);
    }
  }, [unit, welcomed]);

  const closeChat = useCallback(() => {
    setOpen(false);
    setError(null);
  }, []);

  useEffect(() => {
    const node = logRef.current;
    if (!node || !open) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, open, pending]);

  const sendMessage = useCallback(
    async (raw: string) => {
      const question = raw.trim();
      if (!question || pending) return;

      setError(null);
      setDraft("");

      const userMessage: ChatMessage = {
        id: nextChatId(unit.slot),
        role: "user",
        content: question,
      };

      const turnsForApi = [...messages, userMessage]
        .filter((message) => message.role === "user" || message.role === "assistant")
        .slice(-HIRED_HUD_DEVELOPER_CHAT_MAX_TURNS)
        .map((message) => ({ role: message.role, content: message.content }));

      setMessages((current) => [...current, userMessage]);
      setPending(true);

      try {
        const reply = await completeHiredHudDeveloperChat(unit, turnsForApi);
        setMessages((current) =>
          [
            ...current,
            { id: nextChatId(unit.slot), role: "assistant" as const, content: reply },
          ].slice(-HIRED_HUD_DEVELOPER_CHAT_MAX_TURNS),
        );
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : HIRED_HUD_DEVELOPER_CHAT_OFFLINE;
        setError(message);
      } finally {
        setPending(false);
      }
    },
    [messages, pending, unit],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(draft);
  };

  return (
    <div className="hired-hud__tile-chat">
      {!open ? (
        <button
          type="button"
          className="hired-hud__tile-chat-launch btn-glass glass-effect-interactive"
          aria-expanded={false}
          aria-controls={panelId}
          onClick={openChat}
        >
          <MessageSquare size={14} aria-hidden />
          <span>AI bay chat · Ask {unit.name}</span>
          <span className="hired-hud__tile-chat-launch-tag">{formatHiredHudDeveloperChatBay(unit.slot)}</span>
        </button>
      ) : (
        <section
          id={panelId}
          className="hired-hud__tile-chat-panel liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan"
          aria-label={`${HIRED_HUD_DEVELOPER_CHAT_TITLE} with ${unit.name}`}
        >
          <header className="hired-hud__tile-chat-head">
            <div className="hired-hud__tile-chat-head-copy">
              <span className="hired-hud__tile-chat-kicker">{HIRED_HUD_DEVELOPER_CHAT_TITLE}</span>
              <span className="hired-hud__tile-chat-title">{unit.name}</span>
              <span className="hired-hud__tile-chat-meta">
                {unit.callsign} · {formatHiredHudDeveloperChatBay(unit.slot)}
              </span>
            </div>
            <HiredHudDeveloperAvatar slot={unit.slot} name={unit.name} variant="crew" />
            <button
              type="button"
              className="hired-hud__tile-chat-close glass-effect-interactive"
              aria-label={`Close chat with ${unit.name}`}
              onClick={closeChat}
            >
              <X size={14} aria-hidden />
            </button>
          </header>

          <div ref={logRef} className="hired-hud__tile-chat-log" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => (
              <article
                key={message.id}
                className={[
                  "hired-hud__tile-chat-line",
                  message.role === "user" ? "hired-hud__tile-chat-line--user" : "hired-hud__tile-chat-line--developer",
                ].join(" ")}
              >
                <span className="hired-hud__tile-chat-speaker">
                  {message.role === "user" ? "You" : unit.name}
                </span>
                <p className="hired-hud__tile-chat-text">{message.content}</p>
              </article>
            ))}
            {pending ? (
              <div className="hired-hud__tile-chat-line hired-hud__tile-chat-line--developer hired-hud__tile-chat-line--pending">
                <span className="hired-hud__tile-chat-speaker">{unit.name}</span>
                <p className="hired-hud__tile-chat-text">
                  <LoaderCircle size={14} aria-hidden className="hired-hud__tile-chat-spinner" />
                  On the wire…
                </p>
              </div>
            ) : null}
          </div>

          {error ? <p className="hired-hud__tile-chat-error">{error}</p> : null}

          <form className="hired-hud__tile-chat-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor={inputId}>
              Ask {unit.name}
            </label>
            <input
              id={inputId}
              className="hired-hud__tile-chat-input"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Ask ${unit.name}…`}
              maxLength={500}
              disabled={pending}
              autoComplete="off"
            />
            <button
              type="submit"
              className="hired-hud__tile-chat-send btn-glass glass-effect-interactive"
              disabled={pending || !draft.trim()}
              aria-label={`Send message to ${unit.name}`}
            >
              <Send size={14} aria-hidden />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
