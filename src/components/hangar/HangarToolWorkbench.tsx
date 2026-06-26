import { ExternalLink, X } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import type { FleetUnit } from "../../types/fleet";
import { resolveHangarUnitHref } from "../../lib/hangarLaunchUrl";
import { isHangarIframeBlocked } from "../../lib/hangarEmbedPolicy";
import { fleetLaunchUrl } from "../../lib/fleetLaunchUrl";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
  isolated?: boolean;
};

/**
 * Expanded hangar bay.
 * - Sites that allow iframe embedding load directly in the tile.
 * - Sites that block embedding (X-Frame-Options: DENY) show a launch card
 *   inside the tile — the Launch button opens the site via the cockpit
 *   so you never leave USJET.
 */
export default function HangarToolWorkbench({ unit, onClose, isolated = false }: HangarToolWorkbenchProps) {
  const rawHref = resolveHangarUnitHref(unit);
  const blocked = !rawHref.startsWith("/") && isHangarIframeBlocked(rawHref);
  const cockpitUrl = blocked
    ? fleetLaunchUrl(unit.domain, rawHref, unit.slot)
    : rawHref;

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

      {blocked ? (
        <div className="hangar-tile-launch-card">
          <p className="hangar-tile-launch-card__name">{unit.aiName ?? unit.name}</p>
          <p className="hangar-tile-launch-card__domain">{unit.domain}</p>
          <p className="hangar-tile-launch-card__note">
            This AI blocks website embedding — browser security policy.
          </p>
          <a
            href={cockpitUrl}
            className="hangar-tile-launch-card__btn"
            aria-label={`Open ${unit.aiName ?? unit.name}`}
          >
            <ExternalLink size={16} aria-hidden />
            Open {unit.aiName ?? unit.name}
          </a>
        </div>
      ) : (
        <iframe
          key={`hangar-iframe-${unit.id}-slot-${unit.slot}`}
          className={[
            "hangar-tool-workbench__frame",
            frameReady ? "hangar-iframe--ready" : "hangar-iframe--arming",
          ].join(" ")}
          title={`${unit.aiName ?? unit.name} · USJET hangar bay`}
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
