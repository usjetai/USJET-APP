import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import MobileRotateIcon from "../components/layout/MobileRotateIcon";
import {
  MOBILE_LANDSCAPE_HOW_ANDROID,
  MOBILE_LANDSCAPE_HOW_IOS,
  MOBILE_LANDSCAPE_INTRO,
  MOBILE_LANDSCAPE_NOTE,
  MOBILE_LANDSCAPE_TAGLINE,
  MOBILE_LANDSCAPE_TITLE,
  MOBILE_LANDSCAPE_WHY,
} from "../data/mobileLandscapeGuide";

export default function MobileLandscapeGuide() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Landscape view · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET.AI works best in landscape on mobile—full fleet tiles, nav, and ops toolbar. How to rotate your device.",
    );
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="mobile-landscape-page page-atmosphere page-nav-offset mx-auto max-w-2xl px-4 pb-36 pt-4 sm:px-6">
      <header className="mobile-landscape-page__hero text-center">
        <p className="mobile-landscape-page__eyebrow">
          <Smartphone size={14} aria-hidden />
          {MOBILE_LANDSCAPE_TAGLINE}
        </p>
        <div className="mobile-landscape-page__icon-hero" aria-hidden>
          <MobileRotateIcon large />
        </div>
        <h1 className="mobile-landscape-page__title">{MOBILE_LANDSCAPE_TITLE}</h1>
        <p className="mobile-landscape-page__intro">{MOBILE_LANDSCAPE_INTRO}</p>
      </header>

      <GlassEffectContainer className="mobile-landscape-page__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="mobile-landscape-page__inner">
          <section className="mobile-landscape-page__section">
            <h2 className="mobile-landscape-page__section-title">Why landscape</h2>
            <ul className="mobile-landscape-page__list">
              {MOBILE_LANDSCAPE_WHY.map((item) => (
                <li key={item.heading} className="mobile-landscape-page__item">
                  <h3>{item.heading}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mobile-landscape-page__section">
            <h2 className="mobile-landscape-page__section-title">iPhone / iPad</h2>
            <ol className="mobile-landscape-page__steps">
              {MOBILE_LANDSCAPE_HOW_IOS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="mobile-landscape-page__section">
            <h2 className="mobile-landscape-page__section-title">Android</h2>
            <ol className="mobile-landscape-page__steps">
              {MOBILE_LANDSCAPE_HOW_ANDROID.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <p className="mobile-landscape-page__note">{MOBILE_LANDSCAPE_NOTE}</p>
        </div>
      </GlassEffectContainer>

      <p className="mobile-landscape-page__back">
        <Link to="/" className="mobile-landscape-page__link">
          ← Back to Fleet
        </Link>
      </p>
    </div>
  );
}
