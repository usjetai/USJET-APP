import { X } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import type { FleetUnit } from "../../types/fleet";
import { resolveHangarUnitHref } from "../../lib/hangarLaunchUrl";
import { isHangarIframeBlocked } from "../../lib/hangarEmbedPolicy";
import { fleetBayIdFromSlot, markFleetBayTrusted } from "../../lib/fleetLaunchUrl";
import { logFleetLaunchHandoff } from "../../lib/fleetUsageHistory";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
  isolated?: boolean;
};

/**
 * Expanded hangar bay — same Fleet AI as the runway.
 * Embeddable partners load in-tile (direct URL). Blocked partners show only an
 * Open button — no nested cockpit chrome, footer, or USJET FAB in the tile.
 */
export default function HangarToolWorkbench({ unit, onClose, isolated = false }: HangarToolWorkbenchProps) {
  const rawHref = resolveHangarUnitHref(unit);
  const isInternal = rawHref.startsWith("/");
  const blocked = !isInternal && isHangarIframeBlocked(rawHref);
  const displayName = unit.aiName ?? unit.name;

  const [frameReady, setFrameReady] = useState(false);

  const onHandoffClick = () => {
    const bayId = fleetBayIdFromSlot(unit.slot);
    if (bayId) {
      markFleetBayTrusted(bayId);
    }
    logFleetLaunchHandoff(displayName, bayId);
  };

  return (
    <article
      className={[
        "hangar-tool-workbench hangar-tool-workbench--bay-accent hangar-tool-workbench--tile-only",
        blocked ? "hangar-tool-workbench--handoff-only" : "",
        isolated ? "hangar-tool-workbench--isolated" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={fleetBayAccentStyle(unit.slot) as CSSProperties}
    >
      <button type="button" className="hangar-tile-close" onClick={onClose} aria-label="Close bay">
        <X size={14} strokeWidth={2.5} />
      </button>

      {blocked ? (
        <div className="hangar-tile-handoff">
          <a
            href={rawHref}
            className="hangar-tile-handoff__btn"
            data-usjet-external-leak="true"
            aria-label={`Open ${displayName}`}
            onClick={onHandoffClick}
          >
            Open {displayName}
          </a>
        </div>
      ) : (
        <iframe
          key={`hangar-iframe-${unit.id}-slot-${unit.slot}`}
          className={[
            "hangar-tool-workbench__frame",
            frameReady ? "hangar-iframe--ready" : "hangar-iframe--arming",
          ].join(" ")}
          title={`${displayName} · USJET hangar bay`}
          src={rawHref}
          onLoad={() => setFrameReady(true)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-presentation"
          referrerPolicy="no-referrer-when-downgrade"
          allow="microphone; camera; clipboard-write; fullscreen"
        />
      )}
    </article>
  );
}
