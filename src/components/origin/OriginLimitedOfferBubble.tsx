import { createPortal } from "react-dom";
import { Clock, Sparkles } from "lucide-react";
import {
  ORIGIN_LIMITED_AFTER_TIER_LABEL,
  ORIGIN_LIMITED_FREE_UNTIL,
  ORIGIN_LIMITED_OFFER_BODY,
  ORIGIN_LIMITED_OFFER_KEEP,
  ORIGIN_LIMITED_OFFER_LEDE,
  ORIGIN_LIMITED_OFFER_TITLE,
} from "../../data/originLimitedOffer";

type OriginLimitedOfferBubbleProps = {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
};

export default function OriginLimitedOfferBubble({ open, onClose, onContinue }: OriginLimitedOfferBubbleProps) {
  if (!open) {
    return null;
  }

  return createPortal(
    <div className="origin-limited-offer" role="dialog" aria-modal="true" aria-labelledby="origin-limited-offer-title">
      <button type="button" className="origin-limited-offer__backdrop" aria-label="Close" onClick={onClose} />
      <div className="origin-limited-offer__bubble">
        <p className="origin-limited-offer__kicker">
          <Sparkles size={12} aria-hidden />
          Limited time
        </p>
        <h2 id="origin-limited-offer-title" className="origin-limited-offer__title">
          {ORIGIN_LIMITED_OFFER_TITLE}
        </h2>
        <p className="origin-limited-offer__lede">{ORIGIN_LIMITED_OFFER_LEDE}</p>
        <p className="origin-limited-offer__body">{ORIGIN_LIMITED_OFFER_BODY}</p>
        <p className="origin-limited-offer__deadline">
          <Clock size={12} aria-hidden />
          Free until <strong>{ORIGIN_LIMITED_FREE_UNTIL}</strong> · then {ORIGIN_LIMITED_AFTER_TIER_LABEL} only
        </p>
        <p className="origin-limited-offer__note">{ORIGIN_LIMITED_OFFER_KEEP}</p>
        <div className="origin-limited-offer__actions">
          <button type="button" className="origin-limited-offer__dismiss btn-glass glass-effect-interactive" onClick={onClose}>
            Not now
          </button>
          <button
            type="button"
            className="origin-limited-offer__continue btn-glass-prominent glass-effect-interactive glass-tint-cyan"
            onClick={onContinue}
          >
            Enter Origin
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
