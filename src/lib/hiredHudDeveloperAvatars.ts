/** Female profile avatars for hired developer bays on `/hired-hud`. */
export type HiredDeveloperAvatar = {
  slot: number;
  slug: string;
  label: string;
  path: string;
  portrait: number;
};

export const HIRED_DEVELOPER_AVATARS: readonly HiredDeveloperAvatar[] = [
  { slot: 0, slug: "blue-ivy", label: "Blue Ivy", portrait: 1, path: "/hired-hud/avatars/bay-01-blue-ivy.webp" },
  { slot: 1, slug: "mary-stealth", label: "Mary Stealth", portrait: 2, path: "/hired-hud/avatars/bay-02-mary-stealth.webp" },
  { slot: 2, slug: "chop", label: "Chop", portrait: 3, path: "/hired-hud/avatars/bay-03-chop.webp" },
  { slot: 4, slug: "grok-developer", label: "Grok Developer", portrait: 4, path: "/hired-hud/avatars/bay-05-grok-developer.webp" },
  { slot: 5, slug: "aaliyah", label: "Aaliyah", portrait: 5, path: "/hired-hud/avatars/bay-06-aaliyah.webp" },
  { slot: 7, slug: "luma-dream", label: "Luma Dream", portrait: 6, path: "/hired-hud/avatars/bay-08-luma-dream.webp" },
  { slot: 8, slug: "sora-developer", label: "Sora Developer", portrait: 7, path: "/hired-hud/avatars/bay-09-sora-developer.webp" },
  { slot: 10, slug: "rumi", label: "Rumi", portrait: 8, path: "/hired-hud/avatars/bay-11-rumi.webp" },
  { slot: 11, slug: "kitkat", label: "Kitkat", portrait: 9, path: "/hired-hud/avatars/bay-12-kitkat.webp" },
  { slot: 12, slug: "firefly-developer", label: "Firefly Developer", portrait: 10, path: "/hired-hud/avatars/bay-13-firefly-developer.webp" },
  { slot: 19, slug: "heygen-developer", label: "HeyGen Developer", portrait: 1, path: "/hired-hud/avatars/bay-20-heygen-developer.webp" },
  { slot: 20, slug: "v0-developer", label: "v0 Developer", portrait: 2, path: "/hired-hud/avatars/bay-21-v0-developer.webp" },
  { slot: 22, slug: "copilot-developer", label: "Copilot Developer", portrait: 3, path: "/hired-hud/avatars/bay-23-copilot-developer.webp" },
  { slot: 23, slug: "consensus-developer", label: "Consensus Developer", portrait: 4, path: "/hired-hud/avatars/bay-24-consensus-developer.webp" },
  { slot: 24, slug: "gamma-developer", label: "Gamma Developer", portrait: 5, path: "/hired-hud/avatars/bay-25-gamma-developer.webp" },
  { slot: 27, slug: "otter-developer", label: "Otter Developer", portrait: 6, path: "/hired-hud/avatars/bay-28-otter-developer.webp" },
] as const;

const AVATAR_BY_SLOT = new Map(HIRED_DEVELOPER_AVATARS.map((avatar) => [avatar.slot, avatar]));

export function getHiredDeveloperAvatar(slot: number): HiredDeveloperAvatar | undefined {
  return AVATAR_BY_SLOT.get(slot);
}

export function getHiredDeveloperAvatarPath(slot: number, _developerName: string): string | undefined {
  return getHiredDeveloperAvatar(slot)?.path;
}
