import { useState } from "react";
import { Facebook, Instagram } from "lucide-react";
import FounderJetWing from "../components/founder/FounderJetWing";
import FounderWorkerSilhouette, {
  type FounderWorkerSilhouetteType,
} from "../components/founder/FounderWorkerSilhouettes";
import AircraftIcon from "../components/icons/AircraftIcons";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";

const USJET_SOCIAL = {
  instagram: "https://www.instagram.com/usjet/",
  facebook: "https://www.facebook.com/usjets",
  x: "https://x.com/usajet",
} as const;

function XComIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 4l16 16M20 4L4 20"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

type StorySection = {
  heading: string;
  kicker: string;
  paragraph: string;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  imageLabel: string;
  silhouetteType: FounderWorkerSilhouetteType;
};

const FOUNDERS_STORY: StorySection[] = [
  {
    heading: "The Origin",
    kicker: "Built on Queens Grit",
    paragraph:
      "Every great system starts with a single point of impact. For us, that point was the hustle between Long Beach and Queens. This isn't just code; it's the digital evolution of blue-collar sweat. We took the relentless work ethic of the New York streets—the kind that doesn't punch out until the job is done—and used it as the foundation for usjet.ai. We aren't just building an app; we're honoring the grit that keeps the world moving.",
    imageSrc: "/founder/IMG_0516.png",
    imageWidth: 626,
    imageHeight: 600,
    imageAlt: "The Origin — Long Beach to Queens",
    imageLabel: "The Origin · Long Beach to Queens",
    silhouetteType: "origin",
  },
  {
    heading: "The Fleet",
    kicker: "Wrenches, Not Slides",
    paragraph:
      "This isn't an 'enterprise solution' built in a boardroom—this is a digital hive built by someone who's turned wrenches, not just turned slides. Every unit in this fleet is synchronized to solve real-world problems at a scale the industry hasn't seen yet.",
    imageSrc: "/founder/IMG_0517.png",
    imageWidth: 637,
    imageHeight: 610,
    imageAlt: "The Fleet — 30 AI units",
    imageLabel: "The Fleet · 30 AI units",
    silhouetteType: "wrenches",
  },
  {
    heading: "Industry First",
    kicker: "Pioneering the Blue-Collar AI",
    paragraph:
      "We saw a gap where others saw a wall. While the tech world focused on the abstract, we looked toward the tangible. usjet.ai stands as the world's first AI platform dedicated to the blue-collar sector. By combining first-mover architecture with a deep respect for human labor, we are redefining what it means to work. This is the future of industry: high-fidelity technology meets high-intensity grit.",
    imageSrc: "/founder/IMG_0518.png",
    imageWidth: 689,
    imageHeight: 625,
    imageAlt: "Industry First — pioneering blue-collar AI",
    imageLabel: "Industry First",
    silhouetteType: "industryFirst",
  },
];

const Founder = () => {
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  return (
    <div className="founder-page founder-page--warp founder-page--wing page-atmosphere page-nav-offset px-6 pb-28 sm:px-8">
      <div className="founder-page__wing-grid">
        <FounderJetWing side="left" />

        <div className="founder-page__center">
          <article className="founder-story founder-page__main">
            <header className="founder-story__hero">
              <GlassEffectContainer className="founder-story__hero-frame founder-story__hero-frame--logo glass-effect--rounded-rect">
                <img
                  className="founder-story__hero-logo"
                  src="/founder/usjet-hero-logo.png"
                  alt="USJET.AI — liquid glass star emblem"
                  width={1200}
                  height={675}
                  decoding="async"
                  fetchPriority="high"
                />
              </GlassEffectContainer>
              <p className="founder-story__lede founder-story__lede--centered">
                Queens hustle, the digital hive, and the first AI platform built for blue-collar
                America — from someone who turned wrenches before slides.
              </p>
            </header>

            {FOUNDERS_STORY.map((section) => {
              const showPhoto = !brokenImages[section.heading];

              return (
                <section key={section.heading} className="founder-story__section">
                  <p className="founder-story__kicker">{section.kicker}</p>
                  <h2 className="founder-story__heading">{section.heading}</h2>
                  <p className="founder-story__body">{section.paragraph}</p>

                  <figure className="founder-story__visual">
                    <GlassEffectContainer
                      className={[
                        "founder-story__visual-frame",
                        "glass-effect",
                        "glass-effect--rounded-rect",
                        showPhoto
                          ? "founder-story__visual-frame--photo"
                          : "founder-story__visual-frame--vector liquid-glass-background",
                      ].join(" ")}
                    >
                      {showPhoto ? (
                        <img
                          className="founder-story__photo"
                          src={section.imageSrc}
                          alt={section.imageAlt}
                          width={section.imageWidth}
                          height={section.imageHeight}
                          loading="lazy"
                          decoding="async"
                          onError={() =>
                            setBrokenImages((prev) => ({ ...prev, [section.heading]: true }))
                          }
                        />
                      ) : (
                        <div className="founder-story__vector-stage" aria-hidden>
                          <FounderWorkerSilhouette
                            silhouetteType={section.silhouetteType}
                            className="founder-story__worker-silhouette"
                          />
                        </div>
                      )}
                    </GlassEffectContainer>
                    <figcaption className="founder-story__visual-caption">
                      {section.imageLabel}
                    </figcaption>
                  </figure>
                </section>
              );
            })}

            <footer className="founder-social">
              <p className="founder-social__eyebrow">Social navigation</p>
              <div className="founder-social__row">
                <div className="founder-social__escort" aria-hidden>
                  <span className="founder-social__escort-slot founder-social__escort-slot--wing">
                    <AircraftIcon aircraftType="f22" accentId="escort-1" className="founder-escort-jet" />
                  </span>
                  <span className="founder-social__escort-slot founder-social__escort-slot--lead">
                    <AircraftIcon aircraftType="sr71" accentId="escort-2" className="founder-escort-jet" />
                  </span>
                  <span className="founder-social__escort-slot founder-social__escort-slot--wing">
                    <AircraftIcon aircraftType="f35" accentId="escort-3" className="founder-escort-jet" />
                  </span>
                </div>

                <nav className="founder-social__nav" aria-label="USJet on social media">
                  <a
                    href={USJET_SOCIAL.instagram}
                    className="founder-social__link btn-glass glass-effect-interactive glass-tint-cyan"
                    aria-label="USJet on Instagram (usjet)"
                  >
                    <Instagram size={26} strokeWidth={1.35} className="founder-social__icon" />
                  </a>
                  <a
                    href={USJET_SOCIAL.facebook}
                    className="founder-social__link btn-glass glass-effect-interactive glass-tint-cyan"
                    aria-label="USJet on Facebook (usjets)"
                  >
                    <Facebook size={26} strokeWidth={1.35} className="founder-social__icon" />
                  </a>
                  <a
                    href={USJET_SOCIAL.x}
                    className="founder-social__link btn-glass glass-effect-interactive glass-tint-cyan"
                    aria-label="USJet on X (usajet)"
                  >
                    <XComIcon className="founder-social__x-icon founder-social__icon" />
                  </a>
                </nav>
              </div>
            </footer>
          </article>
        </div>

        <FounderJetWing side="right" />
      </div>
    </div>
  );
};

export default Founder;
