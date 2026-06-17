import { Code2, Star } from "lucide-react";
import {
  getHiredDeveloperHubAvatarPath,
  getHiredDeveloperProductAvatarPath,
  getHiredDeveloperRideAvatarPath,
  HIRED_HUD_COMMANDER_SLOT,
} from "../../lib/hiredHudDeveloperAvatars";

type HiredHudDeveloperAvatarProps = {
  slot: number;
  name: string;
  /** Tile portrait, hub crew strip, or product page hero. */
  variant?: "tile" | "crew" | "product";
};

function AvatarPanel({
  src,
  name,
  label,
  rounded,
}: {
  src: string;
  name: string;
  label: string;
  rounded?: boolean;
}) {
  return (
    <div
      className={[
        "hired-hud__avatar-panel",
        rounded ? "" : "hired-hud__avatar-panel--hub-rect",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={src}
        alt={`${name} ${label}`}
        className="hired-hud__avatar-img"
        width={256}
        height={427}
        decoding="async"
        draggable={false}
      />
      <span className="hired-hud__avatar-ring" aria-hidden />
    </div>
  );
}

export default function HiredHudDeveloperAvatar({
  slot,
  name,
  variant = "tile",
}: HiredHudDeveloperAvatarProps) {
  const hubSrc = getHiredDeveloperHubAvatarPath(slot);
  const rideSrc = getHiredDeveloperRideAvatarPath(slot);
  const productSrc = getHiredDeveloperProductAvatarPath(slot);
  const isCommander = slot === HIRED_HUD_COMMANDER_SLOT;

  if (variant === "tile") {
    if (!hubSrc && !rideSrc) {
      return null;
    }

    return (
      <div className="hired-hud__avatar hired-hud__avatar--tile hired-hud__avatar--dual-tile">
        {hubSrc ? <AvatarPanel src={hubSrc} name={name} label="profile" /> : null}
        {rideSrc ? <AvatarPanel src={rideSrc} name={name} label="ride" /> : null}
      </div>
    );
  }

  const src = variant === "product" ? productSrc : hubSrc;
  if (!src) {
    return null;
  }

  return (
    <div
      className={[
        "hired-hud__avatar",
        variant === "crew" ? "hired-hud__avatar--crew" : "",
        variant === "product" ? "hired-hud__avatar--product" : "hired-hud__avatar--tile",
        variant === "product" ? "" : "hired-hud__avatar--hub-rect",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={src}
        alt={`${name} profile`}
        className="hired-hud__avatar-img"
        width={variant === "product" ? 256 : 512}
        height={variant === "product" ? 256 : 854}
        decoding="async"
        draggable={false}
      />
      {variant === "crew" ? (
        <div className="hired-hud__hub-badges">
          {isCommander ? (
            <span
              className="hired-hud__captain-badge hired-hud__captain-badge--commander"
              aria-label="Jet Fighter Commander"
            >
              <Star size={9} aria-hidden />
              Commander
            </span>
          ) : null}
          <span className="hired-hud__captain-badge hired-hud__captain-badge--developer" aria-label="Hired developer">
            <Code2 size={9} aria-hidden />
            Developer
          </span>
        </div>
      ) : null}
      <span className="hired-hud__avatar-ring" aria-hidden />
    </div>
  );
}
