import { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AircraftIcon from "../icons/AircraftIcons";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import type { FleetAircraftType } from "../../types/fleet";

type CardVariant = "past" | "present" | "future";

type FeatureCard = {
  id: string;
  variant: CardVariant;
  era: string;
  title: string;
  tagline: string;
  blurb: string;
  imageSrc: string;
  imageAlt: string;
  silhouetteType: FleetAircraftType;
  to: string;
  hash?: string;
  tintClass: string;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "past-1995",
    variant: "past",
    era: "The Past · 1995",
    title: "The Grit",
    tagline: "Shop floor before the cloud",
    blurb: "Grease, torque, and Queens hustle — the armored vault of origin.",
    imageSrc: "/founder/IMG_0516.jpeg",
    imageAlt: "1995 Origin — cinematic grit panel",
    silhouetteType: "c130",
    to: "/founder-special-1995",
    hash: "#grit-story",
    tintClass: "glass-tint-gold",
  },
  {
    id: "present-fleet",
    variant: "present",
    era: "The Present · Fleet",
    title: "The Machine",
    tagline: "Thirty AIs, one hangar",
    blurb: "Wrenches networked into sovereign cockpits — the fleet is live.",
    imageSrc: "/founder/IMG_0517.jpeg",
    imageAlt: "The Fleet — cinematic machine panel",
    silhouetteType: "f35",
    to: "/hangar",
    tintClass: "glass-tint-cyan",
  },
  {
    id: "future-dynasty",
    variant: "future",
    era: "The Future · King Karim",
    title: "The Dynasty",
    tagline: "Third generation command",
    blurb: "Line of succession sealed — the heir inherits the warp tunnel.",
    imageSrc: "/founder/IMG_0518.jpeg",
    imageAlt: "King Karim — dynasty future panel",
    silhouetteType: "b2",
    to: "/founder-special-1995",
    hash: "#king-karim",
    tintClass: "founder-1995-feature-card__tint--violet",
  },
];

type Ripple = { id: number; x: number; y: number };

function Founder1995FeatureCard({ card }: { card: FeatureCard }) {
  const navigate = useNavigate();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [brokenImage, setBrokenImage] = useState(false);
  const rippleSeq = useRef(0);

  const destination = card.hash ? `${card.to}${card.hash}` : card.to;

  const handleNavigate = useCallback(() => {
    if (card.hash && window.location.pathname === card.to) {
      const target = document.querySelector(card.hash);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", destination);
      return;
    }
    navigate(destination);
  }, [card.hash, card.to, destination, navigate]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = ++rippleSeq.current;
      setRipples((prev) => [...prev, { id, x, y }]);

      window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
        handleNavigate();
      }, 420);
    },
    [handleNavigate],
  );

  const showPhoto = !brokenImage;

  return (
    <Link
      to={destination}
      onClick={handleClick}
      className={[
        "founder-1995-feature-card",
        `founder-1995-feature-card--${card.variant}`,
        "glass-effect-interactive",
      ].join(" ")}
      aria-label={`${card.era}: ${card.title} — ${card.tagline}`}
    >
      <GlassEffectContainer
        className={[
          "founder-1995-feature-card__glass",
          "glass-effect",
          "glass-effect--rounded-rect",
          "liquid-glass-background",
          card.tintClass,
        ].join(" ")}
      >
        <div className="founder-1995-feature-card__scene">
          <div className="founder-1995-feature-card__art" aria-hidden>
            {showPhoto ? (
              <img
                className="founder-1995-feature-card__photo"
                src={card.imageSrc}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setBrokenImage(true)}
              />
            ) : (
              <div className="founder-1995-feature-card__silhouette-stage">
                <AircraftIcon
                  aircraftType={card.silhouetteType}
                  accentId={`founder-1995-card-${card.id}`}
                  className="founder-1995-feature-card__silhouette"
                />
              </div>
            )}
            <span className="founder-1995-feature-card__art-veil" aria-hidden />
            <span className="founder-1995-feature-card__art-rim" aria-hidden />
          </div>

          <div className="founder-1995-feature-card__content">
            <p className="founder-1995-feature-card__era">{card.era}</p>
            <h3 className="founder-1995-feature-card__title">{card.title}</h3>
            <p className="founder-1995-feature-card__tagline">{card.tagline}</p>
            <p className="founder-1995-feature-card__blurb">{card.blurb}</p>
          </div>
        </div>

        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="founder-1995-feature-card__ripple"
            style={{ left: ripple.x, top: ripple.y }}
            aria-hidden
          />
        ))}
      </GlassEffectContainer>
    </Link>
  );
}

export default function Founder1995FeatureGrid() {
  return (
    <section className="founder-1995-feature-grid" aria-label="Grit Vault triptych — Past, Present, Future">
      <p className="founder-1995-feature-grid__kicker">Line of Command</p>
      <h2 className="founder-1995-feature-grid__heading">Past · Present · Dynasty</h2>
      <div className="founder-1995-feature-grid__cards">
        {FEATURE_CARDS.map((card) => (
          <Founder1995FeatureCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
