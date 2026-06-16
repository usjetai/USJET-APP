import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fleetBayAccentStyle, slotFromBayId } from "../data/fleetBayAccents";
import { verifyFleetCallName } from "../data/fleetManifest";
import { markFleetBayTrusted, sanitizeCockpitSrc } from "../lib/fleetLaunchUrl";
import { logFleetLaunchHandoff } from "../lib/fleetUsageHistory";

const ALLOWED_RETURN = new Set(["/hangar", "/intel", "/origin", "/"]);

const RETURN_ARIA: Record<string, string> = {
  "/": "Return to USJET Fleet",
  "/hangar": "Return to USJET Hangar",
  "/intel": "Return to USJET Intel",
  "/origin": "Return to USJET Origin",
};

export default function Cockpit() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [embedAssist, setEmbedAssist] = useState(false);
  const [assistDismissed, setAssistDismissed] = useState(false);

  const src = useMemo(() => sanitizeCockpitSrc(params.get("src")), [params]);
  const returnTo = useMemo(() => {
    const raw = params.get("return") ?? "/";
    return ALLOWED_RETURN.has(raw) ? raw : "/";
  }, [params]);
  const bay = params.get("bay");
  const partnerLabel = params.get("label");
  const callName = params.get("callName")?.trim() ?? "";
  const isHangarEmbed = params.get("embed") === "hangar";
  const baySlot = useMemo(() => slotFromBayId(bay), [bay]);
  const bayAccentStyle = useMemo(
    () => (baySlot !== null ? fleetBayAccentStyle(baySlot) : undefined),
    [baySlot],
  );

  const launchPartnerDirect = useCallback(() => {
    if (!src) {
      return;
    }

    (window.top ?? window).location.assign(src);
  }, [src]);

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

  // Integrated Navigation: authorize partner iframe immediately — no Launch click required.
  useLayoutEffect(() => {
    if (!src) {
      return;
    }
    if (bay) {
      markFleetBayTrusted(bay);
    }
    logFleetLaunchHandoff(partnerLabel, bay);
  }, [src, bay, partnerLabel]);

  useEffect(() => {
    setEmbedAssist(false);
    setAssistDismissed(false);
    if (!src) {
      return;
    }
    const assistDelayMs = isHangarEmbed ? 2500 : 6000;
    const id = window.setTimeout(() => setEmbedAssist(true), assistDelayMs);
    return () => window.clearTimeout(id);
  }, [isHangarEmbed, src]);

  if (!src) {
    return null;
  }

  const displayName = partnerLabel ?? "partner module";
  const showShield = embedAssist && !assistDismissed;

  return (
    <div className="cockpit-shell" style={bayAccentStyle}>
      <div className="cockpit-shell__frame-wrap">
        <iframe
          className="cockpit-shell__frame"
          title={`USJET integrated partner module · ${displayName}`}
          src={src}
          onLoad={() => setEmbedAssist(false)}
          onError={() => setEmbedAssist(true)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {showShield ? (
          <div className="hangar-embed-shield cockpit-embed-shield" role="region" aria-label="Partner launch fallback">
            <div className="hangar-embed-shield__row">
              <p className="hangar-embed-shield__text">
                {displayName} may block in-cockpit embedding. Launch the live module in this window — USJET stays in
                the corner for return clearance.
              </p>
              <button
                type="button"
                className="hangar-embed-shield__dismiss"
                onClick={() => setAssistDismissed(true)}
                aria-label="Dismiss embedding notice"
              >
                ×
              </button>
            </div>
            <button type="button" className="hangar-embed-shield__cta" onClick={launchPartnerDirect}>
              Launch {displayName}
            </button>
          </div>
        ) : null}
      </div>

      <Link
        to={returnTo}
        className="cockpit-ghost-btn"
        aria-label={RETURN_ARIA[returnTo] ?? "Return to USJET"}
        target={isHangarEmbed ? "_top" : undefined}
        rel={isHangarEmbed ? "noopener noreferrer" : undefined}
      >
        USJET
      </Link>
    </div>
  );
}
