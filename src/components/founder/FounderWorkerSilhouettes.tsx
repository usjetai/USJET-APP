import type { ReactElement, ReactNode } from "react";

/** Anonymous grit figures — stroke-only wireframes, no faces, could be anyone. */

export type FounderWorkerSilhouetteType = "origin" | "wrenches" | "industryFirst";

type FounderWorkerSilhouetteProps = {
  silhouetteType: FounderWorkerSilhouetteType;
  className?: string;
};

const gritStroke = {
  fill: "none" as const,
  stroke: "white",
  strokeWidth: 1.35,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

/** Queens hustle — anonymous figure in stride, duffel over shoulder, ground line. */
export function OriginWorkerIcon() {
  return (
    <>
      <path {...gritStroke} d="M8 68 L72 68" />
      <path {...gritStroke} d="M10 68 L14 62 L18 68" />
      <path {...gritStroke} d="M62 68 L66 62 L70 68" />
      <circle {...gritStroke} cx="46" cy="18" r="5.5" />
      <path {...gritStroke} d="M46 23.5 L44 34 L40 48 L38 62 L42 68" />
      <path {...gritStroke} d="M44 34 L52 36 L56 42" />
      <path {...gritStroke} d="M40 48 L32 50 L28 56 L26 68" />
      <path {...gritStroke} d="M40 48 L48 62 L54 68" />
      <path {...gritStroke} d="M52 36 L58 30 L62 24" />
      <rect {...gritStroke} x="56" y="20" width="10" height="8" rx="1.5" />
      <path {...gritStroke} d="M58 24 L64 24" />
    </>
  );
}

/** Wrenches, not slides — crouched mechanic with open-end wrench and bench block. */
export function WrenchesWorkerIcon() {
  return (
    <>
      <path {...gritStroke} d="M6 70 L74 70" />
      <rect {...gritStroke} x="14" y="58" width="28" height="12" rx="2" />
      <path {...gritStroke} d="M18 58 L18 54 M38 58 L38 54" />
      <circle {...gritStroke} cx="34" cy="22" r="5.5" />
      <path {...gritStroke} d="M34 27.5 L30 38 L26 50 L24 62" />
      <path {...gritStroke} d="M30 38 L40 40 L46 46" />
      <path {...gritStroke} d="M26 50 L18 54 L14 62" />
      <path {...gritStroke} d="M26 50 L34 58 L40 62" />
      <path {...gritStroke} d="M46 46 L54 50 L58 56 L60 62" />
      <path {...gritStroke} d="M48 44 L56 38 L62 34 L68 32" />
      <path {...gritStroke} d="M62 34 L66 30 L70 28" />
      <path {...gritStroke} d="M66 30 L70 34 L68 38 L64 36" />
      <path {...gritStroke} d="M34 16 L38 12 L42 14 L40 18" />
    </>
  );
}

/** Industry first — hard-hat operator with blueprint roll, forward stance. */
export function IndustryFirstWorkerIcon() {
  return (
    <>
      <path {...gritStroke} d="M8 68 L72 68" />
      <path {...gritStroke} d="M20 68 L22 60 L24 68" />
      <path {...gritStroke} d="M56 68 L58 60 L60 68" />
      <circle {...gritStroke} cx="40" cy="20" r="5.5" />
      <path {...gritStroke} d="M32 18 L48 18 L50 14 L30 14 Z" />
      <path {...gritStroke} d="M40 25.5 L38 36 L36 48 L34 62 L38 68" />
      <path {...gritStroke} d="M40 25.5 L42 36 L44 48 L46 62 L42 68" />
      <path {...gritStroke} d="M38 36 L28 38 L22 44" />
      <path {...gritStroke} d="M42 36 L52 38 L58 44" />
      <path {...gritStroke} d="M22 44 L18 50 L16 58" />
      <path {...gritStroke} d="M58 44 L62 50 L64 58" />
      <path {...gritStroke} d="M52 42 L60 36 L66 30" />
      <ellipse {...gritStroke} cx="64" cy="28" rx="4" ry="6" />
      <path {...gritStroke} d="M60 28 L68 28" />
      <path {...gritStroke} d="M12 52 L20 48 L24 52 L20 56 Z" />
    </>
  );
}

const SILHOUETTE_COMPONENTS: Record<FounderWorkerSilhouetteType, () => ReactElement> = {
  origin: OriginWorkerIcon,
  wrenches: WrenchesWorkerIcon,
  industryFirst: IndustryFirstWorkerIcon,
};

function WorkerSilhouetteFrame({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      role="img"
      aria-hidden
      className={`founder-worker-silhouette ${className}`.trim()}
    >
      <g className="founder-worker-silhouette__vector">{children}</g>
    </svg>
  );
}

export default function FounderWorkerSilhouette({
  silhouetteType,
  className = "",
}: FounderWorkerSilhouetteProps) {
  const Silhouette = SILHOUETTE_COMPONENTS[silhouetteType];

  return (
    <WorkerSilhouetteFrame className={className}>
      <Silhouette />
    </WorkerSilhouetteFrame>
  );
}
