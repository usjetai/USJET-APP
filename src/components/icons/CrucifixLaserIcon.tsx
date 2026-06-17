type CrucifixLaserIconProps = {
  className?: string;
};

/** Latin cross — laser beams are rendered full-viewport in CrucifixLaserCrown. */
export default function CrucifixLaserIcon({ className = "" }: CrucifixLaserIconProps) {
  return (
    <svg
      className={["crucifix-laser-icon", className].filter(Boolean).join(" ")}
      viewBox="0 0 120 72"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id="crucifix-wood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a574" />
          <stop offset="50%" stopColor="#a16207" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
      </defs>

      <g className="crucifix-laser-icon__cross">
        <rect x="53" y="10" width="14" height="54" rx="2" fill="url(#crucifix-wood)" stroke="#fcd34d" strokeWidth="0.6" />
        <rect x="28" y="26" width="64" height="12" rx="2" fill="url(#crucifix-wood)" stroke="#fcd34d" strokeWidth="0.6" />
        <rect x="56" y="12" width="8" height="8" rx="1" fill="#fde68a" opacity="0.35" />
      </g>
    </svg>
  );
}
