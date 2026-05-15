import { useEffect } from "react";
import Ai101EngineRoom from "../components/ai101/Ai101EngineRoom";
import RevenueValueLadder from "../components/growth/RevenueValueLadder";
import {
  CODE_KIT_LEDE,
  CODE_KIT_PAGE_SHORT,
  CODE_KIT_PRICE_DISPLAY,
  CODE_KIT_TAGLINE,
  CODE_KIT_TITLE,
} from "../data/codeKit499";

export default function CodeKit() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Code · USJET Engine Kit · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET Developer’s Engine Kit — $499 production codebase: Liquid Glass UI, 30-agent orchestration, Stripe and B2B templates.",
    );
    document.documentElement.classList.add("code-kit-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("code-kit-page-root");
    };
  }, []);

  return (
    <div className="code-kit-page page-atmosphere page-nav-offset mx-auto max-w-5xl px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <div className="code-kit-page__matrix" aria-hidden />

      <header className="code-kit-page__hero">
        <p className="code-kit-page__badge" aria-label="Code kit page">
          <span className="code-kit-page__badge-icon" aria-hidden>
            {"</>"}
          </span>
          {CODE_KIT_PAGE_SHORT}
        </p>
        <p className="code-kit-page__eyebrow">{CODE_KIT_TAGLINE}</p>
        <h1 className="code-kit-page__title">{CODE_KIT_TITLE}</h1>
        <p className="code-kit-page__price">{CODE_KIT_PRICE_DISPLAY}</p>
        <p className="code-kit-page__lede">{CODE_KIT_LEDE}</p>
      </header>

      <RevenueValueLadder active="code" />

      <Ai101EngineRoom showHeader={false} showBriefingLink={false} />
    </div>
  );
}
