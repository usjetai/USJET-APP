import { Link } from "react-router-dom";
import { Heart, Rocket } from "lucide-react";
import UsjetStarEmblem from "../components/brand/UsjetStarEmblem";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { hasIndiegogoCampaign, INDIEGOGO_CAMPAIGN_URL } from "../lib/usjetCampaigns";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../lib/usjetContact";

export default function SupportFleet() {
  const campaignLive = hasIndiegogoCampaign();

  return (
    <div className="support-fleet-page page-atmosphere page-nav-offset mx-auto max-w-3xl px-6 pb-32 pt-2 sm:px-8">
      <header className="support-fleet-page__header text-center">
        <div className="support-fleet-page__star-wrap" aria-hidden>
          <UsjetStarEmblem className="support-fleet-page__star" decorative />
        </div>
        <div className="support-fleet-page__kicker-row">
          <Heart size={14} aria-hidden />
          <p className="support-fleet-page__kicker">Crowdfunding engine</p>
        </div>
        <h1 className="support-fleet-page__title">Support the Fleet</h1>
        <p className="support-fleet-page__lede mx-auto max-w-xl text-pretty">
          Put capital behind the sovereign cockpit, the thirty-unit fleet, and the hardware arc. Every contribution fuels
          the expansion of America&apos;s AI-driven labor network—from Origin prototypes to the bays operators use every
          shift.
        </p>
      </header>

      <GlassEffectContainer className="support-fleet-page__card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="support-fleet-page__card-inner">
          <Rocket size={20} aria-hidden className="support-fleet-page__card-icon" />
          <h2 className="support-fleet-page__card-title">Indiegogo · Fleet campaign</h2>
          <p className="support-fleet-page__card-copy">
            Back the build in public. Perks, early access, and fleet-branded rewards route through our Indiegogo
            campaign—the fastest way to put money into the hangar today.
          </p>
          {campaignLive ? (
            <a
              href={INDIEGOGO_CAMPAIGN_URL}
              className="support-fleet-page__cta btn-glass glass-effect-interactive"
              target="_blank"
              rel="noopener noreferrer"
            >
              Back USJET on Indiegogo
            </a>
          ) : (
            <p className="support-fleet-page__pending" role="status">
              Campaign URL is being wired. Email{" "}
              <a href={mailtoUsjetOps("Support the Fleet — Indiegogo")} className="support-fleet-page__inline-link">
                {USJET_OPS_EMAIL}
              </a>{" "}
              for the live link, or set <code className="support-fleet-page__env">VITE_INDIEGOGO_URL</code> in Vercel.
            </p>
          )}
        </div>
      </GlassEffectContainer>

      <div className="support-fleet-page__lanes">
        <GlassEffectContainer className="support-fleet-page__lane glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <p className="support-fleet-page__lane-kicker">Whales · top</p>
          <h3 className="support-fleet-page__lane-title">Strategic partners</h3>
          <p className="support-fleet-page__lane-copy">
            Institutions and exchanges lease prime placement — route through founder operations.
          </p>
          <a
            href={mailtoUsjetOps("Strategic partnership inquiry")}
            className="support-fleet-page__lane-link glass-effect-interactive"
          >
            Email OPS →
          </a>
        </GlassEffectContainer>
        <GlassEffectContainer className="support-fleet-page__lane glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <p className="support-fleet-page__lane-kicker">Fleet · bottom</p>
          <h3 className="support-fleet-page__lane-title">Fleet supporters</h3>
          <p className="support-fleet-page__lane-copy">
            Shops, manufacturers, and local fleets fuel the mission and fly with the Star.
          </p>
          <Link to="/founders-fuel" className="support-fleet-page__lane-link glass-effect-interactive">
            Founder&apos;s Fuel $19.90 →
          </Link>
        </GlassEffectContainer>
      </div>

      <p className="support-fleet-page__return mt-10 text-center">
        <Link to="/" className="support-fleet-page__return-link glass-effect-interactive">
          Fleet home
        </Link>
      </p>
    </div>
  );
}
