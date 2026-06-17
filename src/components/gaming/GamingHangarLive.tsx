import { Radio } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { HANGAR_LIVE_SECTION_TITLE, HANGAR_LIVE_TWITCH_HOOK } from "../../data/liveHangar";
import GamingFuelStreamCta from "./GamingFuelStreamCta";
import GamingTikTokBay from "./GamingTikTokBay";
import GamingInstagramLiveBay from "./GamingInstagramLiveBay";
import GamingTwitchBay from "./GamingTwitchBay";
import GamingTwitchChatBridge from "./GamingTwitchChatBridge";

/** USJET Live Hangar — Twitch player, Instagram bay, chat bridge, fuel CTA, TikTok proof bay. */
export default function GamingHangarLive() {
  return (
    <section id="gaming-hangar-live" className="gaming-page__hangar-live" aria-labelledby="gaming-hangar-live-title">
      <h2 id="gaming-hangar-live-title" className="gaming-page__section-title gaming-page__section-title--hangar">
        <Radio size={18} aria-hidden />
        {HANGAR_LIVE_SECTION_TITLE}
      </h2>
      <p className="gaming-page__hangar-hook">{HANGAR_LIVE_TWITCH_HOOK}</p>

      <GlassEffectContainer className="hangar-live-deck glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="hangar-live-deck__inner">
          <div className="hangar-live-deck__stage">
            <GamingTwitchBay variant="hangar" />
            <GamingInstagramLiveBay />
            <GamingFuelStreamCta />
          </div>
          <GamingTwitchChatBridge />
        </div>
      </GlassEffectContainer>

      <div id="gaming-proof-bay" className="gaming-page__proof-bay">
        <p className="gaming-page__proof-label">Viral proof of life</p>
        <GamingTikTokBay />
      </div>
    </section>
  );
}
