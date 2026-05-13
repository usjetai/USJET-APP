import { useEffect, useState } from "react";
import { Facebook, Instagram } from "lucide-react";
import AircraftIcon from "../components/icons/AircraftIcons";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import type { FleetAircraftType } from "../types/fleet";

const USJET_SOCIAL = {
  instagram: "https://www.instagram.com/usjet/",
  facebook: "https://www.facebook.com/usjets",
  x: "https://x.com/usajet",
} as const;

const WINGMAN_JETS: { id: string; aircraftType: FleetAircraftType; parallaxFactor: number }[] = [
  { id: "wingman-b2", aircraftType: "b2", parallaxFactor: 0.068 },
  { id: "wingman-sr71", aircraftType: "sr71", parallaxFactor: 0.092 },
  { id: "wingman-ghawk", aircraftType: "globalHawk", parallaxFactor: 0.118 },
];

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
  imageAlt: string;
  imageLabel: string;
  silhouetteType: FleetAircraftType;
};

/** Drop high-res panels into `public/founder/` (e.g. IMG_0515-origin.jpeg). Vector silhouettes show until images load. */
const FOUNDERS_STORY: StorySection[] = [
  {
    heading: "The Origin",
    kicker: "Built on Queens Grit",
    paragraph:
      "Every great system starts with a single point of impact. For us, that point was the hustle between Long Beach and Queens. This isn't just code; it's the digital evolution of blue-collar sweat. We took the relentless work ethic of the New York streets—the kind that doesn't punch out until the job is done—and used it as the foundation for usjet.ai. We aren't just building an app; we're honoring the grit that keeps the world moving.",
    imageSrc: "/founder/IMG_0515-origin.jpeg",
    imageAlt: "The Origin — Queens grit and the foundation of USJET",
    imageLabel: "IMG_0515 — The Origin",
    silhouetteType: "sr71",
  },
  {
    heading: "The Fleet",
    kicker: "Wrenches, Not Slides",
    paragraph:
      "This isn't an 'enterprise solution' built in a boardroom—this is a digital hive built by someone who's turned wrenches, not just turned slides. Every unit in this fleet is synchronized to solve real-world problems at a scale the industry hasn't seen yet.",
    imageSrc: "/founder/IMG_0515-fleet.jpeg",
    imageAlt: "The Fleet — thirty AI units in synchronized formation",
    imageLabel: "IMG_0515 — The Fleet",
    silhouetteType: "f35",
  },
  {
    heading: "Industry First",
    kicker: "Pioneering the Blue-Collar AI",
    paragraph:
      "We saw a gap where others saw a wall. While the tech world focused on the abstract, we looked toward the tangible. usjet.ai stands as the world's first AI platform dedicated to the blue-collar sector. By combining first-mover architecture with a deep respect for human labor, we are redefining what it means to work. This is the future of industry: high-fidelity technology meets high-intensity grit.",
    imageSrc: "/founder/IMG_0515-industry-first.jpeg",
    imageAlt: "Industry First — blue-collar AI pioneering",
    imageLabel: "IMG_0515 — Industry First",
    silhouetteType: "b2",
  },
];

const Founder = () => {
  const [scrollY, setScrollY] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return;
    }

    let ticking = false;

    const update = () => {
      setScrollY(window.scrollY || document.documentElement.scrollTop);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="founder-page founder-page--warp page-atmosphere mx-auto max-w-5xl px-6 pb-28 pt-40 sm:px-8">
      <div className="founder-page__grid">
        <div className="founder-page__main">
          <article className="founder-story">
            <GlassEffectContainer
              className="founder-story__intro glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan flex flex-col gap-0 p-6 sm:p-8"
            >
              <p className="founder-story__eyebrow">Founder Field Brief</p>
              <h1 className="founder-story__title">Three Paragraphs of Grit</h1>
              <p className="founder-story__lede">
                Ameer Karim on Queens hustle, the digital hive, and the first AI platform built for
                blue-collar America.
              </p>
            </GlassEffectContainer>

            {FOUNDERS_STORY.map((section) => {
              const showPhoto = section.imageSrc && !brokenImages[section.heading];

              return (
                <section key={section.heading} className="founder-story__section">
                  <p className="founder-story__kicker">{section.kicker}</p>
                  <h2 className="founder-story__heading">{section.heading}</h2>
                  <p className="founder-story__body">{section.paragraph}</p>

                  <figure className="founder-story__visual">
                    <div
                      className={[
                        "founder-story__visual-frame glass-effect glass-effect--rounded-rect",
                        showPhoto ? "founder-story__visual-frame--photo" : "founder-story__visual-frame--vector liquid-glass-background",
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
                            accentId={`founder-visual-${section.heading.replace(/\s+/g, "-").toLowerCase()}`}
                            className="founder-story__vector-silhouette"
                          />
                        </div>
                      )}
                    </div>
                    <figcaption className="founder-story__visual-caption">{section.imageLabel}</figcaption>
                  </figure>
                </section>
              );
            })}
          </article>

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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-social__link btn-glass glass-effect-interactive glass-tint-cyan"
                  aria-label="USJet on Instagram (usjet)"
                >
                  <Instagram size={26} strokeWidth={1.35} className="founder-social__icon" />
                </a>
                <a
                  href={USJET_SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-social__link btn-glass glass-effect-interactive glass-tint-cyan"
                  aria-label="USJet on Facebook (usjets)"
                >
                  <Facebook size={26} strokeWidth={1.35} className="founder-social__icon" />
                </a>
                <a
                  href={USJET_SOCIAL.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-social__link btn-glass glass-effect-interactive glass-tint-cyan"
                  aria-label="USJet on X (usajet)"
                >
                  <XComIcon className="founder-social__x-icon founder-social__icon" />
                </a>
              </nav>
            </div>
          </footer>
        </div>

        <aside className="founder-wingman" aria-label="Wingman escort column">
          <div className="founder-wingman__sticky">
            <div className="founder-wingman__row">
              <p className="founder-wingman__rail">Wingman</p>
              <div className="founder-wingman__jets">
                {WINGMAN_JETS.map((jet) => {
                  const offset = scrollY * jet.parallaxFactor;

                  return (
                    <div
                      key={jet.id}
                      className="founder-wingman__jet-slot"
                      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
                    >
                      <AircraftIcon
                        aircraftType={jet.aircraftType}
                        accentId={jet.id}
                        className="founder-wingman__jet"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Founder;
