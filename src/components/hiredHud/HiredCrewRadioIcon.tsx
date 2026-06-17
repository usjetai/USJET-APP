type HiredCrewRadioIconProps = {
  src: string;
  slot: number;
  className?: string;
  imgClassName?: string;
  size?: number;
  variant?: "log" | "roster";
};

export type CrewRadioKissTone = "pink" | "red";

export function crewRadioKissTone(slot: number): CrewRadioKissTone {
  return slot % 2 === 0 ? "pink" : "red";
}

export default function HiredCrewRadioIcon({
  src,
  slot,
  className = "",
  imgClassName = "",
  size = 40,
  variant = "log",
}: HiredCrewRadioIconProps) {
  const kissTone = crewRadioKissTone(slot);

  return (
    <span
      className={[
        "hired-hud__crew-radio-icon",
        `hired-hud__crew-radio-icon--${variant}`,
        `hired-hud__crew-radio-icon--${kissTone}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={src}
        alt=""
        className={["hired-hud__crew-radio-icon-img", imgClassName].filter(Boolean).join(" ")}
        width={size}
        height={size}
        decoding="async"
        draggable={false}
      />
      <span className="hired-hud__crew-radio-kiss" aria-hidden>
        <svg viewBox="0 0 24 24" className="hired-hud__crew-radio-kiss-svg" role="img">
          <title>Kiss</title>
          <path d="M12 21.75C6.35 17.05 2.75 13.35 2.75 9.15 2.75 5.75 5.45 3.25 8.35 3.25c1.95 0 3.2 1 3.65 2.15.45-1.15 1.7-2.15 3.65-2.15 2.9 0 5.6 2.5 5.6 5.9 0 4.2-3.6 7.9-9.25 12.6Z" />
          <path
            d="M8.2 11.2c.55.45 1.15.7 1.85.7.55 0 1.05-.15 1.5-.45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </span>
    </span>
  );
}
