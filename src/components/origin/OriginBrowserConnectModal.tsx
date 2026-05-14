import { ChevronDown, X } from "lucide-react";
import { useCallback, useState } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  ORIGIN_BROWSER_GUIDE,
  ORIGIN_CONNECT_ALLOW_EMPHASIS,
  ORIGIN_CONNECT_MODAL_LEDE,
  ORIGIN_CONNECT_MODAL_TITLE,
  ORIGIN_CONNECT_THIS_BROWSER,
  ORIGIN_CONNECT_UNIFIED_STEPS,
  type OriginBrowserDetailStep,
  type OriginBrowserGuideEntry,
} from "../../lib/originConnectGuide";

type OriginBrowserConnectModalProps = {
  open: boolean;
  onClose: () => void;
  onRequestMic?: () => void;
};

function StepList({ steps }: { steps: OriginBrowserDetailStep[] }) {
  return (
    <ol className="origin-connect-steps">
      {steps.map((step) => (
        <li key={`${step.label}-${step.text.slice(0, 24)}`} className="origin-connect-steps__item">
          <span className="origin-connect-steps__label">{step.label}</span>
          <span className="origin-connect-steps__text">{step.text}</span>
        </li>
      ))}
    </ol>
  );
}

function BrowserDetailPanel({ browser }: { browser: OriginBrowserGuideEntry }) {
  return (
    <div className="origin-connect-card__detail">
      <p className="origin-connect-card__summary">{browser.summary}</p>
      <StepList steps={ORIGIN_CONNECT_UNIFIED_STEPS} />
      <p className="origin-connect-card__allow-emphasis">{ORIGIN_CONNECT_ALLOW_EMPHASIS}</p>
      <a href={browser.downloadUrl} className="origin-connect-card__link btn-glass glass-effect-interactive">
        {browser.downloadLabel}
      </a>
    </div>
  );
}

export default function OriginBrowserConnectModal({
  open,
  onClose,
  onRequestMic,
}: OriginBrowserConnectModalProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleStayOnOrigin = useCallback(() => {
    onRequestMic?.();
    onClose();
  }, [onClose, onRequestMic]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="origin-connect-backdrop"
        aria-label="Close browser connect guide"
        onClick={onClose}
      />
      <GlassEffectContainer
        className="origin-connect-modal glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
        role="dialog"
        aria-modal="true"
        aria-labelledby="origin-connect-title"
      >
        <div className="origin-connect-modal__head">
          <p className="origin-connect-modal__kicker">Cockpit at night · Bay 30</p>
          <h2 id="origin-connect-title" className="origin-connect-modal__title">
            {ORIGIN_CONNECT_MODAL_TITLE}
          </h2>
          <p className="origin-connect-modal__lede">{ORIGIN_CONNECT_MODAL_LEDE}</p>
          <button
            type="button"
            className="origin-connect-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="origin-connect-modal__grid">
          {ORIGIN_BROWSER_GUIDE.map((browser) => {
            const expanded = expandedId === browser.id;

            return (
              <article
                key={browser.id}
                className={[
                  "origin-connect-card",
                  expanded ? "origin-connect-card--expanded" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <button
                  type="button"
                  className="origin-connect-card__toggle"
                  aria-expanded={expanded}
                  onClick={() => toggleExpanded(browser.id)}
                >
                  <div className="origin-connect-card__brand">
                    <span
                      className="origin-connect-card__icon"
                      style={{ ["--browser-hue" as string]: browser.brandHue }}
                      aria-hidden
                    >
                      {browser.iconLetter}
                    </span>
                    <div className="origin-connect-card__titles">
                      <h3 className="origin-connect-card__name">{browser.name}</h3>
                      <p className="origin-connect-card__step">{browser.summary}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`origin-connect-card__chevron${expanded ? " origin-connect-card__chevron--open" : ""}`}
                    size={18}
                    aria-hidden
                  />
                </button>

                {expanded ? <BrowserDetailPanel browser={browser} /> : null}
              </article>
            );
          })}
        </div>

        <div className="origin-connect-modal__footer">
          <button
            type="button"
            className="origin-connect-modal__primary btn-glass-prominent glass-effect-interactive"
            onClick={handleStayOnOrigin}
          >
            {ORIGIN_CONNECT_THIS_BROWSER}
          </button>
          <p className="origin-connect-modal__mono">Origin / Browser connect / COMMAND-30</p>
        </div>
      </GlassEffectContainer>
    </>
  );
}
