import { X } from "lucide-react";
import { Link } from "react-router-dom";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  ORIGIN_ABSOLUTE_URL,
  ORIGIN_BROWSER_GUIDE,
  ORIGIN_CONNECT_MODAL_LEDE,
  ORIGIN_CONNECT_MODAL_TITLE,
  ORIGIN_CONNECT_STEP,
  ORIGIN_CONNECT_THIS_BROWSER,
} from "../../lib/originConnectGuide";

type OriginBrowserConnectModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function OriginBrowserConnectModal({ open, onClose }: OriginBrowserConnectModalProps) {
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
          {ORIGIN_BROWSER_GUIDE.map((browser) => (
            <article key={browser.id} className="origin-connect-card">
              <div className="origin-connect-card__brand">
                <span
                  className="origin-connect-card__icon"
                  style={{ ["--browser-hue" as string]: browser.brandHue }}
                  aria-hidden
                >
                  {browser.iconLetter}
                </span>
                <div>
                  <h3 className="origin-connect-card__name">{browser.name}</h3>
                  <p className="origin-connect-card__step">{ORIGIN_CONNECT_STEP}</p>
                </div>
              </div>
              <div className="origin-connect-card__actions">
                <a href={browser.downloadUrl} className="origin-connect-card__link btn-glass glass-effect-interactive">
                  {browser.downloadLabel}
                </a>
                <a href={ORIGIN_ABSOLUTE_URL} className="origin-connect-card__link origin-connect-card__link--origin btn-glass glass-effect-interactive">
                  {browser.originLabel}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="origin-connect-modal__footer">
          <Link
            to="/origin"
            className="origin-connect-modal__primary btn-glass-prominent glass-effect-interactive"
            onClick={onClose}
          >
            {ORIGIN_CONNECT_THIS_BROWSER}
          </Link>
          <p className="origin-connect-modal__mono">Origin / Browser connect / COMMAND-30</p>
        </div>
      </GlassEffectContainer>
    </>
  );
}
