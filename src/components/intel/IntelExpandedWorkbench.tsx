import { ExternalLink, X } from "lucide-react";
import type { CSSProperties } from "react";
import type { FleetUnit } from "../../types/fleet";
import { iframeSrcFromUnitHref } from "../../lib/intelGridExpansion";

type IntelExpandedWorkbenchProps = {
  unit: FleetUnit;
  gridStyle: CSSProperties;
  onClose: () => void;
};

export default function IntelExpandedWorkbench({ unit, gridStyle, onClose }: IntelExpandedWorkbenchProps) {
  const src = iframeSrcFromUnitHref(unit.href);

  return (
    <article className="intel-expanded" style={gridStyle}>
      <header className="intel-expanded__chrome">
        <div className="intel-expanded__meta">
          <p className="intel-expanded__callsign">{unit.callsign}</p>
          <p className="intel-expanded__domain">{unit.domain}</p>
        </div>
        <div className="intel-expanded__actions">
          <a
            className="intel-expanded__external"
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${unit.name} in a new tab`}
          >
            <ExternalLink size={16} strokeWidth={2} />
          </a>
          <button type="button" className="intel-expanded__close" onClick={onClose} aria-label="Minimize workstation">
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>
      </header>

      <div className="intel-expanded__body">
        <iframe
          className="intel-expanded__frame"
          title={`${unit.name} — live tool`}
          src={src}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <p className="intel-expanded__hint">
          Many providers block embedding. If the frame stays blank, use{" "}
          <a className="intel-expanded__hint-link" href={src} target="_blank" rel="noopener noreferrer">
            open in new tab
          </a>
          .
        </p>
      </div>
    </article>
  );
}
