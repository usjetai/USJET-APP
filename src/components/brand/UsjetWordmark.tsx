type UsjetWordmarkProps = {
  className?: string;
  /** Nav-sized vs hero-sized */
  size?: "nav" | "hero";
  glow?: boolean;
};

/**
 * High-fidelity chiseled stone wordmark — Audiowide base with engraved depth + throttle glow.
 */
export default function UsjetWordmark({ className = "", size = "nav", glow = true }: UsjetWordmarkProps) {
  return (
    <span
      className={[
        "usjet-logo-stone",
        size === "hero" ? "usjet-logo-stone--hero" : "usjet-logo-stone--nav",
        glow ? "usjet-logo-stone--glow" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      USJET<span className="usjet-logo-stone__ai">.AI</span>
    </span>
  );
}
