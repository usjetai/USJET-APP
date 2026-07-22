type UsjetStarEmblemProps = {
  className?: string;
  /** When true, hides from assistive tech (decorative watermark). */
  decorative?: boolean;
  /** Steel finish for industrial surfaces. */
  variant?: "default" | "steel";
};

/** USJET sovereign star — licensing watermark and brand mark. */
export default function UsjetStarEmblem({
  className = "",
  decorative = true,
  variant = "default",
}: UsjetStarEmblemProps) {
  const gradId = variant === "steel" ? "usjet-star-grad-steel" : "usjet-star-grad";
  const glowId = variant === "steel" ? "usjet-star-glow-steel" : "usjet-star-glow";
  const coreStroke = variant === "steel" ? "rgba(148, 163, 184, 0.55)" : "rgba(103,232,249,0.45)";

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={decorative}
      role={decorative ? undefined : "img"}
    >
      <defs>
        <linearGradient id="usjet-star-grad" x1="12" y1="8" x2="108" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="0.45" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="usjet-star-grad-steel" x1="12" y1="8" x2="108" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94a3b8" />
          <stop offset="0.45" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <filter id="usjet-star-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="usjet-star-glow-steel" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points="60,6 74,42 112,42 82,64 92,102 60,80 28,102 38,64 8,42 46,42"
        fill={`url(#${gradId})`}
        filter={`url(#${glowId})`}
      />
      <circle cx="60" cy="58" r="8" fill="rgba(2,8,23,0.55)" stroke={coreStroke} strokeWidth="1.5" />
    </svg>
  );
}
