import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  WARRANTY_CANONICAL_URL,
  WARRANTY_EFFECTIVE_DATE,
  WARRANTY_ENTITY,
  WARRANTY_META_DESCRIPTION,
  WARRANTY_PAGE_TITLE,
  WARRANTY_SECTIONS,
} from "../data/warrantyPage";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../lib/usjetContact";

export default function Warranty() {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null;

    document.title = WARRANTY_PAGE_TITLE;
    let description = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = WARRANTY_META_DESCRIPTION;

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
          <ShieldCheck size={14} aria-hidden />
          <p className="sos-page__kicker">Legal &amp; ops</p>
        </div>
        <h1 className="sos-page__title">
          <span className="sos-page__title-route">/warranty</span>
        </h1>
        <p className="sos-page__subtitle">
          The USJET Limited Warranty on every Operator's Rig. Effective {WARRANTY_EFFECTIVE_DATE}. Issued by {WARRANTY_ENTITY}. Canonical URL:{" "}
          <a href={WARRANTY_CANONICAL_URL} className="sos-page__inline-link">
            {WARRANTY_CANONICAL_URL}
          </a>
          .
        </p>
      </header>

      <GlassEffectContainer className="sos-page__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="sos-page__panel">
          {WARRANTY_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="sos-page__section">
              <h2 className="sos-page__section-title">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 64)} className="sos-page__lead">
                  {paragraph.includes("ops@usjet.ai") ? (
                    <>
                      {paragraph.split("ops@usjet.ai")[0]}
                      <a href={mailtoUsjetOps("USJET Warranty")} className="sos-page__inline-link">
                        {USJET_OPS_EMAIL}
                      </a>
                      {paragraph.split("ops@usjet.ai")[1]}
                    </>
                  ) : (
                    paragraph
                  )}
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

      <section className="sos-page__footer mt-12 text-center" aria-labelledby="warranty-footer-heading">
        <p id="warranty-footer-heading" className="sos-page__subtitle mx-auto mb-5 max-w-md text-balance">
          Questions about an order, a return, or a rig you already own? Start with site operating support.
        </p>
        <Link
          to="/sos"
          className="sos-page__ai101-badge glass-effect glass-effect--rounded-rect glass-effect-interactive"
          aria-label="Open USJET site operating support"
        >
          <ShieldCheck className="sos-page__ai101-badge__icon" size={20} strokeWidth={2.2} aria-hidden />
          <span className="sos-page__ai101-badge__label">SOS</span>
        </Link>
      </section>
    </div>
  );
}
