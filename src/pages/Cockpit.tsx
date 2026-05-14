import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fleetBayAccentStyle, slotFromBayId } from "../data/fleetBayAccents";
import { TRUSTED_FLEET_LAUNCH_COPY } from "../data/usjetProtocol";
import { isFleetBayTrusted, markFleetBayTrusted, sanitizeCockpitSrc } from "../lib/fleetLaunchUrl";
import { logFleetLaunchHandoff } from "../lib/fleetUsageHistory";

const ALLOWED_RETURN = new Set(["/hangar", "/intel", "/origin", "/"]);
const FIRST_HANDOFF_AUTO_MS = 1500;

const RETURN_ARIA: Record<string, string> = {
  "/": "Return to USJET Fleet",
  "/hangar": "Return to USJET Hangar",
  "/intel": "Return to USJET Intel",
  "/origin": "Return to USJET Origin",
};

export default function Cockpit() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [autoLaunchCancelled, setAutoLaunchCancelled] = useState(false);
  const [handoffComplete, setHandoffComplete] = useState(false);
  const [embedAssist, setEmbedAssist] = useState(false);
  const [assistDismissed, setAssistDismissed] = useState(false);

  const src = useMemo(() => sanitizeCockpitSrc(params.get("src")), [params]);
  const returnTo = useMemo(() => {
    const raw = params.get("return") ?? "/";
    return ALLOWED_RETURN.has(raw) ? raw : "/";
  }, [params]);
  const bay = params.get("bay");
  const partnerLabel = params.get("label");
  const handoffParam = params.get("handoff");
  const baySlot = useMemo(() => slotFromBayId(bay), [bay]);
  const bayAccentStyle = useMemo(
    () => (baySlot !== null ? fleetBayAccentStyle(baySlot) : undefined),
    [baySlot],
  );

  const isTrustedHandoff = useMemo(() => {
    if (handoffParam === "trusted") {
      return true;
    }
    if (bay) {
      return isFleetBayTrusted(bay);
    }
    return false;
  }, [bay, handoffParam]);

  const completeHandoff = useCallback(() => {
    if (bay) {
      markFleetBayTrusted(bay);
    }
    logFleetLaunchHandoff(partnerLabel, bay);
    setHandoffComplete(true);
  }, [bay, partnerLabel]);

  const launchPartnerDirect = useCallback(() => {
    if (src) {
      window.location.assign(src);
    }
  }, [src]);

  useEffect(() => {
    if (!src) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const host = new URL(src).hostname.replace(/^www\./, "");
      document.title = `USJET Cockpit · ${host}`;
    } catch {
      document.title = "USJET Cockpit";
    }
  }, [navigate, src]);

  useEffect(() => {
    if (!src) {
      return;
    }

    if (isTrustedHandoff) {
      completeHandoff();
      return;
    }

    if (!autoLaunchCancelled) {
      const timer = window.setTimeout(completeHandoff, FIRST_HANDOFF_AUTO_MS);
      return () => window.clearTimeout(timer);
    }
  }, [autoLaunchCancelled, completeHandoff, isTrustedHandoff, src]);

  useEffect(() => {
    setEmbedAssist(false);
    setAssistDismissed(false);
    if (!handoffComplete || !src) {
      return;
    }
    const id = window.setTimeout(() => setEmbedAssist(true), 6000);
    return () => window.clearTimeout(id);
  }, [handoffComplete, src]);

  if (!src) {
    return null;
  }

  const displayName = partnerLabel ?? "partner module";
  const showShield = handoffComplete && embedAssist && !assistDismissed;

  return (
    <div className="cockpit-shell" style={bayAccentStyle}>
      <div className="cockpit-shell__frame-wrap">
        {handoffComplete ? (
          <iframe
            className="cockpit-shell__frame"
            title={`USJET integrated partner module · ${displayName}`}
            src={src}
            onLoad={() => setEmbedAssist(false)}
            onError={() => setEmbedAssist(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div
            className={[
              "cockpit-handoff-interstitial",
              "cockpit-handoff-interstitial--bay-accent",
              isTrustedHandoff ? "cockpit-handoff-interstitial--trusted" : "cockpit-handoff-interstitial--first",
            ].join(" ")}
            role="region"
            aria-label={isTrustedHandoff ? "Trusted fleet handoff" : "Sovereign fleet handoff clearance"}
            aria-live="polite"
          >
            <div className="cockpit-handoff-interstitial__glow" aria-hidden="true" />
            <div className="cockpit-handoff-interstitial__inner">
              <p className="cockpit-handoff-interstitial__kicker">{TRUSTED_FLEET_LAUNCH_COPY.certified}</p>
              <h1 className="cockpit-handoff-interstitial__title">
                {isTrustedHandoff ? TRUSTED_FLEET_LAUNCH_COPY.trustedTitle : TRUSTED_FLEET_LAUNCH_COPY.firstTitle}
              </h1>
              <p className="cockpit-handoff-interstitial__pulse" aria-hidden>
                {TRUSTED_FLEET_LAUNCH_COPY.securing}
              </p>
              <p className="cockpit-handoff-interstitial__body">
                {isTrustedHandoff ? TRUSTED_FLEET_LAUNCH_COPY.trustedBody : TRUSTED_FLEET_LAUNCH_COPY.firstBody}
              </p>
              {!isTrustedHandoff ? (
                <div className="cockpit-handoff-interstitial__actions">
                  <button type="button" className="cockpit-handoff-interstitial__cta" onClick={completeHandoff}>
                    {TRUSTED_FLEET_LAUNCH_COPY.launchCta} — {displayName}
                  </button>
                  {!autoLaunchCancelled ? (
                    <button
                      type="button"
                      className="cockpit-handoff-interstitial__cancel"
                      onClick={() => setAutoLaunchCancelled(true)}
                    >
                      {TRUSTED_FLEET_LAUNCH_COPY.cancelAuto}
                    </button>
                  ) : (
                    <p className="cockpit-handoff-interstitial__hold">{TRUSTED_FLEET_LAUNCH_COPY.autoPaused}</p>
                  )}
                </div>
              ) : (
                <p className="cockpit-handoff-interstitial__meta">
                  {bay ? `Bay ${bay}` : null}
                  {bay && displayName ? " · " : null}
                  {displayName}
                </p>
              )}
            </div>
          </div>
        )}

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

      <Link to={returnTo} className="cockpit-ghost-btn" aria-label={RETURN_ARIA[returnTo] ?? "Return to USJET"}>
        USJET
      </Link>
    </div>
  );
}
