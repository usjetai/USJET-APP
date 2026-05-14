import { USJET_OPS_EMAIL } from "../../lib/usjetContact";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import EkgPulseLine from "./EkgPulseLine";

/**
 * Crypto Intel Bay — Slot 01 reserved for premier exchange partner API.
 * Protect Ameer Karim's vision: scarcity signal, not an empty panel.
 */
export default function SovereignPartnershipBay() {
  return (
    <GlassEffectContainer
      className="intel-sovereign-bay glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold"
      aria-labelledby="intel-sovereign-bay-heading"
    >
      <div className="intel-sovereign-bay__stage">
        <div className="intel-sovereign-bay__ekg" aria-hidden>
          <EkgPulseLine variant="hero" seed={1} />
        </div>
        <div className="intel-sovereign-bay__grid" aria-hidden />
        <div className="intel-sovereign-bay__content">
          <p className="intel-sovereign-bay__kicker">Sovereign Partnership</p>
          <h2 id="intel-sovereign-bay-heading" className="intel-sovereign-bay__headline">
            PARTNER API INTEGRATION PENDING
          </h2>
          <p className="intel-sovereign-bay__subtext">
            SLOT 01: RESERVED FOR PREMIER CRYPTO EXCHANGE. ENQUIRE AT{" "}
            <a className="intel-sovereign-bay__email" href={`mailto:${USJET_OPS_EMAIL}`}>
              {USJET_OPS_EMAIL.toUpperCase()}
            </a>
          </p>
        </div>
      </div>
    </GlassEffectContainer>
  );
}
