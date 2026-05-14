import { useCallback, useState } from "react";

export const HANGAR_COLUMNS_STORAGE_KEY = "usjet-hangar-columns";

export type HangarColumnLayout = 1 | 2 | 3;

function readStoredColumns(): HangarColumnLayout {
  try {
    const raw = localStorage.getItem(HANGAR_COLUMNS_STORAGE_KEY);
    if (raw === "1") return 1;
    if (raw === "2") return 2;
    if (raw === "3") return 3;
  } catch {
    /* ignore storage errors */
  }
  return 2;
}

export function useHangarColumnLayout() {
  const [columns, setColumns] = useState<HangarColumnLayout>(readStoredColumns);

  const setColumnLayout = useCallback((next: HangarColumnLayout) => {
    setColumns(next);
    try {
      localStorage.setItem(HANGAR_COLUMNS_STORAGE_KEY, String(next));
    } catch {
      /* ignore storage errors */
    }
  }, []);

  return { columns, setColumnLayout };
}
