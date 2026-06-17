import { HIRED_HUD_RADIO_FOUNDER } from "../../data/hiredHudRadioChat";

type FounderGodRadioIconProps = {
  className?: string;
  imgClassName?: string;
  size?: number;
  variant?: "log" | "roster";
};

export default function FounderGodRadioIcon({
  className = "",
  imgClassName = "",
  size = 40,
  variant = "log",
}: FounderGodRadioIconProps) {
  return (
    <span
      className={["hired-hud__founder-god-icon", `hired-hud__founder-god-icon--${variant}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={HIRED_HUD_RADIO_FOUNDER.avatarPath}
        alt=""
        className={["hired-hud__founder-god-icon-img", imgClassName].filter(Boolean).join(" ")}
        width={size}
        height={size}
        decoding="async"
        draggable={false}
      />
      <span className="hired-hud__founder-god-crucifix" aria-hidden>
        <svg viewBox="0 0 24 32" className="hired-hud__founder-god-crucifix-svg" role="img">
          <title>Crucifix</title>
          <rect x="10.25" y="1.5" width="3.5" height="29" rx="0.75" />
          <rect x="4" y="7.5" width="16" height="3.5" rx="0.75" />
        </svg>
      </span>
    </span>
  );
}
