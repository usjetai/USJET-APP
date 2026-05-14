import type { ReactElement, ReactNode } from "react";
import type { FleetAircraftType } from "../../types/fleet";

/** Plan-view wireframe silhouettes — aerodynamic deltas, tapered fuselages, high-velocity strokes. */

type AircraftIconProps = {
  aircraftType: FleetAircraftType;
  accentId: string;
  className?: string;
};

const airframeStroke = {
  fill: "none" as const,
  stroke: "white",
  strokeWidth: 1.35,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

/** Tapered fuselage spine — needle nose to narrow tail. */
function FuselageSpine({ noseY = 6, tailY = 68 }: { noseY?: number; tailY?: number }) {
  const mid = (noseY + tailY) / 2;
  return (
    <path
      {...airframeStroke}
      d={`M40 ${noseY} Q38.5 ${mid} 40 ${tailY} Q41.5 ${mid} 40 ${noseY}`}
    />
  );
}

export function Sr71Icon() {
  return (
    <>
      <FuselageSpine noseY={5} tailY={70} />
      <path
        {...airframeStroke}
        d="M40 14 C32 22 8 46 4 54 L18 58 L40 42 L62 58 L76 54 C72 46 48 22 40 14 Z"
      />
      <path {...airframeStroke} d="M40 14 L40 42" />
      <ellipse {...airframeStroke} cx="22" cy="44" rx="4.2" ry="6" />
      <ellipse {...airframeStroke} cx="58" cy="44" rx="4.2" ry="6" />
      <path {...airframeStroke} d="M36 66 L40 74 L44 66" />
      <path {...airframeStroke} d="M20 50 L12 54 M60 50 L68 54" />
    </>
  );
}

export function F22Icon() {
  return (
    <>
      <FuselageSpine noseY={7} tailY={66} />
      <path
        {...airframeStroke}
        d="M40 16 L6 44 L22 50 L40 38 L58 50 L74 44 Z"
      />
      <path {...airframeStroke} d="M34 62 L40 72 L46 62" />
      <path {...airframeStroke} d="M18 42 L8 48 M62 42 L72 48" />
      <path {...airframeStroke} d="M35 24 L45 24" />
    </>
  );
}

export function F35Icon() {
  return (
    <>
      <FuselageSpine noseY={8} tailY={64} />
      <path
        {...airframeStroke}
        d="M40 18 C34 24 16 40 12 46 L26 50 L40 40 L54 50 L68 46 C64 40 46 24 40 18 Z"
      />
      <path {...airframeStroke} d="M36 58 L40 66 L44 58" />
      <path {...airframeStroke} d="M22 40 L14 44 M58 40 L66 44" />
    </>
  );
}

export function B2Icon() {
  return (
    <>
      <path
        {...airframeStroke}
        d="M40 8 C28 12 6 38 4 44 L16 52 L32 46 L40 54 L48 46 L64 52 L76 44 C74 38 52 12 40 8 Z"
      />
      <path {...airframeStroke} d="M40 8 Q40 30 40 54" />
      <path {...airframeStroke} d="M32 16 C32 12 48 12 48 16" />
      <path {...airframeStroke} d="M18 48 L10 44 M62 48 L70 44" />
    </>
  );
}

export function B52Icon() {
  return (
    <>
      <FuselageSpine noseY={8} tailY={62} />
      <path {...airframeStroke} d="M4 36 Q40 34 76 36" />
      <path {...airframeStroke} d="M12 36 L12 40 M22 36 L22 40 M32 36 L32 40 M48 36 L48 40 M58 36 L58 40 M68 36 L68 40" />
      <path {...airframeStroke} d="M28 56 L52 56" />
      <path {...airframeStroke} d="M18 34 L10 30 M62 34 L70 30" />
      <path {...airframeStroke} d="M36 20 L44 20" />
    </>
  );
}

export function C130Icon() {
  return (
    <>
      <FuselageSpine noseY={12} tailY={60} />
      <path {...airframeStroke} d="M6 28 Q40 26 74 28" />
      <path {...airframeStroke} d="M32 56 L48 56" />
      <path {...airframeStroke} d="M40 60 L40 66 M34 66 L46 66" />
      <ellipse {...airframeStroke} cx="18" cy="28" rx="3.2" ry="3.2" />
      <ellipse {...airframeStroke} cx="30" cy="28" rx="3.2" ry="3.2" />
      <ellipse {...airframeStroke} cx="50" cy="28" rx="3.2" ry="3.2" />
      <ellipse {...airframeStroke} cx="62" cy="28" rx="3.2" ry="3.2" />
      <path {...airframeStroke} d="M18 24 L18 20 M30 24 L30 20 M50 24 L50 20 M62 24 L62 20" />
    </>
  );
}

export function GlobalHawkIcon() {
  return (
    <>
      <FuselageSpine noseY={14} tailY={58} />
      <path {...airframeStroke} d="M2 38 Q40 36 78 38" />
      <path {...airframeStroke} d="M2 38 L6 42 M78 38 L74 42" />
      <path {...airframeStroke} d="M34 12 C34 9 46 9 46 12" />
      <path {...airframeStroke} d="M40 58 L40 64 M34 64 L46 64" />
    </>
  );
}

export function V22Icon() {
  return (
    <>
      <FuselageSpine noseY={14} tailY={56} />
      <path {...airframeStroke} d="M10 34 Q40 32 70 34" />
      <path {...airframeStroke} d="M32 54 L48 54" />
      <ellipse {...airframeStroke} cx="10" cy="34" rx="7.5" ry="7.5" />
      <ellipse {...airframeStroke} cx="70" cy="34" rx="7.5" ry="7.5" />
      <path {...airframeStroke} d="M10 26 L10 42 M2 34 L18 34" />
      <path {...airframeStroke} d="M70 26 L70 42 M62 34 L78 34" />
      <path {...airframeStroke} d="M10 20 L10 16 M70 20 L70 16" />
    </>
  );
}

export function CessnaIcon() {
  return (
    <>
      <FuselageSpine noseY={10} tailY={56} />
      <path {...airframeStroke} d="M14 26 Q40 24 66 26" />
      <path {...airframeStroke} d="M34 54 L46 54" />
      <circle {...airframeStroke} cx="40" cy="9" r="2.8" />
      <path {...airframeStroke} d="M40 9 L40 5 M36 5 L44 5" />
    </>
  );
}

export function BizjetIcon() {
  return (
    <>
      <FuselageSpine noseY={9} tailY={58} />
      <path {...airframeStroke} d="M14 36 Q40 34 66 36" />
      <path {...airframeStroke} d="M22 36 L28 42 M58 36 L52 42" />
      <path {...airframeStroke} d="M40 58 L40 64 M34 64 L46 64" />
      <ellipse {...airframeStroke} cx="33" cy="48" rx="2.4" ry="3.8" />
      <ellipse {...airframeStroke} cx="47" cy="48" rx="2.4" ry="3.8" />
      <path {...airframeStroke} d="M38 18 L42 18" />
    </>
  );
}

const SILHOUETTE_COMPONENTS: Record<FleetAircraftType, () => ReactElement> = {
  sr71: Sr71Icon,
  f22: F22Icon,
  f35: F35Icon,
  b2: B2Icon,
  b52: B52Icon,
  c130: C130Icon,
  globalHawk: GlobalHawkIcon,
  v22: V22Icon,
  cessna: CessnaIcon,
  bizjet: BizjetIcon,
};

function AirframeIconFrame({
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
      className={`aircraft-icon ${className}`.trim()}
    >
      <g className="aircraft-icon__vector">{children}</g>
    </svg>
  );
}

export default function AircraftIcon({
  aircraftType,
  accentId: _accentId,
  className = "",
}: AircraftIconProps) {
  const Silhouette = SILHOUETTE_COMPONENTS[aircraftType];

  return (
    <AirframeIconFrame className={className}>
      <Silhouette />
    </AirframeIconFrame>
  );
}
