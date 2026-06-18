import { Heart } from "lucide-react";

type HiredHudTileFavoriteButtonProps = {
  name: string;
  isFavorite: boolean;
  onToggle: () => void;
};

/** Per-tile like / favorite toggle — hub developer tiles only. */
export default function HiredHudTileFavoriteButton({
  name,
  isFavorite,
  onToggle,
}: HiredHudTileFavoriteButtonProps) {
  return (
    <button
      type="button"
      className={[
        "hired-hud__tile-favorite",
        "btn-glass",
        "glass-effect-interactive",
        isFavorite ? "hired-hud__tile-favorite--on" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Unlike ${name}` : `Like ${name}`}
      onClick={onToggle}
    >
      <Heart size={15} aria-hidden fill={isFavorite ? "currentColor" : "none"} />
      <span className="hired-hud__tile-favorite-label">{isFavorite ? "Liked" : "Like"}</span>
    </button>
  );
}
