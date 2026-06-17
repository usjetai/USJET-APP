import { X } from "lucide-react";
import { useCallback, useState, type CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import DeveloperRedBlinkName from "../DeveloperRedBlinkName";
import type { FleetUnit } from "../../types/fleet";
import UsjetReturnButton from "../layout/UsjetReturnButton";
import { iframeSrcFromUnitHref } from "../../lib/intelGridExpansion";
import { fleetLaunchUrl } from "../../lib/fleetLaunchUrl";
import { isHangarIframeBlocked } from "../../lib/hangarEmbedPolicy";

type HangarToolWorkbenchProps = {
  unit: FleetUnit;
  onClose: () => void;
};

/**
 * Expanded hangar bay — partner loads inside the 2×2 tile iframe.
 * Blocked partners show Launch first; tap sets iframe src in-place (no new browser tab).
 */
export default function HangarToolWorkbench({ unit, onClose }: HangarToolWorkbenchProps) {
  const partnerUrl = iframeSrcFromUnitHref(fleetLaunchUrl(unit.domain, unit.href, unit.slot));
  const isInternalRoute = partnerUrl.startsWith("/");
  const needsLaunchGate = !isInternalRoute && isHangarIframeBlocked(partnerUrl);

  const [launched, setLaunched] = useState(!needsLaunchGate);
  const [frameReady, setFrameReady] = useState(false);
  const [frameKey, setFrameKey] = useState(0);

  const launchInTile = useCallback(() => {
    setFrameReady(false);
    setLaunched(true);
    setFrameKey((key) => key + 1);
  }, []);

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
          <p className="intel-expanded__tagline">USJET consensus bay · in-tile module</p>
        </div>
        <div className="intel-expanded__actions">
          {launched && needsLaunchGate ? (
            <button
              type="button"
              className="hangar-embed-gate__reload"
              onClick={launchInTile}
              aria-label={`Reload ${unit.name} inside this bay`}
            >
              Reload
            </button>
          ) : null}
          <button type="button" className="intel-expanded__close" onClick={onClose} aria-label="Minimize bay">
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>
      </header>

      <div className="intel-expanded__body">
        <div className="hangar-cockpit-frame">
          <UsjetReturnButton
            placement="tile"
            onClick={onClose}
            ariaLabel="Return to USJET Hangar grid"
          />
          {!launched ? (
            <div className="hangar-embed-gate" role="region" aria-label={`Launch ${unit.name} in this bay`}>
              <p className="hangar-embed-gate__text">
                <strong>{unit.name}</strong> blocks background embeds on <strong>{unit.domain}</strong>. Tap Launch to
                load the live module inside this bay — same window, no new browser tab.
              </p>
              <button type="button" className="hangar-embed-gate__cta hangar-embed-shield__cta" onClick={launchInTile}>
                Launch {unit.name}
              </button>
            </div>
          ) : (
            <iframe
              key={`hangar-iframe-${unit.id}-slot-${unit.slot}-${frameKey}`}
              className={[
                "intel-expanded__frame",
                frameReady ? "hangar-iframe--ready" : "hangar-iframe--arming",
              ].join(" ")}
              title={`${unit.name} · USJET hangar bay`}
              src={partnerUrl}
              onLoad={() => setFrameReady(true)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>

        <p className="intel-expanded__hint">
          {launched
            ? (
              <>
                {unit.name} is running inside this bay at{" "}
                <span className="intel-expanded__hint-domain">{unit.domain}</span>.
              </>
            )
            : (
              <>Waiting for Launch — module stays inside the expanded hangar tile.</>
            )}
        </p>
      </div>
    </article>
  );
}
