import { ExternalLink, X } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import type { FleetUnit } from "../../types/fleet";
import HangarPartnerBadge from "./HangarPartnerBadge";
import { resolveHangarUnitHref } from "../../lib/hangarLaunchUrl";
import { getHangarPartnerCompatibility } from "../../lib/hangarEmbedPolicy";
import { fleetBayIdFromSlot, markFleetBayTrusted, wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";
import { logFleetLaunchHandoff } from "../../lib/fleetUsageHistory";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
  isolated?: boolean;
};

/**
 * Expanded hangar bay — Fleet AI with Partner Compatibility status.
 * Native partners embed in-tile. Restricted partners show a clear External Launch
 * CTA (USJET cockpit handoff — One Ship, no empty iframe).
 */
export default function HangarToolWorkbench({ unit, onClose, isolated = false }: HangarToolWorkbenchProps) {
  const rawHref = resolveHangarUnitHref(unit);
  const displayName = unit.aiName ?? unit.name;
  const compatibility = getHangarPartnerCompatibility(rawHref);
  const frameName = `hangar-bay-frame-${unit.slot}`;

  const cockpitUrl =
    compatibility === "external"
      ? wrapExternalInCockpit(rawHref, {
          slot: unit.slot,
          returnTo: "/hangar",
          label: displayName,
          callName: unit.callsign,
        })
      : rawHref;

  const [frameReady, setFrameReady] = useState(false);

  const markLaunch = () => {
    const bayId = fleetBayIdFromSlot(unit.slot);
    if (bayId) {
      markFleetBayTrusted(bayId);
    }
    logFleetLaunchHandoff(displayName, bayId);
  };

  const onFrameLoad = () => {
    setFrameReady(true);
    markLaunch();
  };

  return (
    <article
      className={[
        "hangar-tool-workbench hangar-tool-workbench--bay-accent hangar-tool-workbench--tile-only",
        compatibility === "external" ? "hangar-tool-workbench--external" : "",
        isolated ? "hangar-tool-workbench--isolated" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={fleetBayAccentStyle(unit.slot) as CSSProperties}
    >
      <HangarPartnerBadge mode={compatibility} className="hangar-tool-workbench__compat" />

      <button type="button" className="hangar-tile-close" onClick={onClose} aria-label="Close bay">
        <X size={14} strokeWidth={2.5} />
      </button>

      {compatibility === "external" ? (
        <div className="hangar-tile-external">
          <p className="hangar-tile-external__warning" role="status">
            This partner restricts embedding for security (anti-clickjacking).
          </p>
          <p className="hangar-tile-external__copy">
            Launch opens the official {displayName} interface via the USJET cockpit — same window, return to Hangar.
          </p>
          <a
            href={cockpitUrl}
            className="hangar-tile-external__btn"
            aria-label={`Launch ${displayName} via USJET cockpit`}
            onClick={markLaunch}
          >
            <ExternalLink size={15} aria-hidden />
            Launch {displayName}
          </a>
        </div>
      ) : (
        <iframe
          key={`hangar-iframe-${unit.id}-slot-${unit.slot}`}
          name={frameName}
          className={[
            "hangar-tool-workbench__frame",
            frameReady ? "hangar-iframe--ready" : "hangar-iframe--arming",
          ].join(" ")}
          title={`${displayName} · USJET hangar bay`}
          src={rawHref}
          onLoad={onFrameLoad}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-downloads allow-presentation allow-popups"
          referrerPolicy="no-referrer"
          allow="microphone; camera; clipboard-write; fullscreen"
        />
      )}
    </article>
  );
}
