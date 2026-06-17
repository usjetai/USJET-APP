import { Code2, Star } from "lucide-react";
import {
  getHiredDeveloperHubAvatarPath,
  getHiredDeveloperProductAvatarPath,
  HIRED_HUD_COMMANDER_SLOT,
} from "../../lib/hiredHudDeveloperAvatars";

type HiredHudDeveloperAvatarProps = {
  slot: number;
  name: string;
  /** Tile portrait, hub crew strip, or product page hero. */
  variant?: "tile" | "crew" | "product";
};

export default function HiredHudDeveloperAvatar({
  slot,
  name,
  variant = "tile",
}: HiredHudDeveloperAvatarProps) {
  const src =
    variant === "product"
      ? getHiredDeveloperProductAvatarPath(slot)
      : getHiredDeveloperHubAvatarPath(slot);
  if (!src) {
    return null;
  }

  const isCommander = slot === HIRED_HUD_COMMANDER_SLOT;

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
