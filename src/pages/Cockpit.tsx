import { useEffect, useLayoutEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fleetBayAccentStyle, slotFromBayId } from "../data/fleetBayAccents";
import { verifyFleetCallName } from "../data/fleetManifest";
import UsjetReturnButton from "../components/layout/UsjetReturnButton";
import { markFleetBayTrusted, sanitizeCockpitSrc } from "../lib/fleetLaunchUrl";
import { logFleetLaunchHandoff } from "../lib/fleetUsageHistory";

const ALLOWED_RETURN = new Set(["/hangar", "/intel", "/origin", "/"]);

const RETURN_ARIA: Record<string, string> = {
  "/": "Return to USJET Fleet",
  "/hangar": "Return to USJET Hangar",
  "/intel": "Return to USJET Intel",
  "/origin": "Return to USJET Origin",
};

/** Minimal partner shell — partner iframe + floating USJET return only. */
export default function Cockpit() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const src = useMemo(() => sanitizeCockpitSrc(params.get("src")), [params]);
  const returnTo = useMemo(() => {
    const raw = params.get("return") ?? "/";
    return ALLOWED_RETURN.has(raw) ? raw : "/";
  }, [params]);
  const bay = params.get("bay");
  const partnerLabel = params.get("label");
  const callName = params.get("callName")?.trim() ?? "";
  const baySlot = useMemo(() => slotFromBayId(bay), [bay]);
  const bayAccentStyle = useMemo(
    () => (baySlot !== null ? fleetBayAccentStyle(baySlot) : undefined),
    [baySlot],
  );

  useEffect(() => {
    if (!src) {
      navigate("/", { replace: true });
      return;
    }
    if (callName && !verifyFleetCallName(callName)) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const host = new URL(src).hostname.replace(/^www\./, "");
      document.title = `USJET Cockpit · ${host}`;
    } catch {
      document.title = "USJET Cockpit";
    }
  }, [callName, navigate, src]);

  useLayoutEffect(() => {
    if (!src) {
      return;
    }
    if (bay) {
      markFleetBayTrusted(bay);
    }
    logFleetLaunchHandoff(partnerLabel, bay);
  }, [bay, partnerLabel, src]);

  if (!src) {
    return null;
  }

  const displayName = partnerLabel ?? "partner module";

  return (
    <div className="cockpit-shell" style={bayAccentStyle}>
      <div className="cockpit-shell__frame-wrap">
        <iframe
          className="cockpit-shell__frame"
          title={`USJET integrated partner module · ${displayName}`}
          src={src}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <UsjetReturnButton to={returnTo} ariaLabel={RETURN_ARIA[returnTo] ?? "Return to USJET"} />
    </div>
  );
}
