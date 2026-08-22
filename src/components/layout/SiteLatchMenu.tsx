import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GlassEffectContainer from "./GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { SITE_ROUTE_COUNT, SITE_ROUTE_GROUPS } from "../../data/siteRouteIndex";
import {
  canMemberAccessRoute,
  clearanceTierLabel,
  normalizeRoutePath,
  routeMinClearanceRank,
} from "../../lib/memberAccessLevel";

function isRouteActive(path: string, pathname: string, search: string): boolean {
  const normalized = normalizeRoutePath(path);
  if (path.includes("?")) {
    const [base, query] = path.split("?");
    if (normalizeRoutePath(base) !== normalizeRoutePath(pathname)) {
      return false;
    }
    const expected = new URLSearchParams(query ?? "");
    const actual = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    for (const [key, value] of expected.entries()) {
      if (actual.get(key) !== value) {
        return false;
      }
    }
    return true;
  }
  if (normalized === "/gaming" && (pathname === "/gaming" || pathname === "/vr")) {
    return true;
  }
  return normalized === normalizeRoutePath(pathname);
}

function clearanceChipLabel(minRank: number): string | null {
  if (minRank <= 0) {
    return null;
  }
  if (minRank >= 3) {
    return "CMD";
  }
  if (minRank >= 2) {
    return "PRO";
  }
  return "PASS";
}

export default function SiteLatchMenu() {
  const location = useLocation();
  const { session } = useMemberAuth();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  useEffect(() => {
    close();
  }, [location.pathname, location.search, close]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const routeAccess = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const group of SITE_ROUTE_GROUPS) {
      for (const route of group.routes) {
        const base = route.path.split("?")[0] ?? route.path;
        map.set(route.path, canMemberAccessRoute(base, session));
      }
    }
    return map;
  }, [session]);

  if (location.pathname === "/cockpit") {
    return null;
  }

  return (
    <div
      className={["site-latch-menu", open ? "site-latch-menu--open" : ""].filter(Boolean).join(" ")}
      data-open={open ? "true" : "false"}
    >
      {open ? (
        <button
          type="button"
          className="site-latch-menu__backdrop"
          aria-label="Close flight deck menu"
          onClick={close}
        />
      ) : null}

      <div className="site-latch-menu__anchor">
        <button
          type="button"
          className="site-latch-menu__latch"
          aria-expanded={open}
          aria-controls="site-latch-menu-panel"
          aria-label={open ? "Close site menu" : "Open site menu — Deck"}
          title="Deck — full site menu"
          onClick={toggle}
        >
          <span className="site-latch-menu__latch-label" aria-hidden>
            Deck
          </span>
          <span className="site-latch-menu__latch-hook" aria-hidden />
        </button>
      </div>

      <div className="site-latch-menu__panel-wrap" aria-hidden={!open}>
        <GlassEffectContainer
          id="site-latch-menu-panel"
          className="site-latch-menu__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
          aria-label="USJET full site menu"
        >
        <header className="site-latch-menu__head">
          <p className="site-latch-menu__eyebrow">Deck · site menu</p>
          <h2 className="site-latch-menu__title">Every page</h2>
          <p className="site-latch-menu__meta">{SITE_ROUTE_COUNT} pages</p>
        </header>

        <div className="site-latch-menu__scroll">
          {SITE_ROUTE_GROUPS.map((group) => (
            <section key={group.id} className="site-latch-menu__group" aria-labelledby={`site-latch-${group.id}`}>
              <h3 id={`site-latch-${group.id}`} className="site-latch-menu__group-title">
                {group.title}
              </h3>
              <ul className="site-latch-menu__list">
                {group.routes.map((route) => {
                  const base = route.path.split("?")[0] ?? route.path;
                  const minRank = routeMinClearanceRank(base);
                  const chip = clearanceChipLabel(minRank);
                  const allowed = routeAccess.get(route.path) ?? true;
                  const active = isRouteActive(route.path, location.pathname, location.search);

                  return (
                    <li key={route.path}>
                      <Link
                        to={route.path}
                        className={[
                          "site-latch-menu__link",
                          "glass-effect-interactive",
                          active ? "site-latch-menu__link--active" : "",
                          allowed ? "" : "site-latch-menu__link--locked",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={close}
                        title={
                          allowed
                            ? route.hint
                              ? `${route.label} — ${route.hint}`
                              : route.label
                            : `${clearanceTierLabel(minRank)} clearance required`
                        }
                      >
                        <span className="site-latch-menu__link-copy">
                          <span className="site-latch-menu__link-label">{route.label}</span>
                          {route.hint ? <span className="site-latch-menu__link-hint">{route.hint}</span> : null}
                        </span>
                        {chip ? (
                          <span
                            className={[
                              "site-latch-menu__chip",
                              allowed ? "site-latch-menu__chip--cleared" : "site-latch-menu__chip--locked",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          >
                            {chip}
                          </span>
                        ) : (
                          <span className="site-latch-menu__chip site-latch-menu__chip--public">OPEN</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
        </GlassEffectContainer>
      </div>
    </div>
  );
}
