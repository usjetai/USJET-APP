import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  WAITING_LIST_CANONICAL_URL,
  WAITING_LIST_FALLBACK_SUBJECT,
  WAITING_LIST_INTRO,
  WAITING_LIST_META_DESCRIPTION,
  WAITING_LIST_PAGE_TITLE,
  WAITING_LIST_PRIVACY_NOTE,
  WAITING_LIST_ROLES,
  WAITING_LIST_WHAT_HAPPENS,
} from "../data/waitingListPage";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../lib/usjetContact";
import { getAttribution, trackEvent } from "../lib/analytics";

type Status = "idle" | "sending" | "done" | "error";

const FIELD_CLASS =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder-white/35 outline-none focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/40";

const LABEL_CLASS = "flex flex-col gap-1.5 text-sm font-medium text-white/80";

/**
 * The channel that actually delivered this visitor. First-touch attribution
 * (UTM if the link carried one, else an inferred referrer channel) so we can
 * tell an Instagram signup from a Reddit one instead of guessing.
 */
function acquisitionChannel(): string {
  const attribution = getAttribution();
  return attribution?.source ?? attribution?.medium ?? "direct";
}

export default function WaitingList() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const prevTitle = document.title;
    const prevDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null;

    trackEvent("waitlist_view", { channel: acquisitionChannel() });

    document.title = WAITING_LIST_PAGE_TITLE;
    let description = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = WAITING_LIST_META_DESCRIPTION;

    return () => {
      document.title = prevTitle;
      if (description) {
        description.content = prevDescription ?? "";
      }
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      role: String(data.get("role") ?? ""),
      quantity: String(data.get("quantity") ?? ""),
      location: String(data.get("location") ?? ""),
      notes: String(data.get("notes") ?? ""),
      company: String(data.get("company") ?? ""),
    };

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/waiting-list", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "That did not go through. Email works too, link below.");
        setStatus("error");
        trackEvent("waitlist_error", {
          channel: acquisitionChannel(),
          reason: "rejected",
          http_status: res.status,
        });
        return;
      }

      trackEvent("waitlist_signup", {
        channel: acquisitionChannel(),
        signup_role: payload.role || "(unspecified)",
        signup_quantity: payload.quantity || "(unspecified)",
      });

      form.reset();
      setStatus("done");
    } catch {
      setError("That did not go through. Email works too, link below.");
      setStatus("error");
      trackEvent("waitlist_error", { channel: acquisitionChannel(), reason: "network" });
    }
  }

  return (
    <div className="sos-page page-atmosphere page-nav-offset mx-auto max-w-3xl px-6 pb-28 sm:px-8">
      <header className="sos-page__header">
        <div className="sos-page__kicker-row">
          <ClipboardList size={14} aria-hidden />
          <p className="sos-page__kicker">Operator&rsquo;s Rig &middot; Waiting list</p>
        </div>
        <h1 className="sos-page__title">Reserve the next Operator&rsquo;s Rig</h1>
        <p className="sos-page__subtitle">
          A place in line for a Mac that arrives with the AI already on it. No payment is taken on
          this page and nothing is owed.
        </p>
      </header>

      <GlassEffectContainer className="sos-page__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="sos-page__panel">
          <section className="sos-page__section">
            {WAITING_LIST_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="sos-page__body">
                {paragraph}
              </p>
            ))}
            <p className="wl-note">
              <strong>From the bench:</strong> I build these one at a time in New York, after the
              shop closes. Every rig ships with the six-volume manual set, and you will see your
              exact configuration and price in writing before anyone asks you for a dollar.
              &mdash;&nbsp;Ameer, USJET
            </p>
          </section>

          <section className="sos-page__section">
            <h2 className="sos-page__section-title">What happens after you send this</h2>
            <ol className="wl-steps">
              {WAITING_LIST_WHAT_HAPPENS.map((item, index) => (
                <li key={item.id} className="wl-step">
                  <span className="wl-step__n" aria-hidden>
                    {item.id === "no-obligation" ? "ANY TIME" : `STEP ${index + 1}`}
                  </span>
                  <h3 className="wl-step__title">{item.title}</h3>
                  <p className="wl-step__body">{item.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="sos-page__section" id="form">
            <h2 className="sos-page__section-title">Reserve a rig</h2>
            <p className="sos-page__body">
              Six questions, two of them optional. The more you tell us about the work, the better
              we can size the machine.
            </p>

            {status === "done" ? (
              <div
                role="status"
                className="mt-2 rounded-xl border border-cyan-300/40 bg-cyan-300/10 p-5"
              >
                <p className="text-base font-semibold text-white">You are on the list.</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  You will get a reply from {USJET_OPS_EMAIL} &mdash; usually a day or two, sometimes
                  the same evening. Nothing is owed and you can ask to come off the list any time.
                </p>
                <Link to="/returns" className="sos-page__inline-link mt-3 inline-block text-sm">
                  Read the refund policy
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="wl-form" noValidate={false}>
                <div className="wl-form__grid">
                  <label className={LABEL_CLASS} htmlFor="wl-name">
                    Name
                    <input
                      id="wl-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      maxLength={120}
                      className={FIELD_CLASS}
                    />
                  </label>

                  <label className={LABEL_CLASS} htmlFor="wl-email">
                    Email
                    <input
                      id="wl-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={200}
                      className={FIELD_CLASS}
                    />
                  </label>

                  <label className={LABEL_CLASS} htmlFor="wl-role">
                    What kind of work
                    <select id="wl-role" name="role" defaultValue="" className={FIELD_CLASS}>
                      <option value="">Choose one</option>
                      {WAITING_LIST_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={LABEL_CLASS} htmlFor="wl-quantity">
                    How many rigs
                    <select id="wl-quantity" name="quantity" defaultValue="1" className={FIELD_CLASS}>
                      <option value="1">1</option>
                      <option value="2-3">2 to 3</option>
                      <option value="4-9">4 to 9</option>
                      <option value="10+">10 or more</option>
                    </select>
                  </label>
                </div>

                <label className={LABEL_CLASS} htmlFor="wl-location">
                  <span>
                    City and state <span className="font-normal text-white/40">(optional)</span>
                  </span>
                  <input
                    id="wl-location"
                    name="location"
                    type="text"
                    maxLength={120}
                    placeholder="Shipping decides sales tax, so this helps"
                    className={FIELD_CLASS}
                  />
                </label>

                <label className={LABEL_CLASS} htmlFor="wl-notes">
                  <span>
                    What would you use it for <span className="font-normal text-white/40">(optional)</span>
                  </span>
                  <textarea
                    id="wl-notes"
                    name="notes"
                    rows={4}
                    maxLength={2000}
                    placeholder="The more specific, the better we can size the machine."
                    className={FIELD_CLASS}
                  />
                </label>

                {/* Honeypot. Hidden from people, irresistible to bots. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-px w-px opacity-0"
                />

                {status === "error" ? (
                  <p role="alert" className="text-sm text-amber-300">
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={status === "sending"} className="wl-submit">
                    {status === "sending" ? "Sending…" : "Join the waiting list"}
                  </button>
                  <a
                    href={mailtoUsjetOps(WAITING_LIST_FALLBACK_SUBJECT)}
                    className="sos-page__inline-link text-sm"
                  >
                    Or just email {USJET_OPS_EMAIL}
                  </a>
                </div>
              </form>
            )}

            <p className="mt-2 text-xs leading-relaxed text-white/45">{WAITING_LIST_PRIVACY_NOTE}</p>
          </section>

          <section className="sos-page__section">
            <h2 className="sos-page__section-title">Before you commit to anything</h2>
            <p className="sos-page__body">
              The <Link to="/returns" className="sos-page__inline-link">refund policy</Link> and the{" "}
              <Link to="/warranty" className="sos-page__inline-link">warranty</Link> are written out
              in full, and neither of them needs you to ask.
            </p>
            <p className="sos-page__body">
              Apple and Mac mini are trademarks of Apple Inc. USJET is an independent reseller and is
              not affiliated with Apple.
            </p>
          </section>
        </div>
      </GlassEffectContainer>
    </div>
  );
}
