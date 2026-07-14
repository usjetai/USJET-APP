import { Link } from "react-router-dom";
import { useMemberAuth } from "../../context/MemberAuthContext";

type CockpitReturnBarProps = {
  returnTo?: string;
  bay?: string | null;
  partnerLabel?: string | null;
};

const RETURN_LABELS: Record<string, string> = {
  "/": "RETURN TO HANGAR",
  "/hangar": "RETURN TO HANGAR",
  "/fleet": "RETURN TO FLEET",
  "/intel": "RETURN TO INTEL",
  "/origin": "RETURN TO ORIGIN",
};

export default function CockpitReturnBar({
  returnTo = "/",
  bay = null,
  partnerLabel = null,
}: CockpitReturnBarProps) {
  const { session } = useMemberAuth();
  const primeActive = session?.active && session.tier === "USJET-PRIME-ACTIVE";
  const returnLabel = RETURN_LABELS[returnTo] ?? "RETURN TO HANGAR";

  return (
    <header className="cockpit-return-bar" role="banner">
      <div className="cockpit-return-bar__glow" aria-hidden />
      <div className="cockpit-return-bar__inner">
        <Link to={returnTo} className="cockpit-return-bar__brand" aria-label="Return to USJET Hangar">
          <span className="cockpit-return-bar__pulse" aria-hidden />
          <span className="cockpit-return-bar__text">
            USJET.AI
            {primeActive ? (
              <>
                <span className="cockpit-return-bar__sep" aria-hidden>
                  ·
                </span>
                <span className="cockpit-return-bar__prime">{session?.tier ?? "USJET-PRIME-ACTIVE"}</span>
              </>
            ) : null}
            <span className="cockpit-return-bar__sep" aria-hidden>
              ·
            </span>
            <span className="cockpit-return-bar__return">{returnLabel}</span>
          </span>
        </Link>

        {partnerLabel ? (
          <p className="cockpit-return-bar__meta">
            {partnerLabel ? <span>{partnerLabel}</span> : null}
          </p>
        ) : null}
      </div>
    </header>
  );
}
