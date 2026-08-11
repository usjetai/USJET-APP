import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { LoaderCircle, Send } from "lucide-react";
import {
  ORIGIN_CHAT_ERROR,
  ORIGIN_WELCOME_ASSISTANT,
  sendOriginTurn,
  type OriginChatTurn,
} from "../../lib/originChatTurn";
import { isOriginCustomerServiceEntry } from "../../lib/memberAccessLevel";
import { useMemberAuth } from "../../context/MemberAuthContext";

/**
 * Origin Jarvis tile — self-contained mini-chat + prompt for the clean Origin shell.
 * Reuses the live Origin turn path (onboard knowledge + optional CS entry).
 */
export default function OriginJarvisTile() {
  const inputId = useId();
  const logRef = useRef<HTMLDivElement | null>(null);
  const turnsRef = useRef<OriginChatTurn[]>([ORIGIN_WELCOME_ASSISTANT]);
  const busyRef = useRef(false);

  const [searchParams] = useSearchParams();
  const { session } = useMemberAuth();
  const isCustomerServiceEntry = isOriginCustomerServiceEntry(`?${searchParams.toString()}`);

  const [turns, setTurns] = useState<OriginChatTurn[]>([ORIGIN_WELCOME_ASSISTANT]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [turns, pending]);

  const sendMessage = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busyRef.current) return;

      busyRef.current = true;
      setPending(true);
      setError(null);
      setDraft("");

      const priorTurns = turnsRef.current;
      const optimisticTurns: OriginChatTurn[] = [...priorTurns, { role: "user", content: text }];
      setTurns(optimisticTurns);
      turnsRef.current = optimisticTurns;

      try {
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
      } catch {
        setError(ORIGIN_CHAT_ERROR);
        setTurns(priorTurns);
        turnsRef.current = priorTurns;
      } finally {
        busyRef.current = false;
        setPending(false);
      }
    },
    [isCustomerServiceEntry, session],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(draft);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(draft);
    }
  };

  return (
    <section
      className="origin-jarvis-tile liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan"
      aria-label="Origin command chat"
    >
      <header className="origin-jarvis-tile__head">
        <p className="origin-jarvis-tile__kicker">USJET Origin</p>
        <h1 className="origin-jarvis-tile__title">Command channel</h1>
        <p className="origin-jarvis-tile__lede">Ask about Hangar, Fleet, Intel, tiers, or Stripe login.</p>
      </header>

      <div
        ref={logRef}
        className="origin-jarvis-tile__log"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {turns.map((turn, index) => (
          <article
            key={`origin-jarvis-${index}-${turn.role}`}
            className={[
              "origin-jarvis-tile__line",
              turn.role === "user"
                ? "origin-jarvis-tile__line--user"
                : "origin-jarvis-tile__line--assistant",
            ].join(" ")}
          >
            <span className="origin-jarvis-tile__speaker">
              {turn.role === "user" ? "You" : "Origin"}
            </span>
            <p className="origin-jarvis-tile__text">{turn.content}</p>
          </article>
        ))}
        {pending ? (
          <div className="origin-jarvis-tile__line origin-jarvis-tile__line--assistant origin-jarvis-tile__line--pending">
            <span className="origin-jarvis-tile__speaker">Origin</span>
            <p className="origin-jarvis-tile__text">
              <LoaderCircle size={14} aria-hidden className="origin-jarvis-tile__spinner" />
              On the wire…
            </p>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="origin-jarvis-tile__error" role="status">
          {error}
        </p>
      ) : null}

      <form className="origin-jarvis-tile__composer" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor={inputId}>
          Message Origin
        </label>
        <textarea
          id={inputId}
          className="origin-jarvis-tile__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask Origin…"
          rows={2}
          maxLength={2000}
          disabled={pending}
          autoComplete="off"
        />
        <button
          type="submit"
          className="origin-jarvis-tile__send btn-glass-prominent glass-effect-interactive"
          disabled={pending || !draft.trim()}
          aria-label="Send message"
        >
          <Send size={16} aria-hidden />
          Send
        </button>
      </form>
    </section>
  );
}
