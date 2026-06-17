import { X } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import DeveloperRedBlinkName from "../DeveloperRedBlinkName";
import type { FleetUnit } from "../../types/fleet";
import { hangarWorkbenchIframeSrc, iframeSrcFromUnitHref } from "../../lib/intelGridExpansion";
import { fleetLaunchUrl } from "../../lib/fleetLaunchUrl";
import { isHangarIframeBlocked } from "../../lib/hangarEmbedPolicy";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
};

/** Expanded hangar bay — partner opens inside the tile immediately (no Launch gate). */
export default function HangarToolWorkbench({ unit, onClose }: HangarToolWorkbenchProps) {
  const partnerUrl = iframeSrcFromUnitHref(fleetLaunchUrl(unit.domain, unit.href, unit.slot));
  const iframeSrc = partnerUrl.startsWith("/")
    ? partnerUrl
    : isHangarIframeBlocked(partnerUrl)
      ? hangarWorkbenchIframeSrc(partnerUrl, { slot: unit.slot, label: unit.name })
      : partnerUrl;
  const [frameReady, setFrameReady] = useState(false);

  return (
    <article
      className="intel-expanded hangar-tool-workbench hangar-tool-workbench--bay-accent"
      style={fleetBayAccentStyle(unit.slot) as CSSProperties}
    >
      <header className="intel-expanded__chrome">
        <div className="intel-expanded__meta">
          <p className="intel-expanded__callsign">{unit.name}</p>
          <p className="intel-expanded__unit-name">
            <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
          </p>
          <p className="intel-expanded__domain">{unit.domain}</p>
          <p className="intel-expanded__tagline">USJET consensus bay</p>
        </div>
        <div className="intel-expanded__actions">
          <button type="button" className="intel-expanded__close" onClick={onClose} aria-label="Minimize bay">
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>
      </header>

      <div className="intel-expanded__body">
        <div className="hangar-cockpit-frame">
          <iframe
            key={`hangar-iframe-${unit.id}-slot-${unit.slot}`}
            className={[
              "intel-expanded__frame",
              frameReady ? "hangar-iframe--ready" : "hangar-iframe--arming",
            ].join(" ")}
            title={`${unit.name} · USJET hangar bay`}
            src={iframeSrc}
            onLoad={() => setFrameReady(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </article>
  );
}
