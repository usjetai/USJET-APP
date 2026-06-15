import { Mail } from "lucide-react";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../../lib/usjetContact";

type UsjetOpsMailEnvelopeProps = {
  className?: string;
};

/** Site-wide mailbox — opens mail to ops@usjet.ai (all USJET contact routes here). */
export default function UsjetOpsMailEnvelope({ className = "" }: UsjetOpsMailEnvelopeProps) {
  return (
    <a
      href={mailtoUsjetOps()}
      className={["usjet-ops-mail-envelope usjet-app-envelope btn-glass glass-effect-interactive", className]
        .filter(Boolean)
        .join(" ")}
      aria-label={`Email USJET — ${USJET_OPS_EMAIL}`}
      title={`Email ${USJET_OPS_EMAIL}`}
    >
      <span className="usjet-app-envelope__glow" aria-hidden />
      <span className="usjet-app-envelope__shine" aria-hidden />
      <span className="usjet-app-envelope__flash" aria-hidden />
      <Mail className="usjet-app-envelope__icon" size={16} strokeWidth={2.3} aria-hidden />
    </a>
  );
}
