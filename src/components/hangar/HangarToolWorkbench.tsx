import { ExternalLink, Rocket, X } from "lucide-react";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import type { FleetUnit } from "../../types/fleet";
import { iframeSrcFromUnitHref } from "../../lib/intelGridExpansion";
import { wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
};

/**
 * Hangar 2×2 active cockpit: embeds the fleet unit's real tool URL (`unit.href` → iframe `src`).
 * Integrated Navigation: partner launches stay in the same window when operators leave the embed.
 */
export default function HangarToolWorkbench({ unit, onClose }: HangarToolWorkbenchProps) {
  const rawHref = unit.href?.trim() || unit.domain?.trim() || "";
  const src = iframeSrcFromUnitHref(rawHref);
  const launchHref = wrapExternalInCockpit(src, {
    slot: unit.slot,
    returnTo: "/hangar",
    label: unit.name,
  });

  const [embedAssist, setEmbedAssist] = useState(false);
  const [assistDismissed, setAssistDismissed] = useState(false);
  const [frameRevealed, setFrameRevealed] = useState(false);

  const launchIntegrated = useCallback(() => {
    window.location.assign(src);
  }, [src]);

  useEffect(() => {
    setEmbedAssist(false);
    setAssistDismissed(false);
    setFrameRevealed(false);
    const id = window.setTimeout(() => setEmbedAssist(true), 6000);
    return () => window.clearTimeout(id);
  }, [src, unit.id]);

  const showShieldPanel = embedAssist && !assistDismissed;

  return (
    <article
      className="intel-expanded hangar-tool-workbench hangar-tool-workbench--bay-accent"
      style={fleetBayAccentStyle(unit.slot) as CSSProperties}
    >
      <header className="intel-expanded__chrome">
        <div className="intel-expanded__meta">
          <p className="intel-expanded__callsign">{unit.callsign}</p>
          <p className="intel-expanded__domain">{unit.domain}</p>
          <p className="intel-expanded__tagline">USJET consensus bay · {unit.name} cockpit</p>
        </div>
        <div className="intel-expanded__actions">
          <a
            className="intel-expanded__external"
            href={launchHref}
            aria-label={`Launch ${unit.name} — integrated navigation`}
          >
            <ExternalLink size={16} strokeWidth={2} />
          </a>
          <button
            type="button"
            className="intel-expanded__tactical"
            onClick={launchIntegrated}
            aria-label={`Launch ${unit.name} in the same window — USJET integrated navigation`}
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
            <div className="hangar-embed-shield" role="region" aria-label="Integrated launch fallback">
              <div className="hangar-embed-shield__row">
                <p className="hangar-embed-shield__text">
                  Partner security shields may block in-hangar embedding. Launch the live module with integrated
                  navigation—your session continues in the USJET fleet.
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
              <button type="button" className="hangar-embed-shield__cta" onClick={launchIntegrated}>
                Launch integrated interface
              </button>
            </div>
          ) : null}
        </div>

        <p className="intel-expanded__hint">
          Official partner URL, flown in-network by USJET. Integrated navigation:{" "}
          <a className="intel-expanded__hint-link" href={launchHref}>
            launch module
          </a>
          .
        </p>
      </div>
    </article>
  );
}
