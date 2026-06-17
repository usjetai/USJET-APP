/** VR headset mark — line icon with VR in visor (gaming page + nav). */

type GamingVrIconProps = {
  className?: string;
  variant?: "hero" | "nav" | "badge";
};

export default function GamingVrIcon({ className = "", variant = "hero" }: GamingVrIconProps) {
  const variantClass =
    variant === "nav" ? "gaming-vr-icon--nav" : variant === "badge" ? "gaming-vr-icon--badge" : "gaming-vr-icon--hero";

  return (
    <svg
      className={["gaming-vr-icon", variantClass, className].filter(Boolean).join(" ")}
      viewBox="0 0 120 72"
      fill="none"
      aria-hidden
    >
      <path
        d="M18 28 L18 44 Q18 52 26 54 L54 54 L60 62 L60 54 L88 54 Q96 52 96 44 L96 28 Q96 18 86 16 L34 16 Q24 18 24 28 Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <rect x="52" y="8" width="12" height="6" rx="2" fill="currentColor" />
      <rect x="8" y="30" width="6" height="12" rx="2" fill="currentColor" />
      <rect x="106" y="30" width="6" height="12" rx="2" fill="currentColor" />
      <text
        x="57"
        y="42"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="18"
        fontWeight="800"
        fill="currentColor"
      >
        VR
      </text>
    </svg>
  );
}
