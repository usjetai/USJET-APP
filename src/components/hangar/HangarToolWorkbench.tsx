import { X } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import type { FleetUnit } from "../../types/fleet";
import { resolveFleetUnitHref } from "../../lib/fleetManifestAudit";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
  /** Portaled full-bleed shell — edge-to-edge iframe, no in-grid chrome. */
  isolated?: boolean;
};

/** Expanded hangar bay — loads actual AI domain directly in the tile iframe. */
export default function HangarToolWorkbench({ unit, onClose, isolated = false }: HangarToolWorkbenchProps) {
  // Always use the real AI domain URL directly — no cockpit redirect
  const rawHref = resolveFleetUnitHref(unit);
  const iframeSrc = rawHref.startsWith("/")
    ? rawHref
    : rawHref.startsWith("http")
      ? rawHref
      : `https://${unit.domain}`;

  const [frameReady, setFrameReady] = useState(false);

  return (
    <article
      className={[
        "hangar-tool-workbench hangar-tool-workbench--bay-accent hangar-tool-workbench--tile-only",
        isolated ? "hangar-tool-workbench--isolated" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={fleetBayAccentStyle(unit.slot) as CSSProperties}
    >
      <button
        type="button"
        className="hangar-tile-close"
        onClick={onClose}
        aria-label="Close bay"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
      <iframe
        key={`hangar-iframe-${unit.id}-slot-${unit.slot}`}
        className={[
          "hangar-tool-workbench__frame",
          frameReady ? "hangar-iframe--ready" : "hangar-iframe--arming",
        ].join(" ")}
        title={`${unit.aiName ?? unit.name} · USJET hangar bay`}
        src={iframeSrc}
        onLoad={() => setFrameReady(true)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
        referrerPolicy="no-referrer-when-downgrade"
        allow="microphone; camera; clipboard-write"
      />
    </article>
  );
}
