import type { HTMLAttributes, ReactNode } from "react";

type GlassEffectContainerProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

/**
 * Web adaptation of iOS 26 GlassEffectContainer: groups floating glass surfaces so they
 * share depth, tint, and blend context (see `.glass-effect-container` in index.css).
 */
export default function GlassEffectContainer({
  children,
  className = "",
  style,
  "aria-label": ariaLabel,
  ...rest
}: GlassEffectContainerProps) {
  return (
    <div
      className={["glass-effect-container", className].filter(Boolean).join(" ")}
      style={style}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </div>
  );
}
