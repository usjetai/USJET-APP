/** Female profile avatars for hired developer bays on `/hired-hud` and product pages. */
export type HiredDeveloperAvatar = {
  slot: number;
  slug: string;
  label: string;
  path: string;
  hubPath: string;
  ridePath: string;
  productPath: string;
  fleetCockpitPath: string;
  portrait: number;
  aircraftSlug: string;
};

/** Ten sovereign hired developers — portrait sheet mapping (rectangles 1–10). */
export const HIRED_DEVELOPER_AVATARS: readonly HiredDeveloperAvatar[] = [
  { slot: 0, slug: "blue-ivy", label: "Blue Ivy", portrait: 1, aircraftSlug: "sr-71-blackbird", path: "/hired-hud/avatars/bay-01-blue-ivy.webp", hubPath: "/hired-hud/avatars/bay-01-blue-ivy-hub.webp", ridePath: "/hired-hud/avatars/bay-01-blue-ivy-ride.webp", productPath: "/fleet/developer-avatars/sr-71-blackbird.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-01-blue-ivy.webp" },
  { slot: 1, slug: "mary-stealth", label: "Mary Stealth", portrait: 2, aircraftSlug: "f-35-lightning-ii", path: "/hired-hud/avatars/bay-02-mary-stealth.webp", hubPath: "/hired-hud/avatars/bay-02-mary-stealth-hub.webp", ridePath: "/hired-hud/avatars/bay-02-mary-stealth-ride.webp", productPath: "/fleet/developer-avatars/f-35-lightning-ii.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-02-mary-stealth.webp" },
  { slot: 2, slug: "chop", label: "Chop", portrait: 3, aircraftSlug: "b-21-raider", path: "/hired-hud/avatars/bay-03-chop.webp", hubPath: "/hired-hud/avatars/bay-03-chop-hub.webp", ridePath: "/hired-hud/avatars/bay-03-chop-ride.webp", productPath: "/fleet/developer-avatars/b-21-raider.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-03-chop.webp" },
  { slot: 3, slug: "stick", label: "Stick", portrait: 4, aircraftSlug: "j-36", path: "/hired-hud/avatars/bay-04-stick.webp", hubPath: "/hired-hud/avatars/bay-04-stick-hub.webp", ridePath: "/hired-hud/avatars/bay-04-stick-ride.webp", productPath: "/fleet/developer-avatars/j-36.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-04-stick.webp" },
  { slot: 25, slug: "christal", label: "Christal", portrait: 5, aircraftSlug: "f-14-tomcat", path: "/hired-hud/avatars/bay-26-christal.webp", hubPath: "/hired-hud/avatars/bay-26-christal-hub.webp", ridePath: "/hired-hud/avatars/bay-26-christal-ride.webp", productPath: "/fleet/developer-avatars/f-14-tomcat.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-26-christal.webp" },
  { slot: 5, slug: "aaliyah", label: "Aaliyah", portrait: 6, aircraftSlug: "yf-23-black-widow-ii", path: "/hired-hud/avatars/bay-06-aaliyah.webp", hubPath: "/hired-hud/avatars/bay-06-aaliyah-hub.webp", ridePath: "/hired-hud/avatars/bay-06-aaliyah-ride.webp", productPath: "/fleet/developer-avatars/yf-23-black-widow-ii.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-06-aaliyah.webp" },
  { slot: 6, slug: "little-mama", label: "Little Mama", portrait: 7, aircraftSlug: "x-47b", path: "/hired-hud/avatars/bay-07-little-mama.webp", hubPath: "/hired-hud/avatars/bay-07-little-mama-hub.webp", ridePath: "/hired-hud/avatars/bay-07-little-mama-ride.webp", productPath: "/fleet/developer-avatars/x-47b.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-07-little-mama.webp" },
  { slot: 13, slug: "light-speed", label: "Light Speed", portrait: 8, aircraftSlug: "f-22-raptor", path: "/hired-hud/avatars/bay-14-light-speed.webp", hubPath: "/hired-hud/avatars/bay-14-light-speed-hub.webp", ridePath: "/hired-hud/avatars/bay-14-light-speed-ride.webp", productPath: "/fleet/developer-avatars/f-22-raptor.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-14-light-speed.webp" },
  { slot: 11, slug: "kitkat", label: "Kitkat", portrait: 9, aircraftSlug: "b-1-lancer", path: "/hired-hud/avatars/bay-12-kitkat.webp", hubPath: "/hired-hud/avatars/bay-12-kitkat-hub.webp", ridePath: "/hired-hud/avatars/bay-12-kitkat-ride.webp", productPath: "/fleet/developer-avatars/b-1-lancer.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-12-kitkat.webp" },
  { slot: 10, slug: "rumi", label: "Rumi", portrait: 10, aircraftSlug: "b-2-spirit", path: "/hired-hud/avatars/bay-11-rumi.webp", hubPath: "/hired-hud/avatars/bay-11-rumi-hub.webp", ridePath: "/hired-hud/avatars/bay-11-rumi-ride.webp", productPath: "/fleet/developer-avatars/b-2-spirit.webp", fleetCockpitPath: "/fleet/hired-developer-cockpits/bay-11-rumi.webp" },
] as const;

/** Blue Ivy — fleet commander rank badge in the Hired HUD hub. */
export const HIRED_HUD_COMMANDER_SLOT = 0;

const AVATAR_BY_SLOT = new Map(HIRED_DEVELOPER_AVATARS.map((avatar) => [avatar.slot, avatar]));
const AVATAR_BY_AIRCRAFT_SLUG = new Map(HIRED_DEVELOPER_AVATARS.map((avatar) => [avatar.aircraftSlug, avatar]));

export function getHiredDeveloperAvatar(slot: number): HiredDeveloperAvatar | undefined {
  return AVATAR_BY_SLOT.get(slot);
}

export function getHiredDeveloperAvatarPath(slot: number): string | undefined {
  return getHiredDeveloperAvatar(slot)?.path;
}

export function getHiredDeveloperHubAvatarPath(slot: number): string | undefined {
  return getHiredDeveloperAvatar(slot)?.hubPath;
}

export function getHiredDeveloperRideAvatarPath(slot: number): string | undefined {
  return getHiredDeveloperAvatar(slot)?.ridePath;
}

export function getHiredDeveloperProductAvatarPath(slot: number): string | undefined {
  return getHiredDeveloperAvatar(slot)?.productPath;
}

export function getHiredDeveloperFleetCockpitPath(slot: number): string | undefined {
  return getHiredDeveloperAvatar(slot)?.fleetCockpitPath;
}

export function getHiredDeveloperProductAvatarByAircraftSlug(aircraftSlug: string): HiredDeveloperAvatar | undefined {
  return AVATAR_BY_AIRCRAFT_SLUG.get(aircraftSlug);
}
