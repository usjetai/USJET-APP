import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LifeBuoy, ShieldCheck } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  SUPPORT_CANONICAL_URL,
  SUPPORT_EFFECTIVE_DATE,
  SUPPORT_META_DESCRIPTION,
  SUPPORT_PAGE_TITLE,
  SUPPORT_PLANS,
  SUPPORT_SECTIONS,
} from "../data/supportPage";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../lib/usjetContact";
import { trackEvent } from "../lib/analytics";

/** Renders a paragraph, turning the one address we publish into a mailto. */
function withOpsLink(text: string, subject: string) {
  if (!text.includes(USJET_OPS_EMAIL)) return text;
  const [before, after] = text.split(USJET_OPS_EMAIL);
  return (
    <>
      {before}
      <a href={mailtoUsjetOps(subject)} className="sos-page__inline-link">
        {USJET_OPS_EMAIL}
      </a>
      {after}
    </>
  );
}

export default function Support() {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null;

    document.title = SUPPORT_PAGE_TITLE;
    let description = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = SUPPORT_META_DESCRIPTION;

    return () => {
      document.title = prevTitle;
      if (description) {
        description.content = prevDescription ?? "";
      }
    };
  }, []);

  return (
    <div className="sos-page page-atmosphere page-nav-offset mx-auto max-w-3xl px-6 pb-28 sm:px-8">
      <header className="sos-page__header">
        <div className="sos-page__kicker-row">
          <LifeBuoy size={14} aria-hidden />
          <p className="sos-page__kicker">Support plans</p>
        </div>
        <h1 className="sos-page__title">
          <span className="sos-page__title-route">/support</span>
        </h1>
        <p className="sos-page__subtitle">
          What comes with every Operator's Rig, and the two plans that extend it. A person, not a ticket queue. Effective{" "}
          {SUPPORT_EFFECTIVE_DATE}. Canonical URL:{" "}
          <a href={SUPPORT_CANONICAL_URL} className="sos-page__inline-link">
            {SUPPORT_CANONICAL_URL}
          </a>
          .
        </p>
      </header>

      <GlassEffectContainer className="sos-page__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="sos-page__panel">
          {SUPPORT_PLANS.map((plan) => (
            <section key={plan.id} id={plan.id} className="sos-page__section support-plan">
              <div className="support-plan__head">
                <div>
                  <h2 className="sos-page__section-title">{plan.name}</h2>
                  <p className="support-plan__audience">{plan.audience}</p>
                </div>
                <span className={["support-plan__price", plan.paid ? "" : "support-plan__price--included"].join(" ")}>
                  {plan.priceLine}
                </span>
              </div>
              <p className="sos-page__body">{plan.summary}</p>
              <ul className="sos-page__list">
                {plan.includes.map((item) => (
                  <li key={item}>{withOpsLink(item, `USJET Support — ${plan.name}`)}</li>
                ))}
              </ul>
              {plan.paid ? (
                <Link
                  to="/waiting-list"
                  className="hw-card__cart-btn support-plan__cta"
                  onClick={() => trackEvent("reserve_click", { placement: "support", rig: plan.name })}
                >
                  Reserve a rig, ask about {plan.name}
                </Link>
              ) : null}
            </section>
          ))}

          {SUPPORT_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="sos-page__section">
              <h2 className="sos-page__section-title">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 64)} className="sos-page__lead">
                  {withOpsLink(paragraph, "USJET Support")}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="sos-page__list">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </GlassEffectContainer>

      <section className="sos-page__footer mt-12 text-center" aria-labelledby="support-footer-heading">
        <p id="support-footer-heading" className="sos-page__subtitle mx-auto mb-5 max-w-md text-balance">
          The free baseline every rig ships with is a written warranty. Read it before you buy.
        </p>
        <Link
          to="/warranty"
          className="sos-page__ai101-badge glass-effect glass-effect--rounded-rect glass-effect-interactive"
          aria-label="Read the USJET Limited Warranty"
        >
          <ShieldCheck className="sos-page__ai101-badge__icon" size={20} strokeWidth={2.2} aria-hidden />
          <span className="sos-page__ai101-badge__label">Warranty</span>
        </Link>
      </section>
    </div>
  );
}
