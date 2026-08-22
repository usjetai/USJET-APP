import { Link } from "react-router-dom";
import {
  BookOpen,
  CircleHelp,
  CreditCard,
  LifeBuoy,
  Mail,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { LEFTOVER_FLIGHT_PASS } from "../data/seoMoneyPages";
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
          <strong>Homes</strong> (<Link to="/">/</Link>) — AI computers for the house. That is the primary shop.
        </li>
        <li>
          <strong>Business</strong> (<Link to="/business">/business</Link>) — AI computers and always-on boxes for a
          shop or office.
        </li>
        <li>
          <strong>Manuals</strong> (<Link to="/store">/store</Link>) — the Engineering Series books.
        </li>
        <li>
          <strong>About</strong> / <strong>Returns</strong> —{" "}
          <Link to="/about">who sells this</Link> and{" "}
          <Link to="/returns">warranty language from the Terms</Link>.
        </li>
        <li>
          <strong>Learn the shop</strong> — full lesson on <Link to="/ai-101">AI 101</Link>. Portrait works; you do not
          have to rotate.
        </li>
      </ul>
    ),
  },
  {
    id: "orders",
    title: "Orders & setup",
    icon: Wrench,
    body: (
      <ul className="sos-page__list">
        <li>
          <strong>What you bought</strong> — the listed computer plus the local assistant we install. Confirmation
          follows the Stripe email.
        </li>
        <li>
          <strong>If it arrives wrong</strong> — write{" "}
          <Link to="/returns">Returns &amp; warranty</Link> / Ops with the receipt. Manufacturer warranties apply; we
          do not advertise a 30-day no-questions return as settled policy.
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
    id: "billing",
    title: "Paying",
    icon: CreditCard,
    body: (
      <ul className="sos-page__list">
        <li>
          <strong>Computers</strong> — one-time Stripe checkout on the tile. No monthly plan required.
        </li>
        <li>
          <strong>Books</strong> — Kindle and paperback on Amazon from Manuals.
        </li>
        <li>
          <strong>Leftover monthly link</strong> — {LEFTOVER_FLIGHT_PASS.body}{" "}
          <a href={LEFTOVER_FLIGHT_PASS.href} className="sos-page__inline-link" data-usjet-external-leak="true">
            {LEFTOVER_FLIGHT_PASS.ctaLabel}
          </a>
        </li>
        <li>
          <strong>Manage charges</strong> in your Stripe receipt tools. Email Ops if you need a human handoff.
        </li>
      </ul>
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
          for orders, shipping, a box that landed wrong, or anything the shop page cannot close.
        </li>
        <li>
          <strong>Response time</strong> — usually 1–3 business days (async, not an on-call desk).
        </li>
        <li>Include what you tried, your Stripe receipt email, and the page URL.</li>
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
          Short answers for orders, Homes vs Business, and the books. For the full lesson — go to{" "}
          <Link to="/ai-101">AI 101</Link>.
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
          Need the real curriculum? AI 101 is the lesson.
        </p>
        <Link
          to="/ai-101?from=sos"
          className="sos-page__ai101-badge glass-effect glass-effect--rounded-rect glass-effect-interactive"
          aria-label="Open AI 101"
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
