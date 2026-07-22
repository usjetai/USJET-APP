import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { FLEET_UNIT_COUNT } from "../../types/fleet";

const ORIGIN_FEED_SRC = "/origin/origin-character.mp4";
const ORIGIN_FEED_POSTER = "/origin/origin-character-poster.png";

const ORIGIN_INTRO_STATS = [
  `${FLEET_UNIT_COUNT} AI units`,
  "One cockpit",
  "Stripe-only clearance",
] as const;

/**
 * Origin's briefing box on the Hangar home — a live cockpit feed of Origin
 * presenting the usjet.ai holo-panel (from the launch video), standing by to assist.
 */
export default function OriginHangarIntro() {
  const feedRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = feedRef.current;
    if (!video) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (media.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {});
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <motion.section
      className="origin-hangar-intro"
      aria-labelledby="origin-hangar-intro-heading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.5, ease: "easeOut" }}
    >
      <GlassEffectContainer className="origin-hangar-intro__container glass-effect-container">
        <div className="origin-hangar-intro__panel liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan">
          <div className="origin-hangar-intro__feed-frame">
            <video
              ref={feedRef}
              className="origin-hangar-intro__feed"
              src={ORIGIN_FEED_SRC}
              poster={ORIGIN_FEED_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Origin live — USJET android command unit"
            />
            <span className="origin-hangar-intro__feed-scan" aria-hidden />
            <span className="origin-hangar-intro__feed-badge" aria-hidden>
              <span className="origin-hangar-intro__signal" />
              Live · Origin on deck
            </span>
          </div>

          <div className="origin-hangar-intro__body">
            <p className="origin-hangar-intro__kicker">Origin · Voice of the Fleet</p>
            <h2 id="origin-hangar-intro-heading" className="origin-hangar-intro__title">
              This is <span className="origin-hangar-intro__title-brand">USJET.AI</span>
            </h2>
            <p className="origin-hangar-intro__copy">
              One sovereign cockpit for America&apos;s labor force. {FLEET_UNIT_COUNT} live AI units
              sit docked in this hangar — open a bay and the tool works right here in your
              workbench, no new tabs, no leaks. I&apos;m Origin, the intelligence that flies the
              deck with you: training in AI-101, market watch on Intel, and command support at
              Enterprise clearance.
            </p>
            <p className="origin-hangar-intro__status" role="status">
              Standing by — ready to assist
              <span className="origin-hangar-intro__status-dots" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </p>
            <p className="origin-hangar-intro__face">
              Face to face on Origin — USJET android presence, mic live, spoken replies.
            </p>
            <div className="origin-hangar-intro__stats" aria-label="USJET.AI at a glance">
              {ORIGIN_INTRO_STATS.map((stat) => (
                <span key={stat} className="origin-hangar-intro__stat">
                  {stat}
                </span>
              ))}
            </div>
            <div className="origin-hangar-intro__actions">
              <Link
                to="/origin"
                className="origin-hangar-intro__cta btn-glass glass-effect-interactive glass-tint-cyan"
              >
                Talk to Origin face to face
              </Link>
              <Link to="/ai-101" className="origin-hangar-intro__secondary glass-effect-interactive">
                New to the fleet? Start AI-101
              </Link>
            </div>
          </div>
        </div>
      </GlassEffectContainer>
    </motion.section>
  );
}
