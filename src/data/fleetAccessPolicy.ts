import type { MemberSession } from "../types/member";
import { isFounderGodMode, memberClearanceRank } from "../lib/memberAccessLevel";

/** Public Fleet runway: first six AI bays open; the rest unlock after Flight Pass checkout + verification. */
export const PUBLIC_FLEET_UNLOCKED_COUNT = 6 as const;

export function isPublicFleetSlot(slot: number): boolean {
  return slot >= 0 && slot < PUBLIC_FLEET_UNLOCKED_COUNT;
}

export function hasFullFleetAccess(session: MemberSession | null | undefined): boolean {
  return isFounderGodMode(session) || memberClearanceRank(session) >= 1;
}

export function isFleetSlotLocked(slot: number, session: MemberSession | null | undefined): boolean {
  return !isPublicFleetSlot(slot) && !hasFullFleetAccess(session);
}
