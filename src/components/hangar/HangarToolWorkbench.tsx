import { X } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import type { FleetUnit } from "../../types/fleet";
import { hangarWorkbenchIframeSrc, iframeSrcFromUnitHref } from "../../lib/intelGridExpansion";
import { fleetLaunchUrl } from "../../lib/fleetLaunchUrl";
import { isHangarIframeBlocked } from "../../lib/hangarEmbedPolicy";
import { resolveFleetUnitHref } from "../../lib/fleetManifestAudit";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
  /** Portaled full-bleed shell — edge-to-edge iframe, no in-grid chrome. */
  isolated?: boolean;
};

/** Expanded hangar bay — partner fills the tile; floating close only. */
export default function HangarToolWorkbench({ unit, onClose, isolated = false }: HangarToolWorkbenchProps) {
  const partnerUrl = iframeSrcFromUnitHref(
    fleetLaunchUrl(unit.domain, resolveFleetUnitHref(unit), unit.slot),
  );
  const iframeSrc = partnerUrl.startsWith("/")
    ? partnerUrl
    : isHangarIframeBlocked(partnerUrl)
      ? hangarWorkbenchIframeSrc(partnerUrl, { slot: unit.slot, label: unit.name })
      : partnerUrl;
  const [frameReady, setFrameReady] = useState(false);

  return (
    <article
      className={[
        "intel-expanded hangar-tool-workbench hangar-tool-workbench--bay-accent hangar-tool-workbench--tile-only",
        isolated ? "hangar-tool-workbench--isolated" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={fleetBayAccentStyle(unit.slot) as CSSProperties}
    >
      <button
        type="button"
        className="intel-expanded__close hangar-tile-close"
        onClick={onClose}
        aria-label="Minimize bay"
      >
        <X size={18} strokeWidth={2.25} />
      </button>
      <iframe
        key={`hangar-iframe-${unit.id}-slot-${unit.slot}`}
        className={[
          "hangar-tool-workbench__frame",
          frameReady ? "hangar-iframe--ready" : "hangar-iframe--arming",
        ].join(" ")}
        title={`${unit.name} · USJET hangar bay`}
        src={iframeSrc}
        onLoad={() => setFrameReady(true)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </article>
  );
}
