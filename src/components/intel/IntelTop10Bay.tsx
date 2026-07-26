import { useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import IntelScanLine from "./IntelScanLine";
import { getTop10TierPitch, type IntelTop10Tier } from "../../data/intelTop10Tiers";
import { USJET_OPS_EMAIL } from "../../lib/usjetContact";

type IntelTop10BayProps = {
  tier: IntelTop10Tier;
  index: number;
};

export default function IntelTop10Bay({ tier, index: _index }: IntelTop10BayProps) {
  const [pitchOpen, setPitchOpen] = useState(false);

  const engineMotion = useMemo(
    () =>
      ({
        "--intel-bay-engine-period": `${1.02 + Math.random() * 1.48}s`,
        "--intel-bay-engine-delay": `-${Math.random() * 2.4}s`,
      }) as CSSProperties,
    [],
  );

  const stopBubble = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <article
      className={[
        "intel-monitor",
        "intel-reserved-bay",
        "intel-reserved-bay--hot",
        "intel-top10-bay",
        `intel-top10-bay--${tier.id}`,
        "glass-effect",
        "liquid-glass-background",
        tier.tintClass,
      ].join(" ")}
      style={{
        animationDelay: `${Math.random() * 2}s`,
        ...engineMotion,
        ["--intel-tier-accent" as string]: tier.accent,
        ["--intel-tier-bright" as string]: tier.accentBright,
      }}
      aria-label={`Slot ${tier.slot} — ${tier.status}`}
    >
      <header className="intel-monitor__header">
        <span className="intel-top10-bay__identity">
          <span className="intel-top10-bay__slot">slot {tier.slot}</span>
          <span className="intel-top10-bay__badge">{tier.name}</span>
        </span>
        <span className="intel-monitor__status intel-monitor__status--staging intel-top10-bay__status">
          {tier.status}
        </span>
      </header>

      <div className="intel-monitor__screen intel-reserved-bay__screen">
        <div className="intel-monitor__grid" aria-hidden />
        <IntelScanLine className="intel-reserved-bay__scan" />

        <div className="intel-reserved-bay__overlay intel-top10-bay__overlay">
          <h2 className="intel-top10-bay__tier-name">{tier.status}</h2>
          <p className="intel-top10-bay__tagline">{tier.tagline}</p>
          <p className="intel-reserved-bay__hook intel-top10-bay__hook">
            PARTNERSHIP ENQUIRIES:{" "}
            <a className="intel-top10-bay__email" href={`mailto:${USJET_OPS_EMAIL}`} onClick={stopBubble}>
              {USJET_OPS_EMAIL.toUpperCase()}
            </a>
          </p>
          <button
            type="button"
            className="intel-reserved-bay__details intel-top10-bay__details"
            onClick={(event) => {
              stopBubble(event);
              setPitchOpen((open) => !open);
            }}
            aria-expanded={pitchOpen}
          >
            Details
          </button>
          {pitchOpen ? (
            <p className="intel-reserved-bay__pitch intel-top10-bay__pitch" onClick={stopBubble}>
              {getTop10TierPitch(tier)}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
