import { X } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import type { FleetUnit } from "../../types/fleet";
import { resolveHangarUnitHref } from "../../lib/hangarLaunchUrl";
import { hangarWorkbenchIframeSrc } from "../../lib/intelGridExpansion";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
  isolated?: boolean;
};

/**
 * Expanded hangar bay — same Fleet AI website as the runway card.
 * External partners load through same-origin `/cockpit?embed=hangar` so the
 * tab stays on USJET. Cockpit iframes partners that allow framing, or shows
 * an in-tile handoff when the partner blocks embedding.
 */
export default function HangarToolWorkbench({ unit, onClose, isolated = false }: HangarToolWorkbenchProps) {
  const rawHref = resolveHangarUnitHref(unit);

  const frameSrc = useMemo(
    () =>
      hangarWorkbenchIframeSrc(rawHref, {
        slot: unit.slot,
        label: unit.aiName ?? unit.name,
        returnTo: "/hangar",
      }),
    [rawHref, unit.aiName, unit.name, unit.slot],
  );

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
      <button type="button" className="hangar-tile-close" onClick={onClose} aria-label="Close bay">
        <X size={14} strokeWidth={2.5} />
      </button>

      <iframe
        key={`hangar-iframe-${unit.id}-slot-${unit.slot}`}
        className={[
          "hangar-tool-workbench__frame",
          frameReady ? "hangar-iframe--ready" : "hangar-iframe--arming",
        ].join(" ")}
        title={`${unit.aiName ?? unit.name} · USJET hangar bay`}
        src={frameSrc}
        onLoad={() => setFrameReady(true)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-presentation"
        referrerPolicy="no-referrer-when-downgrade"
        allow="microphone; camera; clipboard-write; fullscreen"
      />
    </article>
  );
}
