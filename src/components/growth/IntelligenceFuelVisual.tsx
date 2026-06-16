import UsjetStarEmblem from "../brand/UsjetStarEmblem";

/** Community tier visual — glowing fuel cell / sovereign star. */
export default function IntelligenceFuelVisual() {
  return (
    <div className="intelligence-tier-visual intelligence-tier-visual--fuel" aria-hidden>
      <div className="intelligence-tier-visual__fuel-glow" />
      <UsjetStarEmblem className="intelligence-tier-visual__star" decorative />
      <span className="intelligence-tier-visual__fuel-label">FUEL CELL ACTIVE</span>
    </div>
  );
}
