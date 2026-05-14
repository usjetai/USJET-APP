import { useEffect, useMemo } from "react";
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
      <iframe
        className="cockpit-shell__frame"
        title="USJET integrated partner module"
        src={src}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <Link to={returnTo} className="cockpit-ghost-btn" aria-label="Return to USJET Hangar">
        USJET
      </Link>
    </div>
  );
}
