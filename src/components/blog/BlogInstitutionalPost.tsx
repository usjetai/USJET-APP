import { Link } from "react-router-dom";
import { FileCheck, Shield } from "lucide-react";
import UsjetStarEmblem from "../brand/UsjetStarEmblem";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import type { UsjetBlogPost } from "../../data/usjetBlog";
import WefunderCovenantBridge from "../campaign/WefunderCovenantBridge";
import { WEFUNDER_GOAL_DISPLAY } from "../../lib/usjetCampaigns";

type BlogInstitutionalPostProps = {
  post: UsjetBlogPost;
};

export default function BlogInstitutionalPost({ post }: BlogInstitutionalPostProps) {
  const inst = post.institutional;
  const sections = post.manifestoSections ?? [];
  if (!inst) {
    return null;
  }

  return (
    <>
      <div className="blog-institutional-hero" aria-hidden>
        <div className="blog-institutional-hero__blueprint" />
        <UsjetStarEmblem className="blog-institutional-hero__star" decorative />
        <div className="blog-institutional-hero__seal">
          <Shield size={28} strokeWidth={2} aria-hidden />
          <span>Form C · Reg CF</span>
        </div>
        <p className="blog-institutional-hero__pre-sec">{inst.preSecLabel}</p>
      </div>

      <GlassEffectContainer className="blog-institutional glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="blog-institutional__inner">
          <p className="blog-institutional__carveout">
            <FileCheck size={14} aria-hidden />
            {inst.equityCarveout}
          </p>

          {sections.map((section) => (
            <section key={section.heading} className="blog-institutional__section">
              <h2 className="blog-institutional__heading">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="blog-institutional__p">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className="blog-institutional__funds" aria-labelledby="use-of-funds-heading">
            <h2 id="use-of-funds-heading" className="blog-institutional__heading">
              Use of funds
            </h2>
            <ul className="blog-institutional__funds-grid">
              {inst.useOfFunds.map((row) => (
                <li key={row.label} className="blog-institutional__fund-row">
                  <span>{row.label}</span>
                  <strong>{row.amount}</strong>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </GlassEffectContainer>

      <section className="blog-institutional-hangar" aria-labelledby="hangar-opening-heading">
        <GlassEffectContainer className="blog-institutional-hangar__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
          <div className="blog-institutional-hangar__inner">
            <p className="blog-institutional-hangar__kicker">Reservations · community round</p>
            <h2 id="hangar-opening-heading" className="blog-institutional-hangar__title">
              {inst.hangarTitle}
            </h2>
            <p className="blog-institutional-hangar__copy">{inst.hangarCopy}</p>
            <p className="blog-institutional-hangar__meter" aria-label={`Reservation goal ${WEFUNDER_GOAL_DISPLAY}`}>
              {inst.goalMeterLabel}
            </p>
            <div className="blog-institutional-hangar__meter-track">
              <span className="blog-institutional-hangar__meter-fill" style={{ width: "2%" }} />
            </div>
            <WefunderCovenantBridge variant="prominent" showTicker className="blog-institutional-hangar__bridge" />
            <p className="blog-institutional-hangar__note">
              SEC-regulated community round · Form C · Pre-launch reservation queue on Wefunder
            </p>
          </div>
        </GlassEffectContainer>
      </section>

      <div className="blog-institutional-app">
        <div className="blog-institutional-app__phone" aria-hidden>
          <div className="blog-institutional-app__screen">
            <UsjetStarEmblem className="blog-institutional-app__icon" decorative />
          </div>
        </div>
        <div className="blog-institutional-app__copy">
          <p className="blog-institutional-app__line">{inst.appStoreLine}</p>
          <p className="blog-institutional-app__sub">{inst.appStoreSub}</p>
        </div>
      </div>

      {post.footerCta ? (
        <footer className="blog-manifesto__cta blog-institutional__footer-cta">
          <p className="blog-manifesto__cta-intro">{post.footerCta.intro}</p>
          <div className="blog-manifesto__cta-links">
            {post.footerCta.links.map((link) => (
              <Link key={link.to} to={link.to} className="blog-manifesto__cta-btn glass-effect-interactive">
                {link.label}
              </Link>
            ))}
          </div>
        </footer>
      ) : null}
    </>
  );
}
