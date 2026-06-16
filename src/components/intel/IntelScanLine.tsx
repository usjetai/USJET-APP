import { useMemo, type CSSProperties } from "react";

type IntelScanLineProps = {
  /** Extra classes — e.g. `intel-reserved-bay__scan` */
  className?: string;
};

/** CRT sweep — each bay gets its own period + phase so scans never march in lockstep. */
export default function IntelScanLine({ className = "" }: IntelScanLineProps) {
  const style = useMemo(
    () =>
      ({
        "--intel-scan-period": `${1.08 + Math.random() * 2.92}s`,
        "--intel-scan-delay": `-${Math.random() * 12}s`,
      }) as CSSProperties,
    [],
  );

  return <div className={["intel-monitor__scan", className].filter(Boolean).join(" ")} style={style} aria-hidden />;
}
