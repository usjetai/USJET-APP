import EkgPulseLine from "../intel/EkgPulseLine";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import type { MemberSession } from "../../types/member";

type MemberVitalsPanelProps = {
  session: MemberSession;
};

type VitalCellProps = {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
};

function VitalCell({ label, value, mono = false, accent = false }: VitalCellProps) {
  return (
    <motionVitalRow label={label} value={value} mono={mono} accent={accent} />
  );
}

function motionVitalRow({ label, value, mono, accent }: VitalCellProps) {
  return (
    <div className="member-vitals__cell">
      <dt className="member-vitals__label">{label}</dt>
      <dd
        className={[
          "member-vitals__value",
          mono ? "member-vitals__value--mono" : "",
          accent ? "member-vitals__value--accent" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

export default function MemberVitalsPanel({ session }: MemberVitalsPanelProps) {
  return (
    <GlassEffectContainer className="member-vitals glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="member-vitals__header">
        <p className="member-vitals__kicker">Membership vitals</p>
        <div className="member-vitals__pulse-row">
          <span className="member-vitals__heartbeat-dot" aria-hidden />
          <p className="member-vitals__status">Membership active</p>
        </div>
      </div>

      <div className="member-vitals__body">
        <div className="member-vitals__ekg" aria-hidden>
          <EkgPulseLine variant="hero" seed={42} className="member-vitals__ekg-line" />
        </div>

        <dl className="member-vitals__grid">
          <VitalCell label="Tier" value={session.tier} accent />
          <VitalCell label="Member ID" value={session.customerId} mono />
          {session.email ? <VitalCell label="Email" value={session.email} mono /> : null}
          <VitalCell label="Clearance" value="MEMBERSHIP ACTIVE" accent />
        </dl>
      </div>
    </GlassEffectContainer>
  );
}
