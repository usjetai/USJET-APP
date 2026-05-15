import { Link } from "react-router-dom";
import BlogNoSignalVisual from "./BlogNoSignalVisual";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import type { UsjetBlogPost } from "../../data/usjetBlog";

type BlogManifestoPostProps = {
  post: UsjetBlogPost;
};

export default function BlogManifestoPost({ post }: BlogManifestoPostProps) {
  const sections = post.manifestoSections ?? [];

  return (
    <>
      <BlogNoSignalVisual />

      <GlassEffectContainer className="blog-manifesto glass-effect glass-effect--rounded-rect liquid-glass-background">
        <div className="blog-manifesto__inner">
          {sections.map((section, index) => (
            <section key={section.heading} className="blog-manifesto__section">
              <h2 className="blog-manifesto__heading">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="blog-manifesto__p">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="blog-manifesto__bullets">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {index === 1 && post.realityCheck ? (
                <aside className="blog-manifesto__reality" role="note">
                  <p className="blog-manifesto__reality-label">Reality check</p>
                  <p className="blog-manifesto__reality-copy">{post.realityCheck}</p>
                </aside>
              ) : null}
            </section>
          ))}
        </div>
      </GlassEffectContainer>

      {post.footerCta ? (
        <footer className="blog-manifesto__cta">
          <p className="blog-manifesto__cta-intro">{post.footerCta.intro}</p>
          <div className="blog-manifesto__cta-links">
            {post.footerCta.links.map((link) =>
              link.external ? (
                <a
                  key={link.to}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-manifesto__cta-btn glass-effect-interactive"
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.to} to={link.to} className="blog-manifesto__cta-btn glass-effect-interactive">
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </footer>
      ) : null}
    </>
  );
}
