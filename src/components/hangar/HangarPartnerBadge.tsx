import { CheckCircle2, ExternalLink } from "lucide-react";
import type { HangarPartnerCompatibility } from "../../lib/hangarEmbedPolicy";

type HangarPartnerBadgeProps = {
  mode: HangarPartnerCompatibility;
  className?: string;
};

/** Corner status — Embedded Native vs External Launch (never an empty “broken” tile). */
export default function HangarPartnerBadge({ mode, className = "" }: HangarPartnerBadgeProps) {
  if (mode === "internal") {
    return (
      <span
        className={["hangar-partner-badge hangar-partner-badge--native", className].filter(Boolean).join(" ")}
        title="USJET native module"
      >
        <CheckCircle2 size={11} aria-hidden />
        <span>USJET Native</span>
      </span>
    );
  }

  if (mode === "native") {
    return (
      <span
        className={["hangar-partner-badge hangar-partner-badge--native", className].filter(Boolean).join(" ")}
        title="Partner allows in-tile embedding"
      >
        <CheckCircle2 size={11} aria-hidden />
        <span>Embedded Native</span>
      </span>
    );
  }

  return (
    <span
      className={["hangar-partner-badge hangar-partner-badge--external", className].filter(Boolean).join(" ")}
      title="Partner blocks embedding — launch via USJET cockpit"
    >
      <ExternalLink size={11} aria-hidden />
      <span>External Launch</span>
    </span>
  );
}
