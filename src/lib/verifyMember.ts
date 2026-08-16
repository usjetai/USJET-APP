import type { MemberSession, VerifyMemberResponse } from "../types/member";

const VERIFY_URL = import.meta.env.VITE_MEMBER_VERIFY_URL ?? "/api/verify-member";

type VerifyInput = {
  memberId?: string;
  email?: string;
};

export async function verifyMemberAccess(input: VerifyInput): Promise<MemberSession> {
  const memberId = input.memberId?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";

  if (!memberId && !email) {
    throw new Error("Enter your Member ID.");
  }

  // Local dev convenience only — Vite strips this block from production builds
  // entirely (import.meta.env.DEV is compiled to false), so it never ships.
  if (import.meta.env.DEV) {
    const demoId = import.meta.env.VITE_MEMBER_DEMO_ID ?? "cus_usjet_demo";
    if (memberId === demoId || email === "founder@usjet.ai") {
      return {
        customerId: memberId || demoId,
        email: email || undefined,
        tier: "USJET-PRIME-ACTIVE",
        active: true,
        verifiedAt: new Date().toISOString(),
      };
    }
  }

  // Every real session comes from here — a live, server-side Stripe lookup that
  // requires the Member ID and billing email to both match the same customer.
  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId: memberId || undefined,
      email: email || undefined,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Member verification failed.");
  }

  const data = (await response.json()) as VerifyMemberResponse;

  return {
    customerId: data.customerId,
    name: data.name,
    email: data.email ?? (email || undefined),
    tier: data.tier,
    active: data.active,
    verifiedAt: new Date().toISOString(),
    stripeTier: data.stripeTier,
    accessLevel: data.accessLevel,
    legacyId: data.legacyId,
  };
}
