import { Link, useSearchParams } from "react-router-dom";
import { Send } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import OriginMemberStrip from "../components/origin/OriginMemberStrip";
import EkgPulseLine from "../components/intel/EkgPulseLine";
import DeveloperRedBlinkName from "../components/DeveloperRedBlinkName";
import { fleetManifest } from "../data/fleetManifest";
import { integratedLaunchUrl } from "../lib/fleetLaunchUrl";
import { buildOpenRouterMessages, completeOriginChat } from "../lib/openrouter";
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
  ORIGIN_CS_SCREEN_GREET,
} from "../lib/speakableBrand";
import { isOriginCustomerServiceEntry } from "../lib/memberAccessLevel";
import { useMemberAuth } from "../context/MemberAuthContext";

type ChatTurn = { role: "user" | "assistant"; content: string };

const COMMAND_ROUTES = [
  { to: "/", label: "Hangar" },
  { to: "/fleet", label: "Fleet" },
  { to: "/intel", label: "Intel Pulse" },
  { to: "/founder", label: "Founder" },
  { to: "/special", label: "Founder Special" },
] as const;

const WELCOME_ASSISTANT: ChatTurn = {
  role: "assistant",
  content:
    "I'm Origin — text chat for AI questions. Ask about the fleet, which tool to use, Hangar, Intel, tiers, or how AI works. Type below and send.",
};

const ORIGIN_CHAT_ERROR =
  "Origin is online, but the AI link is quiet right now. Try again in a moment.";

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

  const memberContext = useMemo(
    () => buildOriginMemberContext(session?.active ? session : null),
    [session],
  );

  const sortedFleet = useMemo(
    () => [...fleetManifest].sort((a, b) => a.slot - b.slot),
    [],
  );

  const [turns, setTurns] = useState<ChatTurn[]>([WELCOME_ASSISTANT]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Origin · USJet.ai";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [turns, busy]);

  const sendMessage = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;

    setError(null);
    setDraft("");
    setBusy(true);

    const nextTurns: ChatTurn[] = [...turns, { role: "user", content: text }];
    setTurns(nextTurns);

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
      const reply = await completeOriginChat(
        buildOpenRouterMessages(nextTurns, {
          entry: isCustomerServiceEntry ? "customer-service" : undefined,
          memberContext: augmentedMemberContext,
        }),
      );
      const assistantText = csPreface ? `${csPreface}\n\n${reply}` : reply;
      setTurns([...nextTurns, { role: "assistant", content: assistantText }]);
    } catch {
      setError(ORIGIN_CHAT_ERROR);
      setTurns([
        ...nextTurns,
        {
          role: "assistant",
          content: ORIGIN_CHAT_ERROR,
        },
      ]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const onSubmit = (event: FormEvent) => {
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
    <div className="origin-page origin-page--chat page-atmosphere page-nav-offset relative min-h-screen overflow-hidden pb-24">
      <div className="origin-page__ekg" aria-hidden>
        <EkgPulseLine variant="hero" seed={29} />
      </div>

      <div className="origin-page__shell mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6">
        <header className="origin-page__header mb-8 text-center">
          <UsjetWordmark size="hero" className="origin-page__wordmark" />
          <p className="origin-page__kicker">Command node · Bay 30</p>
          <h1 className="origin-page__title">Origin Intelligence Core</h1>
          <p className="origin-page__lede">
            {isCustomerServiceEntry
              ? "Customer Service text channel — ask Origin about your account, fleet, or clearance."
              : "Text chat for AI questions. Ask how tools work, which bay to open, or how the Hangar and fleet fit together."}
          </p>
        </header>

        {session?.active ? <OriginMemberStrip session={session} /> : null}

        {csScreenGreet ? (
          <p className="origin-page__cs-greet mb-4 max-w-lg text-center text-sm leading-relaxed text-cyan-200/90">
            {csScreenGreet}
          </p>
        ) : null}

        <GlassEffectContainer className="origin-chat glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan mb-10 w-full max-w-3xl flex-col items-stretch gap-0 p-0">
          <div className="origin-chat__head">
            <p className="origin-chat__kicker">Origin · text channel</p>
            <p className="origin-chat__title">Ask about AI</p>
          </div>

          <div className="origin-chat__log" ref={listRef} role="log" aria-live="polite" aria-relevant="additions">
            {turns.map((turn, index) => (
              <div
                key={`${turn.role}-${index}`}
                className={[
                  "origin-chat__bubble",
                  turn.role === "user" ? "origin-chat__bubble--user" : "origin-chat__bubble--assistant",
                ].join(" ")}
              >
                <p className="origin-chat__role">{turn.role === "user" ? "You" : "Origin"}</p>
                <p className="origin-chat__text">{turn.content}</p>
              </div>
            ))}
            {busy ? (
              <div className="origin-chat__bubble origin-chat__bubble--assistant origin-chat__bubble--pending">
                <p className="origin-chat__role">Origin</p>
                <p className="origin-chat__text">Thinking…</p>
              </div>
            ) : null}
          </div>

          <form className="origin-chat__composer" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="origin-chat-input">
              Message Origin
            </label>
            <textarea
              id="origin-chat-input"
              ref={inputRef}
              className="origin-chat__input"
              rows={2}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about AI, the fleet, Hangar, or how a tool works…"
              disabled={busy}
              autoComplete="off"
            />
            <button
              type="submit"
              className="origin-chat__send btn-glass-prominent glass-effect-interactive"
              disabled={busy || !draft.trim()}
              aria-label="Send message"
            >
              <Send size={16} aria-hidden />
              Send
            </button>
          </form>

          {error ? (
            <p className="origin-chat__error" role="status">
              {error}
            </p>
          ) : null}
        </GlassEffectContainer>

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
            <p className="origin-page__fleet-copy">
              Launch any partner from Origin — integrated navigation across the fleet.
            </p>
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
                <a key={unit.id} href={url} className="origin-page__fleet-chip">
                  <span className="origin-page__fleet-slot">{String(unit.slot + 1).padStart(2, "0")}</span>
                  <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
                </a>
              );
            })}
          </div>
        </section>
      </div>

      <div className="origin-page__hud origin-page__hud--left font-mono text-[10px] uppercase tracking-tighter text-white/25">
        <p>Lat: 40.7128° N</p>
        <p>Long: 74.0060° W</p>
      </div>
      <div className="origin-page__hud origin-page__hud--right text-right font-mono text-[10px] uppercase tracking-tighter text-white/25">
        <p>Protocol: USJET-v5</p>
        <p>Channel: Text chat</p>
      </div>
    </div>
  );
}
