import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { BLOG_ROUTE, formatBlogDate, getBlogPostsNewestFirst } from "../data/usjetBlog";

export default function Blog() {
  const posts = getBlogPostsNewestFirst();

  useEffect(() => {
    const prev = document.title;
    document.title = "USJET Blog — Operator's Rig & Manuals";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET blog: Operator's Rig hardware notes, local-AI buyer's guides, and the Engineering Series.",
    );
    document.documentElement.classList.add("blog-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("blog-page-root");
    };
  }, []);

  return (
    <div className="blog-page page-atmosphere page-nav-offset mx-auto max-w-4xl px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <header className="blog-page__hero">
        <p className="blog-page__eyebrow">
          <Newspaper size={16} aria-hidden />
          Operator notes
        </p>
        <h1 className="blog-page__title">USJET Blog</h1>
        <p className="blog-page__lede">
          Hardware notes, local-AI buyer's guides, and the Engineering Series — dated posts from the Founder, not a
          launch countdown.
        </p>
      </header>

      <ul className="blog-page__list">
        {posts.map((post) => (
          <li key={post.slug}>
            <GlassEffectContainer className="blog-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
              <article className="blog-card__inner">
                <div className="blog-card__meta">
                  <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                </div>
                <h2 className="blog-card__title">
                  <Link to={`${BLOG_ROUTE}/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-card__subtitle">{post.subtitle}</p>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <div className="blog-card__tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="blog-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={`${BLOG_ROUTE}/${post.slug}`} className="blog-card__read glass-effect-interactive">
                  Read →
                </Link>
              </article>
            </GlassEffectContainer>
          </li>
        ))}
      </ul>
    </div>
  );
}
