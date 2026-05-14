import type { MemberSession } from "../../types/member";

type MemberPrimeBadgeProps = {
  session?: MemberSession | null;
  compact?: boolean;
  /** Founder review — gate open without Stripe session */
  founderReviewOpen?: boolean;
};

export default function MemberPrimeBadge({
  session,
  compact = false,
  founderReviewOpen = false,
}: MemberPrimeBadgeProps) {
  const active = session?.active && session.tier === "USJET-PRIME-ACTIVE";
  const displayActive = active || founderReviewOpen;

  return (
    <div className={["usjet-prime-badge", compact ? "usjet-prime-badge--compact" : ""].filter(Boolean).join(" ")}>
      <p className="usjet-prime-badge__label">Member ID Status</p>
      <p
        className={[
          "usjet-prime-badge__status",
          displayActive ? "usjet-prime-badge__status--active" : "usjet-prime-badge__status--locked",
        ].join(" ")}
      >
        {active
          ? (session?.tier ?? "USJET-PRIME-ACTIVE")
          : founderReviewOpen
            ? "FOUNDER REVIEW · OPEN"
            : "ACCESS LOCKED"}
      </p>
      {active && session?.customerId ? (
        <p className="usjet-prime-badge__id">{session.customerId}</p>
      ) : null}
    </div>
  );
}
