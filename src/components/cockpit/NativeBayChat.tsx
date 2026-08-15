import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMemberAuth } from "../../context/MemberAuthContext";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

type NativeBayChatProps = {
  provider: string;
  displayName: string;
  /** Real partner site — offered as a fallback link, never the primary path. */
  fallbackSrc?: string;
};

const MAX_MESSAGES = 40;

/**
 * Real, billed, in-app chat for a Fleet bay. USJET holds the model API key and
 * pays for usage; this only works for a verified, active USJET subscription —
 * every request is re-checked against Stripe server-side, never trusted from
 * the client alone.
 */
export default function NativeBayChat({ provider, displayName, fallbackSrc }: NativeBayChatProps) {
  const { session, loading: authLoading } = useMemberAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const canChat = Boolean(session?.active && session.customerId);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending || !canChat) {
      return;
    }

    const next = [...messages, { role: "user" as const, content: text }].slice(-MAX_MESSAGES);
    setMessages(next);
    setDraft("");
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/fleet-bay-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: session!.customerId, bay: provider, messages: next }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "That bay didn't answer. Try again.");
      }
      setMessages((current) => [...current, { role: "assistant" as const, content: data.reply! }].slice(-MAX_MESSAGES));
    } catch (err) {
      setError(err instanceof Error ? err.message : "That bay didn't answer. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="native-bay-chat native-bay-chat--gate">
        <p className="native-bay-chat__gate-copy">Checking clearance…</p>
      </div>
    );
  }

  if (!canChat) {
    return (
      <div className="native-bay-chat native-bay-chat--gate">
        <p className="native-bay-chat__gate-kicker">USJET · {displayName}</p>
        <h1 className="native-bay-chat__gate-title">Member login required</h1>
        <p className="native-bay-chat__gate-copy">
          This bay runs on USJET's own {displayName} connection — pay on Stripe, then log in with your Member ID to
          chat here instead of leaving the ship.
        </p>
        <div className="native-bay-chat__gate-actions">
          <a className="native-bay-chat__gate-cta" href="/member/login">
            Member Login
          </a>
          {fallbackSrc ? (
            <a className="native-bay-chat__gate-secondary" href={fallbackSrc} data-usjet-external-leak="true">
              Or open {displayName} directly
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="native-bay-chat">
      <div className="native-bay-chat__scroll" ref={scrollRef}>
        {messages.length === 0 ? (
          <p className="native-bay-chat__empty">Ask {displayName} anything — this runs on USJET's own connection.</p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`native-bay-chat__bubble native-bay-chat__bubble--${message.role}`}>
              {message.content}
            </div>
          ))
        )}
        {sending ? <div className="native-bay-chat__bubble native-bay-chat__bubble--assistant native-bay-chat__bubble--pending">…</div> : null}
      </div>

      {error ? <p className="native-bay-chat__error">{error}</p> : null}

      <form className="native-bay-chat__form" onSubmit={send}>
        <input
          className="native-bay-chat__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Message ${displayName}…`}
          disabled={sending}
          aria-label={`Message ${displayName}`}
        />
        <button type="submit" className="native-bay-chat__send" disabled={sending || !draft.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
