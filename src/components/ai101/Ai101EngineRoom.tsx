import { Link } from "react-router-dom";
import { Braces, Code2, Cpu, Shield, Terminal, Zap } from "lucide-react";
import CodeKitCheckout from "../growth/CodeKitCheckout";
import {
  CODE_KIT_ENGINE_ROOM_EYEBROW,
  CODE_KIT_ENGINE_ROOM_TITLE,
  CODE_KIT_GUARANTEE,
  CODE_KIT_NAV_BUTTON,
  CODE_KIT_PACKAGES,
  CODE_KIT_PRICE_DISPLAY,
  CODE_KIT_ROUTE,
  CODE_KIT_SUBTITLE,
  CODE_KIT_TAGLINE,
} from "../../data/codeKit499";

const PACKAGE_ICONS = [Braces, Cpu, Shield] as const;

type Ai101EngineRoomProps = {
  showHeader?: boolean;
  showBriefingLink?: boolean;
};

export default function Ai101EngineRoom({ showHeader = true, showBriefingLink = true }: Ai101EngineRoomProps) {
  return (
    <section
      id="ai101-engine-room"
      className="ai101-engine-room scroll-mt-28 sm:scroll-mt-32"
      aria-labelledby={showHeader ? "ai101-engine-room-heading" : undefined}
    >
      <div className="ai101-engine-room__matrix" aria-hidden />
      <div className="ai101-engine-room__scanlines" aria-hidden />

      {showHeader ? (
        <header className="ai101-engine-room__header">
          <p className="ai101-engine-room__eyebrow">
            <Terminal size={14} aria-hidden />
            {CODE_KIT_ENGINE_ROOM_EYEBROW}
          </p>
          <h2 id="ai101-engine-room-heading" className="ai101-engine-room__title">
            {CODE_KIT_ENGINE_ROOM_TITLE}
          </h2>
          <p className="ai101-engine-room__tag">{CODE_KIT_TAGLINE}</p>
          <p className="ai101-engine-room__sub">{CODE_KIT_SUBTITLE}</p>
        </header>
      ) : null}

      <div className="ai101-engine-room__grid">
        <div className="ai101-engine-room__sales">
          <p className="ai101-engine-room__price">{CODE_KIT_PRICE_DISPLAY}</p>
          <p className="ai101-engine-room__builder-lede">
            For builders who want to know how Liquid Glass and the thirty-agent fleet work under the hood — not just
            use AI, but ship it.
          </p>

          <ul className="ai101-engine-room__packages">
            {CODE_KIT_PACKAGES.map((pkg, index) => {
              const Icon = PACKAGE_ICONS[index] ?? Code2;
              return (
                <li key={pkg.id} className="ai101-engine-room__package">
                  <span className="ai101-engine-room__package-icon" aria-hidden>
                    <Icon size={16} strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="ai101-engine-room__package-title">{pkg.title}</p>
                    <p className="ai101-engine-room__package-detail">{pkg.detail}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <blockquote className="ai101-engine-room__guarantee">
            <Zap size={14} className="ai101-engine-room__guarantee-icon" aria-hidden />
            <span>{CODE_KIT_GUARANTEE}</span>
          </blockquote>

          {showBriefingLink ? (
            <Link to={CODE_KIT_ROUTE} className="ai101-engine-room__full-page glass-effect-interactive">
              Open full engine room briefing →
            </Link>
          ) : null}
        </div>

        <div className="ai101-engine-room__checkout-wrap">
          <CodeKitCheckout />
        </div>
      </div>
    </section>
  );
}

/** Glow CTA for AI 101 navigation — links to engine room on this page. */
export function Ai101CodeAccessButton({ className = "" }: { className?: string }) {
  return (
    <Link
      to={{ pathname: "/ai-101", hash: "#ai101-engine-room" }}
      className={["ai101-code-access-btn glass-effect-interactive", className].filter(Boolean).join(" ")}
    >
      <Code2 size={16} aria-hidden />
      <span>{CODE_KIT_NAV_BUTTON}</span>
    </Link>
  );
}
