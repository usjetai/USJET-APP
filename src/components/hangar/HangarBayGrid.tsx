import type { ReactNode } from "react";
import type { HangarColumnLayout } from "../../hooks/useHangarColumnLayout";

type HangarBayGridProps = {
  children: ReactNode;
  columns: HangarColumnLayout;
};

export default function HangarBayGrid({ children, columns }: HangarBayGridProps) {
  const gridClass = [
    "hangar-bay-grid fleet-runway-grid grid",
    columns === 1 ? "gap-6 hangar-bay-grid--cols-1 grid-cols-1" : "gap-5",
    columns === 2 ? "hangar-bay-grid--cols-2 sm:grid-cols-2" : "",
    columns === 3 ? "hangar-bay-grid--cols-3 sm:grid-cols-2 lg:grid-cols-3" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="hangar-bay-grid-wrap">
      <div
        className={gridClass}
        role="region"
        aria-label="USJET hangar: networked AI cockpits in formation"
      >
        {children}
      </div>
    </div>
  );
}
