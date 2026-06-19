import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  findExternalLaunchTargetFromEvent,
  isCockpitPath,
  resolveCockpitHandoffUrl,
  shouldBypassCockpitIntercept,
} from "../lib/usjetExternalLinkIntercept";

type UsjetExternalNavigationContextValue = {
  /** True when user is viewing partner content inside `/cockpit` or a tracked external handoff. */
  showReturnFab: boolean;
  returnTo: string;
  markExternalHandoff: () => void;
  clearExternalHandoff: () => void;
};

const UsjetExternalNavigationContext = createContext<UsjetExternalNavigationContextValue | null>(null);

const DEFAULT_RETURN_TO = "/";

function normalizeReturnPath(pathname: string): string {
  if (pathname === "/cockpit") {
    return DEFAULT_RETURN_TO;
  }
  return pathname || DEFAULT_RETURN_TO;
}

export function UsjetExternalNavigationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [externalHandoffActive, setExternalHandoffActive] = useState(false);
  const [returnTo, setReturnTo] = useState(DEFAULT_RETURN_TO);

  const onCockpitRoute = isCockpitPath(location.pathname);

  useEffect(() => {
    if (!onCockpitRoute) {
      setExternalHandoffActive(false);
    }
  }, [onCockpitRoute]);

  useEffect(() => {
    setReturnTo(normalizeReturnPath(location.pathname));
  }, [location.pathname]);

  const markExternalHandoff = useCallback(() => {
    setExternalHandoffActive(true);
  }, []);

  const clearExternalHandoff = useCallback(() => {
    setExternalHandoffActive(false);
  }, []);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }

      const launchTarget = findExternalLaunchTargetFromEvent(event.target);
      if (!launchTarget) {
        return;
      }

      const { element, href, label } = launchTarget;

      let parsed: URL;
      try {
        parsed = new URL(href, window.location.origin);
      } catch {
        return;
      }

      if (shouldBypassCockpitIntercept(element, parsed)) {
        return;
      }

      const handoffReturnTo = normalizeReturnPath(location.pathname);
      const cockpitUrl = resolveCockpitHandoffUrl(href, handoffReturnTo, label);

      if (!cockpitUrl) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      setReturnTo(handoffReturnTo);
      setExternalHandoffActive(true);
      navigate(cockpitUrl);
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [location.pathname, navigate]);

  const showReturnFab = onCockpitRoute || externalHandoffActive;

  const value = useMemo(
    () => ({
      showReturnFab,
      returnTo,
      markExternalHandoff,
      clearExternalHandoff,
    }),
    [clearExternalHandoff, externalHandoffActive, markExternalHandoff, onCockpitRoute, returnTo, showReturnFab],
  );

  return (
    <UsjetExternalNavigationContext.Provider value={value}>{children}</UsjetExternalNavigationContext.Provider>
  );
}

export function useUsjetExternalNavigation(): UsjetExternalNavigationContextValue {
  const context = useContext(UsjetExternalNavigationContext);
  if (!context) {
    throw new Error("useUsjetExternalNavigation must be used within UsjetExternalNavigationProvider");
  }
  return context;
}

export function useUsjetExternalNavigationOptional(): UsjetExternalNavigationContextValue | null {
  return useContext(UsjetExternalNavigationContext);
}
