import { Link } from "react-router-dom";
import {
  CircleHelp,
  CreditCard,
  LifeBuoy,
  Mail,
  Package,
  Sparkles,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
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
          <strong>Homes</strong> (<Link to="/">/</Link>) — AI computers for personal use.
        </li>
        <li>
          <strong>Business</strong> (<Link to="/fleet">/fleet</Link>) — higher-memory machines for a shop or office.
        </li>
        <li>
          <strong>Manuals</strong> (<Link to="/store">/store</Link>) — the AI Book Series, plus the full computer
          lineup.
        </li>
        <li>
          <strong>Aviation Books</strong> (<Link to="/aviation-books">/aviation-books</Link>) — the Founder's
          aviation titles.
        </li>
      </ul>
    ),
  },
  {
    id: "checkout",
    title: "Ordering & checkout",
    icon: CreditCard,
    body: (
      <ul className="sos-page__list">
        <li>
          <strong>No account needed.</strong> Every computer order is a one-time purchase through Stripe's hosted
          checkout — no sign-in, no subscription.
        </li>
        <li>
          <strong>&ldquo;Talk to order&rdquo; items</strong> are configured to your specification after you email{" "}
          <a href={mailtoUsjetOps("USJET Order")} className="sos-page__inline-link">
            {USJET_OPS_EMAIL}
          </a>
          ; price and availability are confirmed with you before any charge.
        </li>
        <li>
          <strong>AI Book Series</strong> titles are sold on Amazon — the buy button on Manuals takes you straight
          to that book's Amazon listing.
        </li>
      </ul>
    ),
  },
  {
    id: "shipping",
    title: "Shipping & delivery",
    icon: Truck,
    body: (
      <ul className="sos-page__list">
        <li>We buy the exact SKU shown and configure it as an Operator's Rig before shipping.</li>
        <li>Orders ship to US addresses only. Risk of loss passes to you on delivery to the shipping carrier.</li>
        <li>
          Questions on an order in transit — email{" "}
          <a href={mailtoUsjetOps("USJET Shipping")} className="sos-page__inline-link">
            {USJET_OPS_EMAIL}
          </a>{" "}
          with your order confirmation.
        </li>
      </ul>
    ),
  },
  {
    id: "returns",
    title: "Returns & warranty",
    icon: Package,
    body: (
      <ul className="sos-page__list">
        <li>Defective-on-arrival units may be returned for repair, replacement, or refund — email Ops to start one.</li>
        <li>Original manufacturer warranties (Apple, AMD OEM, etc.) apply in addition to any USJET policy.</li>
        <li>See <Link to="/terms" className="sos-page__inline-link">Terms</Link> for the full policy.</li>
      </ul>
    ),
  },
  {
    id: "ai-preview",
    title: "Trying the AI assistant",
    icon: Sparkles,
    body: (
      <p className="sos-page__lead">
        Some AI Computers product pages let you launch a partner AI assistant in the same window to preview what
        the machine's local stack (Ollama, Open WebUI, AnythingLLM) can do before you buy. It's a preview, not the
        finished on-box experience — that ships already installed on the machine.
      </p>
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
          for order issues, billing disputes, or anything not covered above.
        </li>
        <li>
          <strong>Response time</strong> — usually 1–3 business days (async, not an on-call desk).
        </li>
        <li>Include your order confirmation and the page URL.</li>
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
          Short answers for ordering, shipping, returns, and the AI Book Series.
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
    </div>
  );
}
