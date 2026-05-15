import { NavLink, useLocation } from "react-router-dom";
import {
  GAMING_PAGE_TITLE,
  GAMING_ROUTE,
  GAMING_VR_ICON_SRC,
  VR_ROUTE,
} from "../../data/gamingPortal";

type GamingVrNavButtonProps = {
  /** Header capsule vs bottom contact strip */
  surface?: "header" | "footer";
};

/** VR headset — routes to /gaming (also active on /vr alias). */
export default function GamingVrNavButton({ surface = "header" }: GamingVrNavButtonProps) {
  const isFooter = surface === "footer";
  const location = useLocation();

  return (
    <NavLink
      to={GAMING_ROUTE}
      className={({ isActive }) => {
        const onGameRoute = isActive || location.pathname === VR_ROUTE || location.pathname === GAMING_ROUTE;
        return [
          "gaming-vr-nav btn-glass glass-effect-interactive",
          isFooter ? "gaming-vr-nav--footer usjet-global-contact-bar__gamers" : "gaming-vr-nav--header app-nav-gamers",
          onGameRoute ? (isFooter ? "gaming-vr-nav--active" : "app-nav-gamers--active") : "",
        ]
          .filter(Boolean)
          .join(" ");
      }}
      title={`${GAMING_PAGE_TITLE} — VR portal, Twitch Hangar Cam, TikTok proof`}
      aria-label={`Game — open ${GAMING_PAGE_TITLE} portal`}
    >
      <span className="gaming-vr-nav__glow" aria-hidden />
      <span className="gaming-vr-nav__shine" aria-hidden />
      <img src={GAMING_VR_ICON_SRC} alt="" className="gaming-vr-nav__icon" width={120} height={72} decoding="async" />
      <span className="gaming-vr-nav__label">Game</span>
    </NavLink>
  );
}
