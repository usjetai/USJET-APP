import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import BlogInstitutionalPost from "../components/blog/BlogInstitutionalPost";
import BlogManifestoPost from "../components/blog/BlogManifestoPost";
import UsjetBlogCadenceBanner from "../components/blog/UsjetBlogCadenceBanner";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  BLOG_ROUTE,
  formatBlogDate,
  getBlogPostBySlug,
  getBlogPostsNewestFirst,
} from "../data/usjetBlog";
import { BLOG_CADENCE_TOTAL_DAYS } from "../lib/usa250BlogCadence";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const siblings = getBlogPostsNewestFirst();

  useEffect(() => {
    if (!post) {
      return;
    }
    const prev = document.title;
    document.title = post.seoTitle ?? `${post.title} · USJET Blog`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", post.seoDescription ?? post.excerpt);
    document.documentElement.classList.add("blog-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("blog-page-root");
    };
  }, [post]);

  if (!post) {
    return (
      <div className="blog-page page-atmosphere page-nav-offset mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-black uppercase text-white">Dispatch not found</h1>
        <Link to={BLOG_ROUTE} className="mt-4 inline-block text-cyan-300 underline-offset-4 hover:underline">
          ← Back to operator log
        </Link>
      </div>
    );
  }

  const index = siblings.findIndex((entry) => entry.slug === post.slug);
  const newer = index > 0 ? siblings[index - 1] : undefined;
  const older = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined;

  return (
    <article
      className={[
        "blog-post page-atmosphere page-nav-offset mx-auto max-w-3xl px-4 pb-36 pt-4 sm:px-6",
        post.variant === "manifesto"
          ? "blog-post--manifesto"
          : post.variant === "institutional"
            ? "blog-post--institutional"
            : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="blog-post__back">
        <Link to={BLOG_ROUTE}>← Operator log</Link>
      </p>

      <UsjetBlogCadenceBanner />

      <header className="blog-post__hero">
        <div className="blog-post__meta">
          <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
          {post.cadenceDay <= BLOG_CADENCE_TOTAL_DAYS ? <span>Day {post.cadenceDay} of 50</span> : null}
        </div>
        <h1 className="blog-post__title">{post.title}</h1>
        <p className="blog-post__subtitle">{post.subtitle}</p>
        <div className="blog-post__tags">
          {post.tags.map((tag) => (
            <span key={tag} className="blog-post__tag">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {post.variant === "institutional" ? (
        <BlogInstitutionalPost post={post} />
      ) : post.variant === "manifesto" ? (
        <BlogManifestoPost post={post} />
      ) : (
        <GlassEffectContainer className="blog-post__body-shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="blog-post__body">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </GlassEffectContainer>
      )}

      {post.faqs?.length ? (
        <section className="blog-post__faq" aria-label="Frequently asked questions">
          <h2 className="blog-post__faq-heading">Frequently asked</h2>
          <div className="blog-post__faq-list">
            {post.faqs.map((faq) => (
              <div key={faq.question} className="blog-post__faq-item">
                <h3 className="blog-post__faq-question">{faq.question}</h3>
                <p className="blog-post__faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {post.variant !== "manifesto" && post.footerCta ? (
        <footer className="blog-manifesto__cta">
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

      <nav className="blog-post__nav" aria-label="Adjacent dispatches">
        {older ? (
          <Link to={`${BLOG_ROUTE}/${older.slug}`} className="blog-post__nav-link blog-post__nav-link--older">
            ← {older.title}
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link to={`${BLOG_ROUTE}/${newer.slug}`} className="blog-post__nav-link blog-post__nav-link--newer">
            {newer.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
