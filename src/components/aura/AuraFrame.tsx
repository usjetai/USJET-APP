import type { CSSProperties, ReactNode } from "react";
import type { FleetAuraMode } from "../../types/fleet";

type AuraFrameProps = {
  aura?: FleetAuraMode;
  variant?: "shell" | "orb";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

function auraBlobClass(aura: FleetAuraMode): string {
  if (aura === "listening") {
    return "aura-blob aura-blob--listening";
  }

  if (aura === "talking") {
    return "aura-blob aura-blob--talking";
  }

  return "aura-blob";
}

export default function AuraFrame({
  aura = "idle",
  variant = "shell",
  className = "",
  style,
  children,
}: AuraFrameProps) {
  if (variant === "orb") {
    return (
      <div className={`aura-float-wrap ${className}`.trim()} style={style}>
        <div className={auraBlobClass(aura)}>
          <span className="aura-blob__rim" aria-hidden />
          <span className="aura-blob__wave" aria-hidden />
          <span className="aura-blob__highlight" aria-hidden />
          <div className="relative z-[2] flex h-full w-full flex-col items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`aura-float-wrap h-full ${className}`.trim()} style={style}>
      <div
        className={[
          "tool-card h-full rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent backdrop-blur-xl",
          aura === "listening" ? "ring-1 ring-teal-300/40" : "",
          aura === "talking" ? "ring-1 ring-sky-400/50" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
