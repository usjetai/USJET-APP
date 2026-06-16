import { getHiredDeveloperAvatarPath } from "../../lib/hiredHudDeveloperAvatars";

type HiredHudDeveloperAvatarProps = {
  slot: number;
  name: string;
  /** Tile portrait vs compact hub crew strip. */
  variant?: "tile" | "crew";
};

export default function HiredHudDeveloperAvatar({
  slot,
  name,
  variant = "tile",
}: HiredHudDeveloperAvatarProps) {
  const src = getHiredDeveloperAvatarPath(slot, name);
  if (!src) {
    return null;
  }

  return (
    <div
      className={[
        "hired-hud__avatar",
        variant === "crew" ? "hired-hud__avatar--crew" : "hired-hud__avatar--tile",
      ].join(" ")}
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
