import { useId } from "react";

/** Star emblem + key silhouette — 3D-style rotate on hover (CSS). */
export default function GamingFounderKeyEmblem() {
  const gid = useId().replace(/:/g, "");

  return (
    <div className="gaming-founder-key" aria-hidden>
      <div className="gaming-founder-key__stage">
        <div className="gaming-founder-key__star">
          <svg viewBox="0 0 120 120" fill="none" className="gaming-founder-key__star-svg">
            <defs>
              <linearGradient id={`gaming-key-star-grad-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fae8ff" />
                <stop offset="45%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#gaming-key-star-grad-${gid})`}
              stroke="rgba(250, 250, 250, 0.35)"
              strokeWidth="1.2"
              d="M60 8l14.2 40.4h42.5L81.4 74.6l14.2 40.4L60 88.7 24.4 115l14.2-40.4L3.3 48.4h42.5L60 8z"
            />
          </svg>
        </div>
        <div className="gaming-founder-key__shaft" />
        <div className="gaming-founder-key__bow" />
      </div>
      <span className="gaming-founder-key__label">Entry key</span>
    </div>
  );
}
