import { NavLink } from "react-router-dom";
import { Circle } from "lucide-react";
import { JET_HOOPS_ROUTE, JET_HOOPS_TITLE } from "../../data/jetHoops";

type JetHoopsNavButtonProps = {
  surface?: "header" | "footer";
  variant?: "pill" | "chip";
};

/** Hardwood pickup — routes to /hoops (5-on-5 jet court). */
export default function JetHoopsNavButton({ surface = "header", variant = "pill" }: JetHoopsNavButtonProps) {
  const isFooter = surface === "footer";

  if (variant === "chip") {
    return (
      <NavLink
        to={JET_HOOPS_ROUTE}
        className={({ isActive }) =>
          ["app-nav-h btn-glass glass-effect-interactive shrink-0", isActive ? "app-nav-h--active" : ""]
            .filter(Boolean)
            .join(" ")
        }
        title={`${JET_HOOPS_TITLE} — 5-on-5 fleet pickup court`}
        aria-label={`H — ${JET_HOOPS_TITLE} hardwood`}
      >
        <span className="app-nav-h__glow" aria-hidden />
        <span className="app-nav-h__ball" aria-hidden />
        <span className="app-nav-h__label">H</span>
      </NavLink>
    );
  }

  return (
    <NavLink
      to={JET_HOOPS_ROUTE}
      className={({ isActive }) =>
        [
          "jet-hoops-nav btn-glass glass-effect-interactive",
          isFooter ? "jet-hoops-nav--footer" : "jet-hoops-nav--header",
          isActive ? "jet-hoops-nav--active" : "",
        ]
          .filter(Boolean)
          .join(" ")
      }
      title={`${JET_HOOPS_TITLE} — 5-on-5 fleet pickup court`}
      aria-label={`${JET_HOOPS_TITLE} — open interactive hardwood`}
    >
      <Circle className="jet-hoops-nav__ball" size={isFooter ? 14 : 16} aria-hidden strokeWidth={2.75} />
      <span className="jet-hoops-nav__label">Hoops</span>
    </NavLink>
  );
}
