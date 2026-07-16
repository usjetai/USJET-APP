import { useCallback, useState } from "react";

export const JET_BROWSER_COLUMNS_STORAGE_KEY = "usjet-jet-browser-columns";

/** Tiles per row in Jet Browser formation (Founder: 2 / 3 / 4 rows). */
export type JetBrowserColumnLayout = 2 | 3 | 4;

function readStoredColumns(): JetBrowserColumnLayout {
  try {
    const raw = localStorage.getItem(JET_BROWSER_COLUMNS_STORAGE_KEY);
    if (raw === "2") return 2;
    if (raw === "3") return 3;
    if (raw === "4") return 4;
  } catch {
    /* ignore storage errors */
  }
  return 2;
}

export function useJetBrowserColumnLayout() {
  const [columns, setColumns] = useState<JetBrowserColumnLayout>(readStoredColumns);

  const setColumnLayout = useCallback((next: JetBrowserColumnLayout) => {
    setColumns(next);
    try {
      localStorage.setItem(JET_BROWSER_COLUMNS_STORAGE_KEY, String(next));
    } catch {
      /* ignore storage errors */
    }
  }, []);

  return { columns, setColumnLayout };
}
