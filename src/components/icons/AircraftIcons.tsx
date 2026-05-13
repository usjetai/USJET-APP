import type { ReactElement, ReactNode } from "react";
import type { FleetAircraftType } from "../../types/fleet";

/** Plan-view wireframe silhouettes: inline SVG modules (bundled; not loaded from /public/aircraft). */

type AircraftIconProps = {
  aircraftType: FleetAircraftType;
  accentId: string;
  className?: string;
};

const airframeStroke = {
  fill: "none" as const,
  stroke: "white",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

export function Sr71Icon() {
  return (
    <>
      <path {...airframeStroke} d="M40 6 L40 66" />
      <path {...airframeStroke} d="M40 20 L10 52 L22 58 L40 48 L58 58 L70 52 Z" />
      <path {...airframeStroke} d="M40 20 L40 48" />
      <ellipse {...airframeStroke} cx="24" cy="42" rx="5" ry="7" />
      <ellipse {...airframeStroke} cx="56" cy="42" rx="5" ry="7" />
      <path {...airframeStroke} d="M22 44 L18 48" />
      <path {...airframeStroke} d="M58 44 L62 48" />
      <path {...airframeStroke} d="M34 64 L40 72 L46 64" />
      <path {...airframeStroke} d="M32 66 L48 66" />
    </>
  );
}

export function F22Icon() {
  return (
    <>
      <path {...airframeStroke} d="M40 8 L40 58" />
      <path {...airframeStroke} d="M40 22 L14 44 L28 50 L40 42 L52 50 L66 44 Z" />
      <path {...airframeStroke} d="M32 56 L40 68 L48 56" />
      <path {...airframeStroke} d="M22 40 L10 46" />
      <path {...airframeStroke} d="M58 40 L70 46" />
      <path {...airframeStroke} d="M36 28 L44 28" />
      <path {...airframeStroke} d="M34 60 L46 60" />
    </>
  );
}

export function F35Icon() {
  return (
    <>
      <path {...airframeStroke} d="M40 8 L40 56" />
      <path {...airframeStroke} d="M40 22 L18 42 L30 47 L40 40 L50 47 L62 42 Z" />
      <path {...airframeStroke} d="M35 54 L40 62 L45 54" />
      <path {...airframeStroke} d="M24 38 L14 42" />
      <path {...airframeStroke} d="M56 38 L66 42" />
      <path {...airframeStroke} d="M38 26 L42 26" />
    </>
  );
}

export function B2Icon() {
  return (
    <>
      <path
        {...airframeStroke}
        d="M40 10 L8 42 L18 50 L30 46 L40 52 L50 46 L62 50 L72 42 Z"
      />
      <path {...airframeStroke} d="M40 10 L40 52" />
      <path {...airframeStroke} d="M34 18 C34 14 46 14 46 18" />
      <path {...airframeStroke} d="M22 46 L16 42" />
      <path {...airframeStroke} d="M58 46 L64 42" />
    </>
  );
}

export function B52Icon() {
  return (
    <>
      <path {...airframeStroke} d="M40 8 L40 62" />
      <path {...airframeStroke} d="M6 38 L74 38" />
      <path {...airframeStroke} d="M14 38 L14 42" />
      <path {...airframeStroke} d="M24 38 L24 42" />
      <path {...airframeStroke} d="M34 38 L34 42" />
      <path {...airframeStroke} d="M46 38 L46 42" />
      <path {...airframeStroke} d="M56 38 L56 42" />
      <path {...airframeStroke} d="M66 38 L66 42" />
      <path {...airframeStroke} d="M30 58 L50 58" />
      <path {...airframeStroke} d="M20 36 L12 32" />
      <path {...airframeStroke} d="M60 36 L68 32" />
    </>
  );
}

export function C130Icon() {
  return (
    <>
      <path {...airframeStroke} d="M40 12 L40 58" />
      <path {...airframeStroke} d="M8 30 L72 30" />
      <path {...airframeStroke} d="M30 58 L50 58" />
      <path {...airframeStroke} d="M40 58 L40 64" />
      <path {...airframeStroke} d="M34 64 L46 64" />
      <circle {...airframeStroke} cx="18" cy="30" r="3.4" />
      <circle {...airframeStroke} cx="30" cy="30" r="3.4" />
      <circle {...airframeStroke} cx="50" cy="30" r="3.4" />
      <circle {...airframeStroke} cx="62" cy="30" r="3.4" />
      <path {...airframeStroke} d="M18 26 L18 22 M30 26 L30 22 M50 26 L50 22 M62 26 L62 22" />
    </>
  );
}

export function GlobalHawkIcon() {
  return (
    <>
      <path {...airframeStroke} d="M40 14 L40 56" />
      <path {...airframeStroke} d="M4 40 L76 40" />
      <path {...airframeStroke} d="M4 40 L8 44" />
      <path {...airframeStroke} d="M76 40 L72 44" />
      <path {...airframeStroke} d="M34 14 C34 10 46 10 46 14" />
      <path {...airframeStroke} d="M40 56 L40 62" />
      <path {...airframeStroke} d="M34 62 L46 62" />
    </>
  );
}

export function V22Icon() {
  return (
    <>
      <path {...airframeStroke} d="M40 14 L40 56" />
      <path {...airframeStroke} d="M12 36 L68 36" />
      <path {...airframeStroke} d="M32 56 L48 56" />
      <circle {...airframeStroke} cx="12" cy="36" r="8" />
      <circle {...airframeStroke} cx="68" cy="36" r="8" />
      <path {...airframeStroke} d="M12 28 L12 44 M4 36 L20 36" />
      <path {...airframeStroke} d="M68 28 L68 44 M60 36 L76 36" />
      <path {...airframeStroke} d="M12 22 L12 18 M68 22 L68 18" />
      <path {...airframeStroke} d="M8 36 L16 36 M64 36 L72 36" />
    </>
  );
}

export function CessnaIcon() {
  return (
    <>
      <path {...airframeStroke} d="M40 12 L40 56" />
      <path {...airframeStroke} d="M16 28 L64 28" />
      <path {...airframeStroke} d="M34 56 L46 56" />
      <circle {...airframeStroke} cx="40" cy="10" r="3.2" />
      <path {...airframeStroke} d="M40 10 L40 6" />
      <path {...airframeStroke} d="M36 6 L44 6" />
    </>
  );
}

export function BizjetIcon() {
  return (
    <>
      <path {...airframeStroke} d="M40 10 L40 54" />
      <path {...airframeStroke} d="M16 38 L64 38" />
      <path {...airframeStroke} d="M20 38 L26 44" />
      <path {...airframeStroke} d="M60 38 L54 44" />
      <path {...airframeStroke} d="M40 54 L40 60" />
      <path {...airframeStroke} d="M34 60 L46 60" />
      <ellipse {...airframeStroke} cx="33" cy="50" rx="2.6" ry="4.2" />
      <ellipse {...airframeStroke} cx="47" cy="50" rx="2.6" ry="4.2" />
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
