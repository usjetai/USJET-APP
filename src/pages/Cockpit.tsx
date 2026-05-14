import { useCallback, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CockpitReturnBar from "../components/layout/CockpitReturnBar";
import { sanitizeCockpitSrc } from "../lib/fleetLaunchUrl";

const ALLOWED_RETURN = new Set(["/hangar", "/intel", "/origin", "/"]);

export default function Cockpit() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const src = useMemo(() => sanitizeCockpitSrc(params.get("src")), [params]);
  const returnTo = useMemo(() => {
    const raw = params.get("return") ?? "/hangar";
    return ALLOWED_RETURN.has(raw) ? raw : "/hangar";
  }, [params]);
  const bay = params.get("bay");
  const partnerLabel = params.get("label");

  const launchPartnerDirect = useCallback(() => {
    if (src) {
      window.location.assign(src);
    }
  }, [src]);

  useEffect(() => {
    if (!src) {
      navigate("/hangar", { replace: true });
      return;
    }

    try {
      const host = new URL(src).hostname.replace(/^www\./, "");
      document.title = `USJET Cockpit · ${host}`;
    } catch {
      document.title = "USJET Cockpit";
    }
  }, [navigate, src]);

  if (!src) {
    return null;
  }

  return (
    <div className="cockpit-shell">
      <CockpitReturnBar returnTo={returnTo} bay={bay} partnerLabel={partnerLabel} />
      <div className="cockpit-shell__frame-wrap">
        <iframe
          className="cockpit-shell__frame"
          title="USJET integrated partner module"
          src={src}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="hangar-embed-shield cockpit-embed-shield" role="region" aria-label="Partner launch fallback">
          <div className="hangar-embed-shield__row">
            <p className="hangar-embed-shield__text">
              {partnerLabel ?? "This partner"} blocks in-cockpit embedding on most browsers. Launch the live module
              in this window — use back or USJET nav to return to the fleet.
            </p>
          </div>
          <button type="button" className="hangar-embed-shield__cta" onClick={launchPartnerDirect}>
            Launch {partnerLabel ?? "partner module"}
          </button>
        </div>
      </div>
      <Link to={returnTo} className="cockpit-ghost-btn" aria-label="Return to USJET Hangar">
        USJET
      </Link>
    </div>
  );
}
