import { ExternalLink, X } from "lucide-react";
import type { CSSProperties } from "react";
import type { FleetUnit } from "../../types/fleet";
import { iframeSrcFromUnitHref } from "../../lib/intelGridExpansion";
import { wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";
import MarketDualFeed from "./market/MarketDualFeed";

type IntelExpandedWorkbenchProps = {
  unit: FleetUnit;
  gridStyle: CSSProperties;
  onClose: () => void;
};

export default function IntelExpandedWorkbench({ unit, gridStyle, onClose }: IntelExpandedWorkbenchProps) {
  const src = iframeSrcFromUnitHref(unit.href);
  const launchHref = wrapExternalInCockpit(src, {
    slot: unit.slot,
    returnTo: "/intel",
    label: unit.name,
  });

  return (
    <article className="intel-expanded" style={gridStyle}>
      <header className="intel-expanded__chrome">
        <div className="intel-expanded__meta">
          <p className="intel-expanded__callsign">{unit.callsign}</p>
          <p className="intel-expanded__unit-name">{unit.name}</p>
          <p className="intel-expanded__domain">{unit.domain}</p>
          <p className="intel-expanded__tagline">Market workstation · BTC spot · NYSE composite</p>
        </div>
        <div className="intel-expanded__actions">
          <a
            className="intel-expanded__external"
            href={launchHref}
            aria-label={`Launch ${unit.name} — integrated navigation`}
          >
            <ExternalLink size={16} strokeWidth={2} />
          </a>
          <button type="button" className="intel-expanded__close" onClick={onClose} aria-label="Minimize workstation">
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>
      </header>

      <div className="intel-expanded__body intel-expanded__body--dual">
        <MarketDualFeed seedSlot={unit.slot} />
      </div>
    </article>
  );
}
