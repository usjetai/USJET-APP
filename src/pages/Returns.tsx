import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  RETURNS_CANONICAL_URL,
  RETURNS_SECTIONS,
} from "../data/returnsPage";
import { TERMS_ROUTE } from "../data/termsPage";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../lib/usjetContact";

export default function Returns() {
  return (
    <div className="sos-page page-atmosphere page-nav-offset mx-auto max-w-3xl px-6 pb-28 sm:px-8">
      <header className="sos-page__header">
        <div className="sos-page__kicker-row">
          <ShieldCheck size={14} aria-hidden />
          <p className="sos-page__kicker">Orders · legal</p>
        </div>
        <h1 className="sos-page__title">Returns &amp; warranty</h1>
        <p className="sos-page__subtitle">
          What we can say in public without inventing a policy. Canonical URL:{" "}
          <a href={RETURNS_CANONICAL_URL} className="sos-page__inline-link">
            {RETURNS_CANONICAL_URL}
          </a>
          .
        </p>
      </header>

      <GlassEffectContainer className="sos-page__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="sos-page__panel">
          {RETURNS_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="sos-page__section">
              <h2 className="sos-page__section-title">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 64)} className="sos-page__lead">
                  {paragraph.includes("ops@usjet.ai") ? (
                    <>
                      {paragraph.split("ops@usjet.ai")[0]}
                      <a href={mailtoUsjetOps("USJET returns")} className="sos-page__inline-link">
                        {USJET_OPS_EMAIL}
                      </a>
                      {paragraph.split("ops@usjet.ai").slice(1).join("ops@usjet.ai")}
                    </>
                  ) : paragraph.includes(TERMS_ROUTE) ? (
                    <>
                      {paragraph.split(TERMS_ROUTE)[0]}
                      <Link to={TERMS_ROUTE} className="sos-page__inline-link">
                        {TERMS_ROUTE}
                      </Link>
                      {paragraph.split(TERMS_ROUTE)[1]}
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

      <section className="sos-page__footer mt-12 text-center" aria-labelledby="returns-footer-heading">
        <p id="returns-footer-heading" className="sos-page__subtitle mx-auto mb-5 max-w-md text-balance">
          Questions on an order you already paid? Start with Help, or write Ops with the Stripe receipt.
        </p>
        <Link to="/sos" className="sos-page__inline-link">
          Help
        </Link>
        {" · "}
        <Link to="/about" className="sos-page__inline-link">
          About
        </Link>
        {" · "}
        <Link to={TERMS_ROUTE} className="sos-page__inline-link">
          Terms
        </Link>
      </section>
    </div>
  );
}
