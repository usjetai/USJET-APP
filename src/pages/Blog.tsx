import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronDown, Newspaper } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import AircraftIcon from "../components/icons/AircraftIcons";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import { FLEET_UNIT_COUNT } from "../types/fleet";
import {
  BLOG_BRIEF_POSTS,
  BLOG_FEATURE_POST,
  type BlogBodyBlock,
  type BlogBriefPost,
} from "../data/blogPosts";

function ArticleBlocks({ blocks }: { blocks: readonly BlogBodyBlock[] }) {
  return (
    <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
      {blocks.map((block, i) => {
        if (block.kind === "h2") {
          return (
            <h3
              key={`${block.kind}-${i}`}
              className="font-aviation text-lg font-black uppercase italic tracking-tight text-cyan-100/95"
            >
              {block.text}
            </h3>
          );
        }
        if (block.kind === "h3") {
          return (
            <h4
              key={`${block.kind}-${i}`}
              className="text-xs font-black uppercase tracking-[0.28em] text-white/55"
            >
              {block.text}
            </h4>
          );
        }
        return (
          <p key={`${block.kind}-${i}`} className="text-sm font-medium leading-relaxed text-white/76">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function BriefingCard({ post }: { post: BlogBriefPost }) {
  const [open, setOpen] = useState(false);
  const panelId = `blog-brief-${post.slug}`;

  return (
    <GlassEffectContainer className="glass-effect glass-effect--rounded-rect liquid-glass-background flex h-full flex-col p-5 sm:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">
        {post.kicker} · {post.dateLabel}
      </p>
      <h3 className="mt-2 font-aviation text-xl font-black uppercase italic tracking-tight text-white">
        {post.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/72">{post.excerpt}</p>
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="btn-glass glass-effect glass-effect--capsule glass-effect-interactive glass-tint-cyan mt-5 inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-50"
      >
        {open ? "Close briefing" : "Read briefing"}
        <ChevronDown
          size={16}
          aria-hidden
          className={["transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="whitespace-pre-line pt-4 text-sm leading-relaxed text-white/68">{post.expandedNote}</p>
        </div>
      </div>
    </GlassEffectContainer>
  );
}

const Blog = () => {
  const [featureOpen, setFeatureOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fleet-page fleet-page--runway relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fleet-page__runway-jet"
        aria-hidden
      >
        <AircraftIcon aircraftType="sr71" accentId="blog-runway-lead" className="fleet-page__runway-jet-icon" />
      </motion.div>

      <div className="page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-[92rem] px-4 pb-28 pt-2 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-cyan-400/15 pb-12 text-center md:mb-14 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-center"
          >
            <UsjetWordmark size="hero" />
          </motion.div>

          <GlassEffectContainer className="glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan mx-auto max-w-3xl px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-black uppercase tracking-[0.32em] text-cyan-200/85">
              <BookOpen size={18} className="shrink-0 text-cyan-300" aria-hidden />
              <span>USJET Dispatch</span>
              <span className="rounded-full border border-cyan-400/35 bg-cyan-500/[0.08] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-cyan-100/90 sm:text-[9px]">
                AI field notes
              </span>
            </div>
            <h1 className="font-aviation text-4xl font-black uppercase italic leading-tight tracking-tighter text-white sm:text-5xl lg:text-6xl">
              The <span className="text-cyan-400">Blog</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/72">
              Latest-angle dispatches on sovereign AI operations—how rostered fleets, hangar discipline, and integrated
              navigation change the way labor-grade crews adopt models. Deeper primers live on{" "}
              <Link
                to="/ai-101"
                className="text-cyan-200 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-100"
              >
                AI 101
              </Link>
              ; the strip itself lives on{" "}
              <Link to="/" className="text-cyan-200 underline decoration-cyan-500/40 underline-offset-4 hover:text-cyan-100">
                Fleet
              </Link>
              .
            </p>
          </GlassEffectContainer>
        </header>

        <section aria-labelledby="blog-grid-heading">
          <h2 id="blog-grid-heading" className="sr-only">
            Dispatch posts
          </h2>

          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <GlassEffectContainer className="glass-effect glass-effect--rounded-rect liquid-glass-background h-full p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-amber-400/35 bg-amber-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.28em] text-amber-100/90">
                    Featured
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">
                    {BLOG_FEATURE_POST.kicker} · {BLOG_FEATURE_POST.dateLabel}
                  </p>
                </div>
                <h2 className="mt-3 font-aviation text-2xl font-black uppercase italic tracking-tight text-white sm:text-3xl">
                  {BLOG_FEATURE_POST.title}
                </h2>
                <p className="mt-4 text-sm font-medium leading-relaxed text-white/75">{BLOG_FEATURE_POST.excerpt}</p>
                <button
                  type="button"
                  aria-expanded={featureOpen}
                  aria-controls="blog-feature-article"
                  onClick={() => setFeatureOpen((v) => !v)}
                  className="btn-glass glass-effect glass-effect--capsule glass-effect-interactive glass-tint-cyan mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-50"
                >
                  {featureOpen ? "Hide full dispatch" : "Read full dispatch"}
                  <ChevronDown
                    size={16}
                    aria-hidden
                    className={featureOpen ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200"}
                  />
                </button>
                <div
                  id="blog-feature-article"
                  className={[
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    featureOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  ].join(" ")}
                >
                  <div className="min-h-0 overflow-hidden">
                    <ArticleBlocks blocks={BLOG_FEATURE_POST.blocks} />
                    <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-cyan-200/55">
                      {FLEET_UNIT_COUNT} rostered units · same-window cockpit handoff · Stripe-cleared member deck
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-white/65">
                      Cross-deck navigation stays inside the ship:{" "}
                      <Link to="/founder" className="text-cyan-200 underline decoration-cyan-500/35 underline-offset-4 hover:text-cyan-100">
                        Founder
                      </Link>
                      ,{" "}
                      <Link to="/" className="text-cyan-200 underline decoration-cyan-500/35 underline-offset-4 hover:text-cyan-100">
                        Fleet
                      </Link>
                      ,{" "}
                      <Link to="/ai-101" className="text-cyan-200 underline decoration-cyan-500/35 underline-offset-4 hover:text-cyan-100">
                        AI 101
                      </Link>
                      , and{" "}
                      <Link to="/sos" className="text-cyan-200 underline decoration-cyan-500/35 underline-offset-4 hover:text-cyan-100">
                        SOS
                      </Link>{" "}
                      for site operating support.
                    </p>
                  </div>
                </div>
              </GlassEffectContainer>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 font-black uppercase tracking-[0.28em] text-cyan-200/70">
                <Newspaper size={16} aria-hidden className="shrink-0 text-cyan-300" />
                <span className="text-[10px]">Industry pulse</span>
              </div>
              {BLOG_BRIEF_POSTS.map((post) => (
                <BriefingCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Blog;
