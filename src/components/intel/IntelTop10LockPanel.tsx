import { Link } from "react-router-dom";
import { Lock, ShieldAlert } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import IntelTop10Bay from "./IntelTop10Bay";
import { INTEL_TOP10_TIERS } from "../../data/intelTop10Tiers";

/** Premium clearance veil — Titans-grade lock, upgrade CTA only (Intel page stays open). */
export default function IntelTop10LockPanel() {
  return (
    <div className="intel-top10-lock">
      <div className="intel-top10-lock__preview" aria-hidden>
        <div className="intel-top10__grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {INTEL_TOP10_TIERS.map((tier, index) => (
            <IntelTop10Bay key={tier.id} tier={tier} index={index} />
          ))}
        </div>
      </div>

      <div className="intel-top10-lock__veil" aria-hidden />

      <GlassEffectContainer className="intel-top10-lock__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="intel-top10-lock__inner">
          <div className="intel-top10-lock__icon-wrap">
            <Lock size={28} className="intel-top10-lock__icon" aria-hidden />
          </div>
          <p className="intel-top10-lock__kicker">Premium market intelligence</p>
          <h3 className="intel-top10-lock__title">Tier 2 or Tier 3 clearance required</h3>
          <p className="intel-top10-lock__copy">
            Top 10 partnership bays are reserved for Hangar Pro and Enterprise Commander members. Upgrade clearance
            to unlock Titans-grade institutional telemetry.
          </p>

          <Link to="/special" className="intel-top10-lock__cta btn-glass btn-glass-prominent glass-effect-interactive">
            <ShieldAlert size={16} aria-hidden />
            Upgrade clearance
          </Link>

          <p className="intel-top10-lock__footer">
            Flight Pass members retain full Intel monitor grid access.{" "}
            <Link to="/member" className="intel-top10-lock__link">
              Member Portal
            </Link>
          </p>
        </div>
      </GlassEffectContainer>
    </div>
  );
}
