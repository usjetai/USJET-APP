import { useEffect, useState } from "react";
import { Facebook, Instagram } from "lucide-react";
import AircraftIcon from "../components/icons/AircraftIcons";
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
  paragraph: string;
  imageLabel: string;
  silhouetteType: FleetAircraftType;
};

const ARCHITECTURE_OF_THOUGHT: StorySection[] = [
  {
    heading: "Load-Bearing Systems",
    paragraph:
      "I learned to read the world through stress long before I learned to read code. On shop floors and in structural studios, every failure was a lesson in what a system could carry, what it could shed, and what had to be rebuilt from first principles.",
    imageLabel: "Visual 01 — Structural load study",
    silhouetteType: "sr71",
  },
  {
    heading: "Drafting Discipline",
    paragraph:
      "Architectural engineering taught me to compose space, load paths, and intent on paper before steel ever rose. A decade as an auto mechanic taught me that ideas only matter when they survive vibration, heat, and time. Precision is not a mood; it is a method.",
    imageLabel: "Visual 02 — Drafting table and bay floor",
    silhouetteType: "f35",
  },
  {
    heading: "Digital Hangar",
    paragraph:
      "USJet.ai is where those disciplines meet: a hangar for intelligent tools arranged so a founder can think in formation instead of isolation. I spent years perfecting the machines people drive. Now I am building the digital architecture people think with.",
    imageLabel: "Visual 03 — Command hangar horizon",
    silhouetteType: "b2",
  },
];

const Founder = () => {
  const [scrollY, setScrollY] = useState(0);

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
    <div className="founder-page page-atmosphere mx-auto max-w-5xl px-6 pb-28 pt-40 sm:px-8">
      <div className="founder-page__grid">
        <div className="founder-page__main">
          <article className="founder-story">
            <header className="founder-story__intro">
              <p className="founder-story__eyebrow">Founder Field Brief</p>
              <h1 className="founder-story__title">Architecture of Thought</h1>
              <p className="founder-story__lede">
                Ameer Karim on structure, discipline, and the hangar he is building for the way people
                think.
              </p>
            </header>

            {ARCHITECTURE_OF_THOUGHT.map((section) => (
              <section key={section.heading} className="founder-story__section">
                <h2 className="founder-story__heading">{section.heading}</h2>
                <p className="founder-story__body">{section.paragraph}</p>

                <figure className="founder-story__visual">
                  <div className="founder-story__visual-frame founder-story__visual-frame--vector">
                    <div className="founder-story__vector-stage" aria-hidden>
                      <AircraftIcon
                        aircraftType={section.silhouetteType}
                        accentId={`founder-visual-${section.heading.replace(/\s+/g, "-").toLowerCase()}`}
                        className="founder-story__vector-silhouette"
                      />
                    </div>
                  </div>
                  <figcaption className="founder-story__visual-caption">{section.imageLabel}</figcaption>
                </figure>
              </section>
            ))}
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
                  className="founder-social__link"
                  aria-label="USJet on Instagram (usjet)"
                >
                  <Instagram size={26} strokeWidth={1.35} className="founder-social__icon" />
                </a>
                <a
                  href={USJET_SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-social__link"
                  aria-label="USJet on Facebook (usjets)"
                >
                  <Facebook size={26} strokeWidth={1.35} className="founder-social__icon" />
                </a>
                <a
                  href={USJET_SOCIAL.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-social__link"
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
