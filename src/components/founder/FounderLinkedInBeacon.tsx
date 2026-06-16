import { Linkedin } from "lucide-react";

export const FOUNDER_LINKEDIN_URL = "https://linkedin.com/in/usjet/" as const;

type FounderLinkedInBeaconProps = {
  /** Hero placement (large, top-right) vs social row chip */
  variant?: "hero" | "social";
};

/** Glowing LinkedIn portal — founder profile for investors & partners. */
export default function FounderLinkedInBeacon({ variant = "hero" }: FounderLinkedInBeaconProps) {
  const isHero = variant === "hero";

  return (
    <a
      href={FOUNDER_LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "founder-linkedin-beacon",
        isHero ? "founder-linkedin-beacon--hero" : "founder-linkedin-beacon--social",
        "glass-effect-interactive",
      ].join(" ")}
      aria-label="USJET founder on LinkedIn — in/usjet"
      title="LinkedIn · linkedin.com/in/usjet"
    >
      <span className="founder-linkedin-beacon__halo" aria-hidden />
      <span className="founder-linkedin-beacon__orbit" aria-hidden />
      <span className="founder-linkedin-beacon__shine" aria-hidden />
      <span className="founder-linkedin-beacon__icon-wrap" aria-hidden>
        <Linkedin
          className="founder-linkedin-beacon__icon"
          size={isHero ? 28 : 24}
          strokeWidth={isHero ? 1.75 : 1.5}
        />
      </span>
      {isHero ? (
        <span className="founder-linkedin-beacon__copy">
          <span className="founder-linkedin-beacon__label">LinkedIn</span>
          <span className="founder-linkedin-beacon__handle">in/usjet</span>
        </span>
      ) : null}
    </a>
  );
}
