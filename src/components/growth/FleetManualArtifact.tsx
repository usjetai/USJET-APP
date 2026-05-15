/** Cockpit digital manual — fighter-jet HUD aesthetic. */
export default function FleetManualArtifact() {
  return (
    <div className="fleet-manual-artifact" aria-hidden>
      <div className="fleet-manual-artifact__hud">
        <div className="fleet-manual-artifact__scan" />
        <div className="fleet-manual-artifact__frame">
          <p className="fleet-manual-artifact__label">USJET · FLEET MANUAL</p>
          <p className="fleet-manual-artifact__edition">PROFESSIONAL EDITION</p>
          <div className="fleet-manual-artifact__bars">
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="fleet-manual-artifact__status">IMPLEMENTATION READY</p>
        </div>
      </div>
    </div>
  );
}
