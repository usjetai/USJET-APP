import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Shield } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  WEFUNDER_COVENANT_BUTTON_LABEL,
  WEFUNDER_COVENANT_FOOTER_LABEL,
  WEFUNDER_FLEET_TICKER,
  WEFUNDER_RELAUNCH_MODAL_BODY,
  WEFUNDER_RELAUNCH_MODAL_KICKER,
  WEFUNDER_RELAUNCH_MODAL_NOTE,
  WEFUNDER_RELAUNCH_MODAL_PROCEED,
  WEFUNDER_RELAUNCH_MODAL_STAY,
  WEFUNDER_RELAUNCH_MODAL_TITLE,
} from "../../data/wefunderBridge";
import { getWefunderReservationUrl } from "../../lib/usjetCampaigns";

type WefunderCovenantBridgeProps = {
  /** Footer chip vs full-width CTA */
  variant?: "footer" | "prominent";
  className?: string;
  /** Show fleet ticker above the trigger (blog blocks) */
  showTicker?: boolean;
};

export function WefunderFleetTicker({ className = "" }: { className?: string }) {
  return (
    <p className={`wefunder-fleet-ticker ${className}`.trim()} role="status">
      <span className="wefunder-fleet-ticker__ping" aria-hidden />
      <span className="wefunder-fleet-ticker__text">{WEFUNDER_FLEET_TICKER}</span>
    </p>
  );
}

function WefunderRelaunchModal({
  open,
  onClose,
  onProceed,
}: {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="wefunder-covenant-modal pdre-overlay" role="presentation">
      <button
        type="button"
        className="wefunder-covenant-modal__backdrop"
        aria-label="Close relaunch briefing"
        onClick={onClose}
      />
      <GlassEffectContainer
        className="wefunder-covenant-modal__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="wefunder-covenant-modal__icon" aria-hidden>
          <Shield size={22} strokeWidth={2} />
        </div>
        <p className="wefunder-covenant-modal__kicker">{WEFUNDER_RELAUNCH_MODAL_KICKER}</p>
        <h2 id={titleId} className="wefunder-covenant-modal__title">
          {WEFUNDER_RELAUNCH_MODAL_TITLE}
        </h2>
        <p className="wefunder-covenant-modal__body">{WEFUNDER_RELAUNCH_MODAL_BODY}</p>
        <p className="wefunder-covenant-modal__note">{WEFUNDER_RELAUNCH_MODAL_NOTE}</p>
        <div className="wefunder-covenant-modal__actions">
          <button
            type="button"
            className="wefunder-covenant-modal__stay btn-glass glass-effect-interactive"
            onClick={onClose}
          >
            {WEFUNDER_RELAUNCH_MODAL_STAY}
          </button>
          <button
            type="button"
            className="wefunder-covenant-modal__proceed btn-glass-prominent glass-effect-interactive"
            onClick={onProceed}
          >
            {WEFUNDER_RELAUNCH_MODAL_PROCEED}
          </button>
        </div>
      </GlassEffectContainer>
    </div>,
    document.body,
  );
}

/** Relaunch briefing modal → opens live Wefunder campaign in a new tab. */
export default function WefunderCovenantBridge({
  variant = "prominent",
  className = "",
  showTicker = false,
}: WefunderCovenantBridgeProps) {
  const [open, setOpen] = useState(false);
  const reservationUrl = getWefunderReservationUrl();

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const proceed = useCallback(() => {
    window.open(reservationUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [reservationUrl]);

  const isFooter = variant === "footer";
  const label = isFooter ? WEFUNDER_COVENANT_FOOTER_LABEL : WEFUNDER_COVENANT_BUTTON_LABEL;

  return (
    <div className={`wefunder-covenant-bridge ${className}`.trim()}>
      {showTicker ? <WefunderFleetTicker className="wefunder-covenant-bridge__ticker" /> : null}
      <button
        type="button"
        className={
          isFooter
            ? "usjet-global-contact-bar__covenant btn-glass glass-effect-interactive glass-tint-gold"
            : "wefunder-covenant-bridge__cta btn-glass-prominent glass-effect-interactive"
        }
        title={WEFUNDER_COVENANT_BUTTON_LABEL}
        aria-label={WEFUNDER_COVENANT_BUTTON_LABEL}
        onClick={openModal}
      >
        {isFooter ? (
          <>
            <span className="usjet-global-contact-bar__covenant-reflection" aria-hidden />
            <span className="usjet-global-contact-bar__covenant-label">{label}</span>
          </>
        ) : (
          label
        )}
      </button>
      <WefunderRelaunchModal open={open} onClose={closeModal} onProceed={proceed} />
    </div>
  );
}
