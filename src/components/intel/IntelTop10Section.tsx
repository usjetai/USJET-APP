import IntelTop10Bay from "./IntelTop10Bay";
import { INTEL_TOP10_TIERS } from "../../data/intelTop10Tiers";

/** Top 10 partnership row — Titans-grade institutional bays, slots 03–12. */
export default function IntelTop10Section() {
  return (
    <section className="intel-top10" aria-labelledby="intel-top10-heading">
      <header className="intel-top10__header">
        <p className="intel-top10__kicker">Partnership real estate</p>
        <h2 id="intel-top10-heading" className="intel-top10__title">
          Top <span className="intel-top10__title-accent">10</span>
        </h2>
        <p className="intel-top10__copy">
          Ten sovereign clearance tiers — each bay reserved for institutional partners. Museum of grit, not vacant
          placeholders.
        </p>
      </header>

      <div className="intel-top10__grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {INTEL_TOP10_TIERS.map((tier, index) => (
          <IntelTop10Bay key={tier.id} tier={tier} index={index} />
        ))}
      </div>
    </section>
  );
}
