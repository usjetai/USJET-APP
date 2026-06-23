import { ExternalLink, X } from "lucide-react";
import type { CSSProperties } from "react";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import type { FleetUnit } from "../../types/fleet";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import { fleetLaunchUrl } from "../../lib/fleetLaunchUrl";
import MarketDualFeed from "./market/MarketDualFeed";
import NyseTicker from "./NyseTicker";

type IntelExpandedWorkbenchProps = {
  unit: FleetUnit;
  gridStyle: CSSProperties;
  onClose: () => void;
};

export default function IntelExpandedWorkbench({ unit, gridStyle, onClose }: IntelExpandedWorkbenchProps) {
  const launchHref = fleetLaunchUrl(unit.domain, unit.href, unit.slot);

  return (
    <article className="intel-expanded intel-expanded--bay-accent" style={{ ...fleetBayAccentStyle(unit.slot), ...gridStyle }}>
      <header className="intel-expanded__chrome">
        <div className="intel-expanded__meta">
          {unit.aiName ? <p className="intel-expanded__ai-name">{unit.aiName}</p> : null}
        </div>
        <div className="intel-expanded__actions">
          <a
            className="intel-expanded__external"
            href={launchHref}
            aria-label={`Launch ${unit.aiName ?? "AI"} — integrated navigation`}
            onClick={() => logFleetUsageIfMember(unit.callsign, unit.name)}
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
      <div className="intel-expanded__nyse">
        <NyseTicker />
      </div>
    </article>
  );
}
