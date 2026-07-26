import { ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { memberClearanceDisplayLabel, membershipTenureLabel } from "../../lib/memberAccessLevel";
import { getMemberProjectStats } from "../../lib/memberProjectTracker";
import type { MemberSession } from "../../types/member";

type OriginMemberStripProps = {
  session: MemberSession;
};

type StripCellProps = {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
};

function StripCell({ label, value, mono = false, accent = false }: StripCellProps) {
  return (
    <div className="origin-member-strip__cell">
      <dt className="origin-member-strip__label">{label}</dt>
      <dd
        className={[
          "origin-member-strip__value",
          mono ? "origin-member-strip__value--mono" : "",
          accent ? "origin-member-strip__value--accent" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

export default function OriginMemberStrip({ session }: OriginMemberStripProps) {
  const clearanceLabel = memberClearanceDisplayLabel(session);
  const tenure = membershipTenureLabel(session.verifiedAt);
  const stats = useMemo(() => getMemberProjectStats(session.customerId), [session.customerId]);

  const proudKicker =
    clearanceLabel === "God mode"
      ? "Sovereign clearance — full command authority"
      : `Clearance confirmed — ${clearanceLabel} on the roster`;

  return (
    <GlassEffectContainer className="origin-member-strip glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="origin-member-strip__inner">
        <div className="origin-member-strip__lead">
          <ShieldCheck size={14} className="origin-member-strip__icon" aria-hidden />
          <p className="origin-member-strip__kicker">{proudKicker}</p>
          <span className="origin-member-strip__badge">{clearanceLabel}</span>
          <span className="origin-member-strip__tenure">{tenure}</span>
        </div>

        <dl className="origin-member-strip__grid">
          <StripCell label="Tier" value={clearanceLabel} accent />
          {session.email ? <StripCell label="Email" value={session.email} mono /> : null}
          <StripCell label="Member ID" value={session.customerId} mono />
          <StripCell label="Clearance" value="ACTIVE" accent />
          <StripCell
            label="Mission projects"
            value={stats.projectCount === 0 ? "None yet" : String(stats.projectCount)}
          />
          <StripCell label="Session forks" value={String(stats.totalSessionForks)} accent />
        </dl>
      </div>
    </GlassEffectContainer>
  );
}
