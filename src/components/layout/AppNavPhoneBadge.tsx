import { Phone } from "lucide-react";
import { USJET_BUSINESS_PHONE_DISPLAY, USJET_BUSINESS_PHONE_TEL } from "../../lib/usjetContact";

/** Header phone chip — dials the USJET business line. */
export default function AppNavPhoneBadge() {
  return (
    <a
      href={USJET_BUSINESS_PHONE_TEL}
      className="app-nav-phone btn-glass glass-effect-interactive shrink-0"
      title={`Call USJET ${USJET_BUSINESS_PHONE_DISPLAY}`}
      aria-label={`Call USJET ${USJET_BUSINESS_PHONE_DISPLAY}`}
    >
      <span className="app-nav-phone__halo" aria-hidden />
      <span className="app-nav-phone__shine" aria-hidden />
      <span className="app-nav-phone__icon" aria-hidden>
        <Phone size={11} strokeWidth={2.4} />
      </span>
      <span className="app-nav-phone__label app-nav-phone__label--full">{USJET_BUSINESS_PHONE_DISPLAY}</span>
      <span className="app-nav-phone__label app-nav-phone__label--short">800</span>
    </a>
  );
}
