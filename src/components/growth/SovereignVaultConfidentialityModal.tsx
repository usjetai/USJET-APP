import { useEffect, useId, useRef } from "react";
import { Shield } from "lucide-react";
import { SOVEREIGN_CONFIDENTIALITY_CLAUSE } from "../../data/sovereignBlueprint100k";

type SovereignVaultConfidentialityModalProps = {
  open: boolean;
  agreed: boolean;
  onAgreedChange: (agreed: boolean) => void;
  onCancel: () => void;
  onProceed: () => void;
  checkoutReady: boolean;
  routing: boolean;
};

export default function SovereignVaultConfidentialityModal({
  open,
  agreed,
  onAgreedChange,
  onCancel,
  onProceed,
  checkoutReady,
  routing,
}: SovereignVaultConfidentialityModalProps) {
  const titleId = useId();
  const proceedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    proceedRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="vault-100k-confidentiality pdre-overlay" role="presentation">
      <div
        className="vault-100k-confidentiality__panel pdre-overlay__panel liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-gold"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="vault-100k-confidentiality__icon" aria-hidden>
          <Shield size={22} />
        </div>
        <h2 id={titleId} className="vault-100k-confidentiality__title">
          Confidentiality Agreement
        </h2>
        <p className="vault-100k-confidentiality__intro">
          Before settlement routing, you must acknowledge restricted-access terms for Volume I of the Sovereign Fleet
          Protocol.
        </p>
        <ul className="vault-100k-confidentiality__clauses">
          {SOVEREIGN_CONFIDENTIALITY_CLAUSE.map((clause) => (
            <li key={clause.slice(0, 48)}>{clause}</li>
          ))}
        </ul>
        <label className="vault-100k-confidentiality__check">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => onAgreedChange(event.target.checked)}
          />
          <span>I agree to the confidentiality and non-disclosure terms above.</span>
        </label>
        <div className="vault-100k-confidentiality__actions">
          <button type="button" className="vault-100k-confidentiality__cancel btn-glass glass-effect-interactive" onClick={onCancel}>
            Decline
          </button>
          <button
            ref={proceedRef}
            type="button"
            className="vault-100k-confidentiality__proceed btn-glass-prominent glass-effect-interactive"
            disabled={!agreed || !checkoutReady || routing}
            onClick={onProceed}
          >
            {routing ? "Routing to Stripe…" : "Proceed to secure settlement"}
          </button>
        </div>
        {!checkoutReady ? (
          <p className="vault-100k-confidentiality__pending">
            Stripe checkout link activating — use direct transfer inquiry until live.
          </p>
        ) : null}
      </div>
    </div>
  );
}
