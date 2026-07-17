import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import Ai101Quiz from "../components/ai101/Ai101Quiz";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { AI101_LESSON_INTRO, AI101_LESSON_SECTIONS } from "../data/ai101Lessons";

export default function Ai101() {
  const location = useLocation();
  const fromSos = useMemo(() => new URLSearchParams(location.search).get("from") === "sos", [location.search]);

  return (
    <div className="ai101-page page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
      <header className="ai101-page__hero mb-12 border-b border-cyan-400/15 pb-10 text-center md:mb-14">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-black uppercase tracking-[0.3em] text-cyan-300/90">
          <BookOpen size={18} className="shrink-0" aria-hidden />
          <span>One-on-one lesson</span>
        </div>
        <h1 className="font-aviation text-4xl font-black uppercase italic leading-[0.95] tracking-tighter text-white sm:text-5xl lg:text-6xl">
          AI <span className="text-cyan-400">101</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/70">
          {AI101_LESSON_INTRO.lede}
        </p>
        {fromSos ? (
          <p className="mx-auto mt-4 max-w-2xl text-xs font-medium leading-relaxed text-white/45">
            You came from Help — this is the full curriculum. Quiz at the bottom earns your membership badge.
          </p>
        ) : null}
      </header>

      <GlassEffectContainer className="ai101-page__toc glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan mb-10 px-5 py-5 sm:px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200/70">Lesson map</p>
        <nav className="mt-3 flex flex-wrap gap-2" aria-label="AI 101 lesson sections">
          {AI101_LESSON_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#ai101-${section.id}`}
              className="btn-glass glass-effect-interactive rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white"
            >
              {section.title.split("—")[0]?.trim() ?? section.title}
            </a>
          ))}
          <a
            href="#ai101-quiz"
            className="btn-glass glass-effect-interactive rounded-full border border-amber-400/40 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-100/90 hover:text-amber-50"
          >
            Quiz · badge
          </a>
        </nav>
      </GlassEffectContainer>

      <div className="ai101-page__lessons flex flex-col gap-6">
        {AI101_LESSON_SECTIONS.map((section) => (
          <article
            key={section.id}
            id={`ai101-${section.id}`}
            className="ai101-lesson scroll-mt-28 sm:scroll-mt-32"
          >
            <GlassEffectContainer className="ai101-lesson__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
              <p className="ai101-lesson__kicker">{section.kicker}</p>
              <h2 className="ai101-lesson__title">{section.title}</h2>
              {section.route ? (
                <p className="ai101-lesson__route">
                  Open:{" "}
                  <Link to={section.route} className="ai101-lesson__link">
                    {section.route === "/" ? "Hangar /" : section.route}
                  </Link>
                </p>
              ) : null}
              <div className="ai101-lesson__body">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className="ai101-lesson__bullets">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </GlassEffectContainer>
          </article>
        ))}
      </div>

      <div className="mt-12">
        <Ai101Quiz />
      </div>

      <footer className="mt-14 border-t border-white/10 pt-8 text-center text-xs text-white/40">
        <Link to="/sos" className="text-cyan-200/80 underline-offset-4 hover:underline">
          Help
        </Link>
        {" · "}
        <Link to="/" className="text-cyan-200/80 underline-offset-4 hover:underline">
          Hangar
        </Link>
        {" · "}
        <Link to="/member" className="text-cyan-200/80 underline-offset-4 hover:underline">
          Member Portal
        </Link>
      </footer>
    </div>
  );
}
