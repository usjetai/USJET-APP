import { Link } from "react-router-dom";
import {
  BookOpen,
  CircleHelp,
  CreditCard,
  LifeBuoy,
  LogIn,
  Mail,
  MessageSquareText,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { SECURITY_STRIPE_ONLY_MAY_2026 } from "../data/founderManifesto";
import { ORIGIN_CS_ROUTE } from "../lib/memberAccessLevel";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../lib/usjetContact";

type HelpTopic = {
  id: string;
  title: string;
  icon: typeof CircleHelp;
  body: ReactNode;
};

const HELP_TOPICS: HelpTopic[] = [
  {
    id: "start",
    title: "Quick start",
    icon: CircleHelp,
    body: (
      <ul className="sos-page__list">
        <li>
          <strong>Hangar</strong> (<Link to="/">/</Link>) — home workbench. First 6 tabs are free; open a bay to work
          in-tile.
        </li>
        <li>
          <strong>Fleet</strong> (<Link to="/fleet">/fleet</Link>) — runway of partner AIs. Guests get 10 free bays.
        </li>
        <li>
          <strong>Jet Browser</strong> (<Link to="/jet-browser">/jet-browser</Link>) — paste any domain into tiles;
          enlarge to work, shrink to formation.
        </li>
        <li>
          <strong>Learn the ship</strong> — full glossary and lessons live on{" "}
          <Link to="/ai-101">AI 101</Link>, not here.
        </li>
      </ul>
    ),
  },
  {
    id: "login",
    title: "Login & Member ID",
    icon: LogIn,
    body: (
      <>
        <p className="sos-page__lead">
          Go to{" "}
          <Link to="/member/login" className="sos-page__inline-link">
            Member Login
          </Link>
          . Pay on Stripe first, then verify with <strong>billing email</strong> plus your{" "}
          <strong>access sentence</strong> or Stripe <strong>Member ID</strong> (<code className="sos-page__code">cus_…</code>
          ). Email alone does not unlock the portal.
        </p>
        <ul className="sos-page__list">
          <li>
            <strong>No Google / Apple sign-in.</strong> {SECURITY_STRIPE_ONLY_MAY_2026.noOAuthEver.join(" ")}
          </li>
          <li>
            <strong>Not your Stripe password.</strong> Use the billing email you paid with, plus the sentence or{" "}
            <code className="sos-page__code">cus_…</code> from your receipt.
          </li>
          <li>
            <strong>Session length.</strong> A verified session lasts about 24 hours in this browser; Sign out clears it.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "billing",
    title: "Plans & billing",
    icon: CreditCard,
    body: (
      <ul className="sos-page__list">
        <li>
          <strong>Flight Pass — $19.90/mo</strong> — full Hangar tabs + Member Portal.
        </li>
        <li>
          <strong>Hangar Pro — $49.95/mo</strong> — adds Intel.
        </li>
        <li>
          <strong>Enterprise Commander — $199.99/mo</strong> — adds Origin + 1995 Grit Vault.
        </li>
        <li>
          <strong>Manage charges</strong> in your Stripe customer portal / receipt tools. Cancel and invoices stay with
          Stripe — email Ops if you need a human handoff.
        </li>
      </ul>
    ),
  },
  {
    id: "hangar",
    title: "Hangar & tiles",
    icon: Wrench,
    body: (
      <ul className="sos-page__list">
        <li>
          <strong>Open a bay</strong> — click a Hangar tile to load the workbench in place.
        </li>
        <li>
          <strong>Enlarge / shrink</strong> — use the maximize control on an open tile for a tall work surface; Escape or
          shrink returns to formation.
        </li>
        <li>
          <strong>Blank or blocked partner</strong> — some sites refuse iframes. Use the in-tile Open handoff (same
          window / cockpit). Never expect a new browser tab from USJET.
        </li>
        <li>
          <strong>Page looks stale</strong> — hard reload:{" "}
          <kbd className="sos-page__kbd">Ctrl</kbd>+<kbd className="sos-page__kbd">Shift</kbd>+
          <kbd className="sos-page__kbd">R</kbd> (Windows) or <kbd className="sos-page__kbd">Cmd</kbd>+
          <kbd className="sos-page__kbd">Shift</kbd>+<kbd className="sos-page__kbd">R</kbd> (Mac).
        </li>
      </ul>
    ),
  },
  {
    id: "origin",
    title: "Origin help chat",
    icon: MessageSquareText,
    body: (
      <>
        <p className="sos-page__lead">
          <Link to="/origin" className="sos-page__inline-link">
            Origin
          </Link>{" "}
          is onboard ship help (text). It answers Hangar, Fleet, tiers, and login from USJET knowledge — no paid cloud
          bill. Customer Service entry:{" "}
          <Link to={ORIGIN_CS_ROUTE} className="sos-page__inline-link">
            Origin CS
          </Link>
          .
        </p>
        <ul className="sos-page__list">
          <li>
            <strong>Ask plainly</strong> — “How do I log in?”, “What does Claude do?”, “How much is Flight Pass?”
          </li>
          <li>
            <strong>Enterprise clearance</strong> may be required for the full Origin route depending on your tier.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Ops",
    icon: Mail,
    body: (
      <ul className="sos-page__list">
        <li>
          Email{" "}
          <a href={mailtoUsjetOps("USJET Help")} className="sos-page__inline-link">
            {USJET_OPS_EMAIL}
          </a>{" "}
          for billing disputes, lockouts, or anything chat cannot close.
        </li>
        <li>
          <strong>Response time</strong> — usually 1–3 business days (async, not an on-call desk).
        </li>
        <li>Include what you tried, your billing email, and the page URL.</li>
      </ul>
    ),
  },
];

export default function Sos() {
  return (
    <div className="sos-page page-atmosphere page-nav-offset mx-auto max-w-3xl px-6 pb-28 sm:px-8">
      <header className="sos-page__header">
        <div className="sos-page__kicker-row">
          <LifeBuoy size={14} aria-hidden />
          <p className="sos-page__kicker">Help center</p>
        </div>
        <h1 className="sos-page__title">How can we help?</h1>
        <p className="sos-page__subtitle">
          Short answers for login, Hangar tiles, plans, and Origin. For the full flight school — glossary, lessons, and
          how the ship works — go to <Link to="/ai-101">AI 101</Link>.
        </p>
      </header>

      <div className="sos-page__topics" role="list">
        {HELP_TOPICS.map((topic) => {
          const Icon = topic.icon;
          return (
            <GlassEffectContainer
              key={topic.id}
              className="sos-page__topic glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
              role="listitem"
            >
              <div className="sos-page__topic-head">
                <span className="sos-page__topic-icon" aria-hidden>
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <h2 className="sos-page__section-title">{topic.title}</h2>
              </div>
              <div className="sos-page__section">{topic.body}</div>
            </GlassEffectContainer>
          );
        })}
      </div>

      <section
        className="sos-page__footer mt-12 scroll-mt-28 text-center sm:scroll-mt-32"
        aria-labelledby="sos-learn-heading"
      >
        <p id="sos-learn-heading" className="sos-page__subtitle mx-auto mb-5 max-w-md text-balance">
          Need the real curriculum? AI 101 is the knowledge deck.
        </p>
        <Link
          to="/ai-101?from=sos"
          className="sos-page__ai101-badge glass-effect glass-effect--rounded-rect glass-effect-interactive"
          aria-label="Open AI 101 flight school"
        >
          <span className="sos-page__ai101-badge__ribbon" aria-hidden>
            Learn
          </span>
          <BookOpen className="sos-page__ai101-badge__icon" size={20} strokeWidth={2.2} aria-hidden />
          <span className="sos-page__ai101-badge__label">AI 101</span>
        </Link>
      </section>
    </div>
  );
}
