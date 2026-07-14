import { useEffect, useLayoutEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fleetBayAccentStyle, slotFromBayId } from "../data/fleetBayAccents";
import { verifyFleetCallName } from "../data/fleetManifest";
import { isHangarIframeBlocked } from "../lib/hangarEmbedPolicy";
import { markFleetBayTrusted, sanitizeCockpitSrc } from "../lib/fleetLaunchUrl";
import { logFleetLaunchHandoff } from "../lib/fleetUsageHistory";

/** Full-page cockpit handoffs; Hangar tiles use `embed=hangar` for in-tile partner frames. */
export default function Cockpit() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const src = useMemo(() => sanitizeCockpitSrc(params.get("src")), [params]);
  const bay = params.get("bay");
  const partnerLabel = params.get("label");
  const callName = params.get("callName")?.trim() ?? "";
  const isHangarEmbed = params.get("embed") === "hangar";
  const directHandoff = params.get("handoff") === "direct";
  const baySlot = useMemo(() => slotFromBayId(bay), [bay]);
  const bayAccentStyle = useMemo(
    () => (baySlot !== null ? fleetBayAccentStyle(baySlot) : undefined),
    [baySlot],
  );
  const iframeBlocked = src ? isHangarIframeBlocked(src) : false;

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
      document.title = isHangarEmbed ? `${partnerLabel ?? host} · USJET Hangar` : `USJET Cockpit · ${host}`;
    } catch {
      document.title = isHangarEmbed ? "USJET Hangar bay" : "USJET Cockpit";
    }
  }, [callName, isHangarEmbed, navigate, partnerLabel, src]);

  useLayoutEffect(() => {
    if (!src) {
      return;
    }
    if (bay) {
      markFleetBayTrusted(bay);
    }
    logFleetLaunchHandoff(partnerLabel, bay);
  }, [bay, partnerLabel, src]);

  useEffect(() => {
    if (!src || !directHandoff || !iframeBlocked || isHangarEmbed) {
      return;
    }
    window.location.assign(src);
  }, [directHandoff, iframeBlocked, isHangarEmbed, src]);

  if (!src) {
    return null;
  }

  const displayName = partnerLabel ?? "partner module";

  if (isHangarEmbed) {
    if (iframeBlocked) {
      return (
        <div className="cockpit-shell cockpit-shell--hangar-embed cockpit-shell--hangar-handoff" style={bayAccentStyle}>
          <div className="cockpit-hangar-handoff">
            <p className="cockpit-hangar-handoff__kicker">Hangar bay · handoff</p>
            <h1 className="cockpit-hangar-handoff__title">{displayName}</h1>
            <p className="cockpit-hangar-handoff__body">
              This AI blocks in-page embedding. Open it in this window — browser back or the USJET return control brings
              you to Hangar.
            </p>
            <a className="cockpit-hangar-handoff__cta" href={src} data-usjet-external-leak="true">
              Open {displayName}
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="cockpit-shell cockpit-shell--hangar-embed" style={bayAccentStyle}>
        <iframe
          className="cockpit-shell__frame"
          title={`${displayName} · USJET hangar module`}
          src={src}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  if (iframeBlocked) {
    return (
      <div className="cockpit-shell cockpit-shell--handoff" style={bayAccentStyle}>
        <div className="cockpit-handoff-interstitial cockpit-handoff-interstitial--bay-accent">
          <div className="cockpit-handoff-interstitial__glow" aria-hidden />
          <div className="cockpit-handoff-interstitial__inner">
            <p className="cockpit-handoff-interstitial__kicker">USJET handoff</p>
            <h1 className="cockpit-handoff-interstitial__title">{displayName}</h1>
            <p className="cockpit-handoff-interstitial__body">
              This partner blocks in-page embedding. Open the live site in this window — use your browser back button
              or the USJET control to return.
            </p>
            <div className="cockpit-handoff-interstitial__actions">
              <a
                className="cockpit-handoff-interstitial__cta"
                href={src}
                data-usjet-external-leak="true"
              >
                Open {displayName}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    </div>
  );
}
