/** Female profile avatars for hired developer bays on `/hired-hud` and product pages. */
export type HiredDeveloperAvatar = {
  slot: number;
  slug: string;
  label: string;
  path: string;
  productPath: string;
  portrait: number;
  aircraftSlug: string;
};

/** Ten sovereign hired developers — portrait sheet mapping. */
export const HIRED_DEVELOPER_AVATARS: readonly HiredDeveloperAvatar[] = [
  { slot: 0, slug: "blue-ivy", label: "Blue Ivy", portrait: 1, aircraftSlug: "sr-71-blackbird", path: "/hired-hud/avatars/bay-01-blue-ivy.webp", productPath: "/fleet/developer-avatars/sr-71-blackbird.webp" },
  { slot: 1, slug: "mary-stealth", label: "Mary Stealth", portrait: 2, aircraftSlug: "f-35-lightning-ii", path: "/hired-hud/avatars/bay-02-mary-stealth.webp", productPath: "/fleet/developer-avatars/f-35-lightning-ii.webp" },
  { slot: 2, slug: "chop", label: "Chop", portrait: 3, aircraftSlug: "b-21-raider", path: "/hired-hud/avatars/bay-03-chop.webp", productPath: "/fleet/developer-avatars/b-21-raider.webp" },
  { slot: 3, slug: "stick", label: "Stick", portrait: 4, aircraftSlug: "j-36", path: "/hired-hud/avatars/bay-04-stick.webp", productPath: "/fleet/developer-avatars/j-36.webp" },
  { slot: 25, slug: "christal", label: "Christal", portrait: 5, aircraftSlug: "f-14-tomcat", path: "/hired-hud/avatars/bay-26-christal.webp", productPath: "/fleet/developer-avatars/f-14-tomcat.webp" },
  { slot: 5, slug: "aaliyah", label: "Aaliyah", portrait: 6, aircraftSlug: "yf-23-black-widow-ii", path: "/hired-hud/avatars/bay-06-aaliyah.webp", productPath: "/fleet/developer-avatars/yf-23-black-widow-ii.webp" },
  { slot: 6, slug: "little-mama", label: "Little Mama", portrait: 7, aircraftSlug: "x-47b", path: "/hired-hud/avatars/bay-07-little-mama.webp", productPath: "/fleet/developer-avatars/x-47b.webp" },
  { slot: 13, slug: "light-speed", label: "Light Speed", portrait: 8, aircraftSlug: "f-22-raptor", path: "/hired-hud/avatars/bay-14-light-speed.webp", productPath: "/fleet/developer-avatars/f-22-raptor.webp" },
  { slot: 11, slug: "kitkat", label: "Kitkat", portrait: 9, aircraftSlug: "b-1-lancer", path: "/hired-hud/avatars/bay-12-kitkat.webp", productPath: "/fleet/developer-avatars/b-1-lancer.webp" },
  { slot: 10, slug: "rumi", label: "Rumi", portrait: 10, aircraftSlug: "b-2-spirit", path: "/hired-hud/avatars/bay-11-rumi.webp", productPath: "/fleet/developer-avatars/b-2-spirit.webp" },
] as const;

const AVATAR_BY_SLOT = new Map(HIRED_DEVELOPER_AVATARS.map((avatar) => [avatar.slot, avatar]));
const AVATAR_BY_AIRCRAFT_SLUG = new Map(HIRED_DEVELOPER_AVATARS.map((avatar) => [avatar.aircraftSlug, avatar]));

export function getHiredDeveloperAvatar(slot: number): HiredDeveloperAvatar | undefined {
  return AVATAR_BY_SLOT.get(slot);
}

export function getHiredDeveloperAvatarPath(slot: number): string | undefined {
  return getHiredDeveloperAvatar(slot)?.path;
}

export function getHiredDeveloperProductAvatarPath(slot: number): string | undefined {
  return getHiredDeveloperAvatar(slot)?.productPath;
}

export function getHiredDeveloperProductAvatarByAircraftSlug(aircraftSlug: string): HiredDeveloperAvatar | undefined {
  return AVATAR_BY_AIRCRAFT_SLUG.get(aircraftSlug);
}
