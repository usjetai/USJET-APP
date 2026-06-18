const STORAGE_KEY = "usjet-hired-hud-tile-favorites";

type TileFavoritesStore = {
  favorites: Record<number, boolean>;
};

export function loadHiredHudTileFavorites(slots: number[]): Record<number, boolean> {
  const favorites: Record<number, boolean> = Object.fromEntries(slots.map((slot) => [slot, false]));

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return favorites;
    }

    const parsed = JSON.parse(raw) as TileFavoritesStore;
    if (!parsed.favorites) {
      return favorites;
    }

    for (const slot of slots) {
      favorites[slot] = Boolean(parsed.favorites[slot]);
    }
  } catch {
    // Ignore corrupt storage.
  }

  return favorites;
}

export function saveHiredHudTileFavorites(favorites: Record<number, boolean>): void {
  const payload: TileFavoritesStore = { favorites };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage may be unavailable in private mode.
  }
}

export function toggleHiredHudTileFavorite(
  favorites: Record<number, boolean>,
  slot: number,
): Record<number, boolean> {
  return {
    ...favorites,
    [slot]: !favorites[slot],
  };
}
