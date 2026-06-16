import { getHiredDeveloperAvatarPath, getHiredDeveloperProductAvatarPath } from "../../lib/hiredHudDeveloperAvatars";

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
    variant === "product" ? getHiredDeveloperProductAvatarPath(slot) : getHiredDeveloperAvatarPath(slot);
  if (!src) {
    return null;
  }

  return (
    <div
      className={[
        "hired-hud__avatar",
        variant === "crew" ? "hired-hud__avatar--crew" : "",
        variant === "product" ? "hired-hud__avatar--product" : "hired-hud__avatar--tile",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={src}
        alt={`${name} profile`}
        className="hired-hud__avatar-img"
        width={256}
        height={256}
        decoding="async"
        draggable={false}
      />
      <span className="hired-hud__avatar-ring" aria-hidden />
    </div>
  );
}
