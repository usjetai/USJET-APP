import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  ABOUT_CANONICAL_URL,
  ABOUT_ENTITY_LINE,
  ABOUT_FACTS,
  ABOUT_FOUNDER_KICKER,
  ABOUT_FOUNDER_NAME,
  ABOUT_SECTIONS,
} from "../data/aboutPage";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../lib/usjetContact";

export default function About() {
  return (
    <div className="sos-page page-atmosphere page-nav-offset mx-auto max-w-3xl px-6 pb-28 sm:px-8">
      <header className="sos-page__header">
        <div className="sos-page__kicker-row">
          <UserRound size={14} aria-hidden />
          <p className="sos-page__kicker">{ABOUT_FOUNDER_KICKER}</p>
        </div>
        <h1 className="sos-page__title">{ABOUT_FOUNDER_NAME}</h1>
        <p className="sos-page__subtitle">
          {ABOUT_ENTITY_LINE}. Canonical URL:{" "}
          <a href={ABOUT_CANONICAL_URL} className="sos-page__inline-link">
            {ABOUT_CANONICAL_URL}
          </a>
          .
        </p>
      </header>

      <GlassEffectContainer className="sos-page__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="sos-page__panel">
          <section className="sos-page__section">
            <h2 className="sos-page__section-title">On the ledger</h2>
            <ul className="sos-page__list">
              {ABOUT_FACTS.map((fact) => (
                <li key={fact.label}>
                  <strong>{fact.label}.</strong>{" "}
                  {fact.label === "Ops" ? (
                    <a href={mailtoUsjetOps("USJET About")} className="sos-page__inline-link">
                      {USJET_OPS_EMAIL}
                    </a>
                  ) : (
                    fact.value
                  )}
                </li>
              ))}
            </ul>
          </section>

          {ABOUT_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="sos-page__section">
              <h2 className="sos-page__section-title">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="sos-page__lead">
                  {paragraph.includes("ops@usjet.ai") ? (
                    <>
                      {paragraph.split("ops@usjet.ai")[0]}
                      <a href={mailtoUsjetOps("USJET About")} className="sos-page__inline-link">
                        {USJET_OPS_EMAIL}
                      </a>
                      {paragraph.split("ops@usjet.ai")[1]}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </section>
          ))}
        </div>
      </GlassEffectContainer>

      <section className="sos-page__footer mt-12 text-center" aria-labelledby="about-footer-heading">
        <p id="about-footer-heading" className="sos-page__subtitle mx-auto mb-5 max-w-md text-balance">
          Returns, manufacturer warranty, and how to write us about a box that landed wrong.
        </p>
        <Link to="/returns" className="sos-page__inline-link">
          Returns &amp; warranty
        </Link>
        {" · "}
        <Link to="/" className="sos-page__inline-link">
          Shop Homes
        </Link>
      </section>
    </div>
  );
}
