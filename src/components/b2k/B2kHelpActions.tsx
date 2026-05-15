import { LifeBuoy, Mail } from "lucide-react";
import { B2K_ENVELOPE_LABEL, B2K_HELP_CTA } from "../../data/b2k";
import { useOriginLimitedOffer } from "../../context/OriginLimitedOfferContext";
import { mailtoUsjetApp, USJET_APP_EMAIL } from "../../lib/usjetContact";

const B2K_MAIL_SUBJECT = "B2K Enterprise — waitlist & deployment inquiry";

export default function B2kHelpActions() {
  const { requestOriginNavigation } = useOriginLimitedOffer();

  return (
    <div className="b2k-help-actions">
      <button
        type="button"
        className="b2k-help-actions__help btn-glass glass-effect-interactive"
        onClick={() => requestOriginNavigation()}
      >
        <LifeBuoy size={18} aria-hidden />
        <span>{B2K_HELP_CTA}</span>
      </button>

      <a
        href={mailtoUsjetApp(B2K_MAIL_SUBJECT)}
        className="b2k-help-actions__envelope glass-effect-interactive"
        aria-label={`Email ${USJET_APP_EMAIL} — opens your mail app`}
        title={`Email ${USJET_APP_EMAIL} (app.usjet.ai)`}
      >
        <span className="b2k-help-actions__envelope-glow" aria-hidden />
        <span className="b2k-help-actions__envelope-shine" aria-hidden />
        <span className="b2k-help-actions__envelope-flash" aria-hidden />
        <Mail className="b2k-help-actions__envelope-icon" size={22} strokeWidth={2.2} aria-hidden />
        <span className="b2k-help-actions__envelope-label">{B2K_ENVELOPE_LABEL}</span>
      </a>
    </div>
  );
}

/** Footer / compact — envelope only with dazzling effect. */
export function UsjetAppMailEnvelope({ className = "" }: { className?: string }) {
  return (
    <a
      href={mailtoUsjetApp()}
      className={["usjet-app-envelope btn-glass glass-effect-interactive", className].filter(Boolean).join(" ")}
      aria-label={`Email ${USJET_APP_EMAIL} — opens your mail app`}
      title={`Email app crew · ${USJET_APP_EMAIL}`}
    >
      <span className="usjet-app-envelope__glow" aria-hidden />
      <span className="usjet-app-envelope__shine" aria-hidden />
      <span className="usjet-app-envelope__flash" aria-hidden />
      <Mail className="usjet-app-envelope__icon" size={14} strokeWidth={2.4} aria-hidden />
    </a>
  );
}
