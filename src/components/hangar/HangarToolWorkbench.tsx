import { Maximize2, Minimize2, X } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import type { FleetUnit } from "../../types/fleet";
import { resolveHangarUnitHref } from "../../lib/hangarLaunchUrl";
import { isHangarIframeBlocked } from "../../lib/hangarEmbedPolicy";
import { fleetBayIdFromSlot, markFleetBayTrusted } from "../../lib/fleetLaunchUrl";
import { logFleetLaunchHandoff } from "../../lib/fleetUsageHistory";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
  focused?: boolean;
  onToggleFocus?: () => void;
  isolated?: boolean;
};

/**
 * Expanded hangar bay — same Fleet AI as the runway.
 * Embeddable partners load in-tile (direct URL). Blocked partners show only an
 * Open button — no nested cockpit chrome, footer, or USJET FAB in the tile.
 * Enlarge keeps the same iframe mounted so work in the bay is not lost.
 */
export default function HangarToolWorkbench({
  unit,
  onClose,
  focused = false,
  onToggleFocus,
  isolated = false,
}: HangarToolWorkbenchProps) {
  const rawHref = resolveHangarUnitHref(unit);
  const isInternal = rawHref.startsWith("/");
  const blocked = !isInternal && isHangarIframeBlocked(rawHref);
  const displayName = unit.aiName ?? unit.name;
  const canFocus = Boolean(onToggleFocus) && !isolated;

  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    if (!focused || !canFocus) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onToggleFocus?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canFocus, focused, onToggleFocus]);

  const onHandoffClick = () => {
    const bayId = fleetBayIdFromSlot(unit.slot);
    if (bayId) {
      markFleetBayTrusted(bayId);
    }
    logFleetLaunchHandoff(displayName, bayId);
  };

  return (
    <div
      className={[
        "hangar-bay-focus-slot",
        focused && canFocus ? "hangar-bay-focus-slot--active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {focused && canFocus ? (
        <button
          type="button"
          className="hangar-bay-focus-backdrop"
          aria-label={`Shrink ${displayName} bay`}
          onClick={onToggleFocus}
        />
      ) : null}

      <article
        className={[
          "hangar-tool-workbench hangar-tool-workbench--bay-accent hangar-tool-workbench--tile-only",
          blocked ? "hangar-tool-workbench--handoff-only" : "",
          isolated ? "hangar-tool-workbench--isolated" : "",
          focused && canFocus ? "hangar-tool-workbench--focused" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={fleetBayAccentStyle(unit.slot) as CSSProperties}
      >
        <div className="hangar-tile-controls">
          {canFocus ? (
            <button
              type="button"
              className="hangar-tile-focus"
              onClick={onToggleFocus}
              aria-label={focused ? `Shrink ${displayName} bay` : `Enlarge ${displayName} bay`}
              aria-pressed={focused}
              title={focused ? "Shrink tile" : "Enlarge tile"}
            >
              {focused ? <Minimize2 size={14} strokeWidth={2.5} /> : <Maximize2 size={14} strokeWidth={2.5} />}
            </button>
          ) : null}
          <button type="button" className="hangar-tile-close" onClick={onClose} aria-label="Close bay">
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

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
    </div>
  );
}
