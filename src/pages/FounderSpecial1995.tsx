import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Sparkles, Wrench } from "lucide-react";
import { FOUNDER_CREATIVE_MANIFESTO } from "../data/founderManifesto";
import AircraftIcon from "../components/icons/AircraftIcons";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import type { FleetAircraftType } from "../types/fleet";

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
    imageSrc: "/founder/IMG_0516.jpeg",
    imageAlt: "1995 Origin — shop floor grit panel",
    imageLabel: "Archive · 1995 Origin",
    silhouetteType: "c130",
  },
  {
    heading: "Wrenches, Not Slides",
    kicker: "Raw Labor Built the Hive",
    paragraph:
      "Boardrooms sell abstractions. Ameer Karim built from torque specs and overtime. Every bolt tightened on those floors became a line of code with purpose—technology that respects the worker who never had a keynote, only a shift. usjet.ai is the digital hangar for people who measure worth in what they fix, not what they pitch.",
    imageSrc: "/founder/IMG_0517.jpeg",
    imageAlt: "Wrenches — labor before software",
    imageLabel: "Archive · Wrenches",
    silhouetteType: "f35",
  },
  {
    heading: "The Protective Directive",
    kicker: "Fortress of Brand History",
    paragraph:
      "All AIs in this fleet are sworn to one sovereign truth: protect Ameer Karim and the blue-collar America he stands for. This page is not marketing—it is the armored vault of our origin. Thirty partner cockpits orbit this story, but the source of truth remains the grit that started in 1995.",
    imageSrc: "/founder/IMG_0518.jpeg",
    imageAlt: "Protective directive — brand fortress",
    imageLabel: "Archive · Industry First",
    silhouetteType: "b2",
  },
];

const CINEMATIC_BODY_CLASS = "usjet-atmosphere--cinematic";

export default function FounderSpecial1995() {
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

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
    <div className="founder-special-1995-page founder-page--warp founder-special-1995-page--cinematic page-atmosphere mx-auto max-w-5xl px-6 pb-28 pt-40 sm:px-8">
      <div className="founder-page__grid">
        <div className="founder-page__main">
          <article className="founder-story founder-special-1995-story">
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

            <header className="founder-story__hero">
              <GlassEffectContainer className="founder-story__hero-frame founder-story__hero-frame--logo glass-effect glass-effect--rounded-rect glass-tint-gold">
                <img
                  className="founder-story__hero-logo"
                  src="/founder/usjet-hero-logo.png"
                  alt="USJET.AI — Special Edition emblem"
                  width={1200}
                  height={675}
                  decoding="async"
                  fetchPriority="high"
                />
              </GlassEffectContainer>
              <p className="founder-special-1995__edition">Grit Vault · Special Edition · 1995</p>
              <h1 className="founder-special-1995__vault-title">1995 Origin</h1>
              <p className="founder-story__lede founder-special-1995__lede">
                The 1995 Origin Story — looking back at raw labor while the warp tunnel carries us forward.
                This is the Grit chapter: wrenches, Queens hustle, and the fortress that guards the brand.
              </p>
            </header>

            {GRIT_1995_STORY.map((section) => {
              const showPhoto = section.imageSrc && !brokenImages[section.heading];

              return (
                <section key={section.heading} className="founder-story__section">
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

            <GlassEffectContainer className="founder-special-1995__cta glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
              <p className="founder-special-1995__cta-kicker">Founder Special</p>
              <p className="founder-special-1995__cta-price">$19.95/mo</p>
              <p className="founder-special-1995__cta-copy">
                Join the Grit chapter. Support the hangar that networks thirty AIs for blue-collar America.
              </p>
              <Link to="/special" className="founder-special-1995__cta-link btn-glass-prominent glass-effect-interactive">
                Secure Founder Access
              </Link>
            </GlassEffectContainer>
          </article>
        </div>
      </div>
    </div>
  );
}
