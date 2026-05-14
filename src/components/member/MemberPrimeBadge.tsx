import type { MemberSession } from "../../types/member";

type MemberPrimeBadgeProps = {
  session?: MemberSession | null;
  compact?: boolean;
};

export default function MemberPrimeBadge({ session, compact = false }: MemberPrimeBadgeProps) {
  const active = session?.active && session.tier === "USJET-PRIME-ACTIVE";

  return (
    <div className={["usjet-prime-badge", compact ? "usjet-prime-badge--compact" : ""].filter(Boolean).join(" ")}>
      <p className="usjet-prime-badge__label">Member ID Status</p>
      <p
        className={[
          "usjet-prime-badge__status",
          active ? "usjet-prime-badge__status--active" : "usjet-prime-badge__status--locked",
        ].join(" ")}
      >
        {active ? session?.tier ?? "USJET-PRIME-ACTIVE" : "ACCESS LOCKED"}
      </p>
      {active && session?.customerId ? (
        <p className="usjet-prime-badge__id">{session.customerId}</p>
      ) : null}
    </div>
  );
}
