import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CockpitReturnBar from "../components/layout/CockpitReturnBar";
import { fleetBayAccentStyle, slotFromBayId } from "../data/fleetBayAccents";
import { TRUSTED_FLEET_LAUNCH_COPY } from "../data/usjetProtocol";
import { isFleetBayTrusted, markFleetBayTrusted, sanitizeCockpitSrc } from "../lib/fleetLaunchUrl";
import { logFleetLaunchHandoff } from "../lib/fleetUsageHistory";

const ALLOWED_RETURN = new Set(["/hangar", "/intel", "/origin", "/"]);
const FIRST_HANDOFF_AUTO_MS = 1500;
const TRUSTED_HANDOFF_AUTO_MS = 800;

export default function Cockpit() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [autoLaunchCancelled, setAutoLaunchCancelled] = useState(false);
  const handoffStarted = useRef(false);

  const src = useMemo(() => sanitizeCockpitSrc(params.get("src")), [params]);
  const returnTo = useMemo(() => {
    const raw = params.get("return") ?? "/hangar";
    return ALLOWED_RETURN.has(raw) ? raw : "/hangar";
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

  const executeHandoff = useCallback(() => {
    if (!src || handoffStarted.current) {
      return;
    }
    handoffStarted.current = true;
    if (bay) {
      markFleetBayTrusted(bay);
    }
    logFleetLaunchHandoff(partnerLabel, bay);
    window.location.assign(src);
  }, [bay, partnerLabel, src]);

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

  useEffect(() => {
    if (!src) {
      return;
    }

    if (isTrustedHandoff) {
      const timer = window.setTimeout(executeHandoff, TRUSTED_HANDOFF_AUTO_MS);
      return () => window.clearTimeout(timer);
    }

    if (!autoLaunchCancelled) {
      const timer = window.setTimeout(executeHandoff, FIRST_HANDOFF_AUTO_MS);
      return () => window.clearTimeout(timer);
    }
  }, [autoLaunchCancelled, executeHandoff, isTrustedHandoff, src]);

  if (!src) {
    return null;
  }

  const displayName = partnerLabel ?? "partner module";

  return (
    <div className="cockpit-shell" style={bayAccentStyle}>
      <CockpitReturnBar returnTo={returnTo} bay={bay} partnerLabel={partnerLabel} />
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
        <div className="cockpit-handoff-interstitial__glow" aria-hidden />
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
              <button type="button" className="cockpit-handoff-interstitial__cta" onClick={executeHandoff}>
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
      <Link to={returnTo} className="cockpit-ghost-btn" aria-label="Return to USJET Hangar">
        USJET
      </Link>
    </div>
  );
}
