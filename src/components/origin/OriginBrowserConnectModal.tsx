import { ChevronDown, Mic, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  ORIGIN_BROWSER_GUIDE,
  ORIGIN_CONNECT_MODAL_LEDE,
  ORIGIN_CONNECT_MODAL_TITLE,
  ORIGIN_CONNECT_THIS_BROWSER,
  type OriginBrowserDetailStep,
  type OriginBrowserGuideEntry,
} from "../../lib/originConnectGuide";

type OriginBrowserConnectModalProps = {
  open: boolean;
  onClose: () => void;
  onRequestMic?: () => void;
};

function detectSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

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

function BrowserDetailPanel({
  browser,
  onRequestMic,
}: {
  browser: OriginBrowserGuideEntry;
  onRequestMic?: () => void;
}) {
  const isSafari = browser.id === "safari";

  return (
    <div className="origin-connect-card__detail">
      <p className="origin-connect-card__summary">{browser.summary}</p>

      {browser.steps.length > 0 ? <StepList steps={browser.steps} /> : null}

      {isSafari && browser.macSteps ? (
        <div className="origin-connect-safari-block">
          <p className="origin-connect-safari-block__heading">On Mac (Safari)</p>
          <StepList steps={browser.macSteps} />
        </div>
      ) : null}

      {isSafari && browser.iosSteps ? (
        <div className="origin-connect-safari-block">
          <p className="origin-connect-safari-block__heading">On iPhone / iPad (Safari)</p>
          <StepList steps={browser.iosSteps} />
        </div>
      ) : null}

      {isSafari ? (
        <div className="origin-connect-safari-block origin-connect-safari-block--actions">
          <button
            type="button"
            className="origin-connect-card__mic-btn btn-glass-prominent glass-effect-interactive"
            onClick={onRequestMic}
          >
            <Mic size={14} aria-hidden />
            Enable microphone on this page
          </button>
          <p className="origin-connect-card__mic-note">
            This is the real Safari fix — your tap unlocks the mic on Origin. We cannot auto-enable it for you.
          </p>

          {browser.supportUrl ? (
            <a href={browser.supportUrl} className="origin-connect-card__link btn-glass glass-effect-interactive">
              {browser.supportLabel}
            </a>
          ) : null}

          {browser.macPrivacyUrl ? (
            <>
              <a
                href={browser.macPrivacyUrl}
                className="origin-connect-card__link origin-connect-card__link--privacy btn-glass glass-effect-interactive"
              >
                {browser.macPrivacyLabel}
              </a>
              {browser.macPrivacyFallback ? (
                <p className="origin-connect-card__privacy-fallback">{browser.macPrivacyFallback}</p>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}

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

  useEffect(() => {
    if (open) {
      setExpandedId(detectSafari() ? "safari" : null);
    }
  }, [open]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleRequestMic = useCallback(() => {
    onRequestMic?.();
    onClose();
  }, [onClose, onRequestMic]);

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
            const isSafari = browser.id === "safari";

            return (
              <article
                key={browser.id}
                className={[
                  "origin-connect-card",
                  expanded ? "origin-connect-card--expanded" : "",
                  isSafari ? "origin-connect-card--safari" : "",
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

                {expanded ? (
                  <BrowserDetailPanel browser={browser} onRequestMic={handleRequestMic} />
                ) : null}
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
