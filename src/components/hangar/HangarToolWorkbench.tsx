import { ExternalLink, Rocket, X } from "lucide-react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import type { FleetUnit } from "../../types/fleet";
import { iframeSrcFromUnitHref } from "../../lib/intelGridExpansion";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  gridStyle: CSSProperties;
  onClose: () => void;
};

const TACTICAL_POPUP_FEATURES =
  "width=1280,height=840,left=72,top=48,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,status=no";

/** Unique window per fleet unit so three simultaneous bays do not reuse one tactical window. */
function tacticalWindowName(unit: FleetUnit): string {
  return `usjet-hangar-tactical-${unit.id}`;
}

function openDedicatedTacticalWindow(src: string, unit: FleetUnit): void {
  const w = window.open(src, tacticalWindowName(unit), TACTICAL_POPUP_FEATURES);
  if (w) {
    try {
      w.opener = null;
    } catch {
      /* cross-realm */
    }
  }
}

/**
 * Hangar 2×2 active cockpit: embeds the fleet unit's real tool URL (`unit.href` → iframe `src`).
 * When providers block iframes, operators can launch the same URL in a dedicated tactical window (Hangar stays mounted).
 */
export default function HangarToolWorkbench({ unit, gridStyle, onClose }: HangarToolWorkbenchProps) {
  const rawHref = unit.href?.trim() || unit.domain?.trim() || "";
  const src = iframeSrcFromUnitHref(rawHref);

  const [embedAssist, setEmbedAssist] = useState(false);
  const [assistDismissed, setAssistDismissed] = useState(false);
  const [frameRevealed, setFrameRevealed] = useState(false);

  const launchTactical = useCallback(() => {
    openDedicatedTacticalWindow(src, unit);
  }, [src, unit]);

  useEffect(() => {
    setEmbedAssist(false);
    setAssistDismissed(false);
    setFrameRevealed(false);
    const id = window.setTimeout(() => setEmbedAssist(true), 6000);
    return () => window.clearTimeout(id);
  }, [src, unit.id]);

  const showShieldPanel = embedAssist && !assistDismissed;

  return (
    <article className="intel-expanded hangar-tool-workbench" style={gridStyle}>
      <header className="intel-expanded__chrome">
        <div className="intel-expanded__meta">
          <p className="intel-expanded__callsign">{unit.callsign}</p>
          <p className="intel-expanded__domain">{unit.domain}</p>
          <p className="intel-expanded__tagline">
            USJET consensus bay · {unit.name} cockpit
          </p>
        </div>
        <div className="intel-expanded__actions">
          <a
            className="intel-expanded__external"
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${unit.name} partner interface in a new tab (USJET hangar stays open)`}
          >
            <ExternalLink size={16} strokeWidth={2} />
          </a>
          <button
            type="button"
            className="intel-expanded__tactical"
            onClick={launchTactical}
            aria-label={`Launch tactical window for ${unit.name} — USJET hangar remains home base`}
          >
            <Rocket size={15} strokeWidth={2.25} aria-hidden />
          </button>
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
              frameRevealed ? "hangar-iframe--ready" : "hangar-iframe--arming",
            ].join(" ")}
            title={`${unit.name} · USJET cockpit`}
            src={src}
            onLoad={() => setFrameRevealed(true)}
            onError={() => setEmbedAssist(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {showShieldPanel ? (
            <div className="hangar-embed-shield" role="region" aria-label="Tactical launch fallback">
              <div className="hangar-embed-shield__row">
                <p className="hangar-embed-shield__text">
                  Partner security shields may block in-hangar embedding. Launch the live interface in a tactical
                  window—USJET stays your home base.
                </p>
                <button
                  type="button"
                  className="hangar-embed-shield__dismiss"
                  onClick={() => setAssistDismissed(true)}
                  aria-label="Dismiss embedding notice"
                >
                  ×
                </button>
              </div>
              <button type="button" className="hangar-embed-shield__cta" onClick={launchTactical}>
                Launch tactical interface
              </button>
            </div>
          ) : null}
        </div>

        <p className="intel-expanded__hint">
          Official partner URL, flown in-network by USJET. New tab:{" "}
          <a className="intel-expanded__hint-link" href={src} target="_blank" rel="noopener noreferrer">
            open in new tab
          </a>
          .
        </p>
      </div>
    </article>
  );
}
