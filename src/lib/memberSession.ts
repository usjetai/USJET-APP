import type { MemberSession } from "../types/member";

const STORAGE_KEY = "usjet_member_session";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function readMemberSession(): MemberSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as MemberSession;
    if (!parsed?.customerId || !parsed.verifiedAt) {
      return null;
    }

    const age = Date.now() - new Date(parsed.verifiedAt).getTime();
    if (age > SESSION_MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeMemberSession(session: MemberSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearMemberSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
