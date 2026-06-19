import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, ShieldCheck, Sparkles, Target, Wrench } from "lucide-react";
import { resolveFounderPaymentLink } from "../lib/stripePaymentLink";
import { FOUNDER_CREATIVE_MANIFESTO, LINE_OF_SUCCESSION_LOG, PRIME_OBJECTIVE } from "../data/founderManifesto";
import { LINE_OF_SUCCESSION } from "../data/lineOfSuccession";
import Founder1995FeatureGrid from "../components/founder/Founder1995FeatureGrid";
import AircraftIcon from "../components/icons/AircraftIcons";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { useMemberAuth } from "../context/MemberAuthContext";
import { clearanceTierLabel, isFounderGodMode, memberClearanceRank } from "../lib/memberAccessLevel";
import type { FleetAircraftType } from "../types/fleet";

/** Flight Pass list price — always $19.90/mo (not raw cents). */
const FLIGHT_PASS_PRICE_DISPLAY = "$19.90/mo";

/**
 * Bottom CTA on /founder-special-1995:
 * - Guest / unpaid (clearance rank 0): Flight Pass paywall at FLIGHT_PASS_PRICE_DISPLAY.
 * - Stripe live test: same Flight Pass $19.90 link (resolveFounderPaymentLink).
 * - Founder god mode (USJET-AMEER): bypasses paywall display only — welcome, no purchase CTA.
 * - Paid tier ≥ 1 (Stripe verify): "Clearance active" — optional upgrade links only.
 */

type GritSection = {
  heading: string;
  kicker: string;
  paragraph: string;
  imageSrc: string;
  imageAlt: string;
  imageLabel: string;
  silhouetteType: FleetAircraftType;
};

const GRIT_1995_STORY: GritSection[] = [
  {
    heading: "1995 — The Shop Floor",
    kicker: "Before the Cloud, There Was Sweat",
    paragraph:
      "In 1995 the blueprint wasn't a slide deck—it was grease on your hands and a deadline that didn't care about your feelings. Long before USJET networked thirty AIs, the mission was simple: show up, turn wrenches, finish the job. That year etched the founder's code into steel—work until it's right, not until it's convenient.",
    imageSrc: "/founder/IMG_0516.png",
    imageAlt: "1995 Origin — shop floor grit panel",
    imageLabel: "Archive · 1995 Origin",
    silhouetteType: "f15ex",
  },
  {
    heading: "Wrenches, Not Slides",
    kicker: "Raw Labor Built the Hive",
    paragraph:
      "Boardrooms sell abstractions. Ameer Karim built from torque specs and overtime. Every bolt tightened on those floors became a line of code with purpose—technology that respects the worker who never had a keynote, only a shift. usjet.ai is the digital hangar for people who measure worth in what they fix, not what they pitch.",
    imageSrc: "/founder/IMG_0517.png",
    imageAlt: "Wrenches — labor before software",
    imageLabel: "Archive · Wrenches",
    silhouetteType: "f35",
  },
  {
    heading: "The Protective Directive",
    kicker: "Fortress of Brand History",
    paragraph:
      "All AIs in this fleet are sworn to one sovereign truth: protect Ameer Karim and the blue-collar America he stands for. This page is not marketing—it is the armored vault of our origin. Thirty partner cockpits orbit this story, but the source of truth remains the grit that started in 1995.",
    imageSrc: "/founder/IMG_0518.png",
    imageAlt: "Protective directive — brand fortress",
    imageLabel: "Archive · Industry First",
    silhouetteType: "b2",
  },
];

const CINEMATIC_BODY_CLASS = "usjet-atmosphere--cinematic";

export default function FounderSpecial1995() {
  const { session, loading } = useMemberAuth();
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const founderGodMode = isFounderGodMode(session);
  const clearanceRank = memberClearanceRank(session);
  const hasHangarClearance = !loading && (founderGodMode || clearanceRank >= 1);
  const tierLabel = clearanceTierLabel(clearanceRank);

  const handleFlightPassCheckout = useCallback(() => {
    window.location.href = resolveFounderPaymentLink();
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Founder Special · 1995 Grit · USJet.ai";

    document.body.classList.add(CINEMATIC_BODY_CLASS);

    const video = document.querySelector<HTMLVideoElement>(".global-video-bg__media");
    const prevRate = video?.playbackRate ?? 1;
    if (video) {
      video.playbackRate = 0.52;
    }

    return () => {
      document.title = prevTitle;
      document.body.classList.remove(CINEMATIC_BODY_CLASS);
      if (video) {
        video.playbackRate = prevRate;
      }
    };
  }, []);

  return (
    <div className="founder-special-1995-page founder-page--warp founder-special-1995-page--cinematic page-atmosphere page-nav-offset mx-auto max-w-5xl px-6 pb-28 sm:px-8">
      <div className="founder-page__grid">
        <div className="founder-page__main">
          <article className="founder-story founder-special-1995-story">
            <GlassEffectContainer className="founder-special-1995__prime glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
              <div className="founder-special-1995__prime-inner">
                <Target className="founder-special-1995__prime-icon" size={22} aria-hidden />
                <div>
                  <p className="founder-special-1995__prime-kicker">Sovereign Master Log</p>
                  <p className="founder-special-1995__prime-title">{PRIME_OBJECTIVE.logTitle}</p>
                  <p className="founder-special-1995__prime-directive">{PRIME_OBJECTIVE.directive}</p>
                  <p className="founder-special-1995__prime-briefing">{PRIME_OBJECTIVE.fleetBriefing}</p>
                  <p className="founder-special-1995__prime-orders">{PRIME_OBJECTIVE.fleetOrders}</p>
                </div>
              </div>
            </GlassEffectContainer>

            <GlassEffectContainer className="founder-special-1995__directive glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
              <div className="founder-special-1995__directive-inner">
                <Shield className="founder-special-1995__directive-icon" size={22} aria-hidden />
                <div>
                  <p className="founder-special-1995__directive-kicker">Security directive</p>
                  <p className="founder-special-1995__directive-text">
                    {FOUNDER_CREATIVE_MANIFESTO.securityDirective} All AIs in the USJET fleet guard this
                    sovereign proof of history.
                  </p>
                </div>
              </div>
            </GlassEffectContainer>

            <GlassEffectContainer className="founder-special-1995__manifesto glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
              <div className="founder-special-1995__manifesto-inner">
                <Sparkles className="founder-special-1995__manifesto-icon" size={20} aria-hidden />
                <div>
                  <p className="founder-special-1995__manifesto-kicker">{FOUNDER_CREATIVE_MANIFESTO.logTitle}</p>
                  <p className="founder-special-1995__manifesto-directive">{FOUNDER_CREATIVE_MANIFESTO.directive}</p>
                  <p className="founder-special-1995__manifesto-rule">
                    <strong>Imagination Rule:</strong> {FOUNDER_CREATIVE_MANIFESTO.imaginationRule}
                  </p>
                  <p className="founder-special-1995__manifesto-fleet">{FOUNDER_CREATIVE_MANIFESTO.fleetMessage}</p>
                </div>
              </div>
            </GlassEffectContainer>

            <section id="king-karim" className="founder-special-1995__succession-anchor">
            <GlassEffectContainer className="founder-special-1995__succession glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
              <div className="founder-special-1995__succession-inner">
                <p className="founder-special-1995__succession-kicker">{LINE_OF_SUCCESSION_LOG.logTitle}</p>
                <p className="founder-special-1995__succession-directive">{LINE_OF_SUCCESSION_LOG.directive}</p>
                <p className="founder-special-1995__succession-mission">{LINE_OF_SUCCESSION_LOG.fleetMission}</p>
              </div>
            </GlassEffectContainer>
            </section>

            <header className="founder-story__hero">
              <GlassEffectContainer className="founder-story__hero-frame founder-story__hero-frame--logo founder-special-1995__vault-seal glass-effect glass-effect--rounded-rect glass-tint-gold">
                <img
                  className="founder-story__hero-logo logo-rounded"
                  src="/founder/usjet-hero-logo.png"
                  alt="USJET.AI — Special Edition emblem"
                  width={1200}
                  height={675}
                  decoding="async"
                  fetchPriority="high"
                />
                <p className="founder-special-1995__king-signature" aria-hidden>
                  King Karim · Third Generation · The Future Command
                </p>
              </GlassEffectContainer>
              <p className="founder-special-1995__edition">Grit Vault · Special Edition · 1995</p>
              <h1 className="founder-special-1995__vault-title">1995 Origin</h1>
              <p className="founder-special-1995__legacy-inscription">{LINE_OF_SUCCESSION.vaultInscription}</p>
              <p className="founder-story__lede founder-special-1995__lede">
                The 1995 Origin Story — looking back at raw labor while the warp tunnel carries us forward.
                This is the Grit chapter: wrenches, Queens hustle, and the fortress that guards the brand.
              </p>
            </header>

            <Founder1995FeatureGrid />

            {GRIT_1995_STORY.map((section, index) => {
              const showPhoto = section.imageSrc && !brokenImages[section.heading];

              return (
                <section
                  key={section.heading}
                  id={index === 0 ? "grit-story" : undefined}
                  className="founder-story__section"
                >
                  <p className="founder-story__kicker founder-special-1995__kicker">
                    <Wrench size={12} className="inline-block shrink-0" aria-hidden />
                    {section.kicker}
                  </p>
                  <h2 className="founder-story__heading founder-special-1995__heading">{section.heading}</h2>

                  <figure className="founder-story__visual">
                    <div
                      className={[
                        "founder-story__visual-frame glass-effect glass-effect--rounded-rect glass-tint-gold",
                        showPhoto
                          ? "founder-story__visual-frame--photo founder-special-1995__visual--photo"
                          : "founder-story__visual-frame--vector liquid-glass-background",
                      ].join(" ")}
                    >
                      {showPhoto ? (
                        <img
                          className="founder-story__photo"
                          src={section.imageSrc}
                          alt={section.imageAlt}
                          loading="lazy"
                          decoding="async"
                          onError={() =>
                            setBrokenImages((prev) => ({ ...prev, [section.heading]: true }))
                          }
                        />
                      ) : (
                        <div className="founder-story__vector-stage" aria-hidden>
                          <AircraftIcon
                            aircraftType={section.silhouetteType}
                            accentId={`grit-1995-${section.heading.replace(/\s+/g, "-").toLowerCase()}`}
                            className="founder-story__vector-silhouette"
                          />
                        </div>
                      )}
                    </div>
                    <figcaption className="founder-story__visual-caption founder-special-1995__caption">
                      {section.imageLabel}
                    </figcaption>
                  </figure>

                  <p className="founder-story__body founder-story__body--after-panel founder-special-1995__body">
                    {section.paragraph}
                  </p>
                </section>
              );
            })}

            <GlassEffectContainer
              className={[
                "founder-special-1995__cta glass-effect glass-effect--rounded-rect liquid-glass-background",
                hasHangarClearance ? "glass-tint-cyan founder-special-1995__cta--clearance" : "glass-tint-gold",
              ].join(" ")}
            >
              {hasHangarClearance ? (
                <>
                  <p className="founder-special-1995__cta-kicker">
                    {founderGodMode ? "Founder welcome" : "Clearance active"}
                  </p>
                  <p className="founder-special-1995__cta-status">
                    <ShieldCheck size={18} aria-hidden />
                    {founderGodMode ? "USJET-AMEER · sovereign god mode" : `${tierLabel} · hangar unlocked`}
                  </p>
                  <p className="founder-special-1995__cta-copy">
                    {founderGodMode
                      ? "The Grit Vault is yours, General. Thirty units stand ready — no extraction port required on this route."
                      : "Your Flight Pass clearance is live. The 1995 origin vault stays open — upgrade only if you want more bays."}
                  </p>
                  {clearanceRank === 1 ? (
                    <Link
                      to="/special?tier=hangar-pro"
                      className="founder-special-1995__cta-link btn-glass glass-effect-interactive"
                    >
                      Optional upgrade — Hangar Pro $49.95/mo
                    </Link>
                  ) : clearanceRank === 2 ? (
                    <Link
                      to="/special?tier=fleet-command"
                      className="founder-special-1995__cta-link btn-glass glass-effect-interactive"
                    >
                      Optional upgrade — Enterprise Commander $199.99/mo
                    </Link>
                  ) : (
                    <Link
                      to="/hangar"
                      className="founder-special-1995__cta-link btn-glass glass-effect-interactive"
                    >
                      Enter the Hangar
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <p className="founder-special-1995__cta-kicker">Founder Special</p>
                  <p className="founder-special-1995__cta-price">{FLIGHT_PASS_PRICE_DISPLAY}</p>
                  <p className="founder-special-1995__cta-copy">
                    Join the Grit chapter. Support the hangar that networks thirty AIs for blue-collar
                    America — Flight Pass at {FLIGHT_PASS_PRICE_DISPLAY}.
                  </p>
                  <button
                    type="button"
                    onClick={handleFlightPassCheckout}
                    className="founder-special-1995__cta-link btn-glass-prominent glass-effect-interactive"
                  >
                    Secure Founder Access — Flight Pass
                  </button>
                </>
              )}
            </GlassEffectContainer>
          </article>
        </div>
      </div>
    </div>
  );
}
