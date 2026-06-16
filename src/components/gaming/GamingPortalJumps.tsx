import { Link } from "react-router-dom";
import { CODE_KIT_ROUTE } from "../../data/codeKit499";
import {
  GAMING_PORTAL_JUMPS,
  GAMING_VR_ICON_SRC,
  GAMING_X_URL,
  GAMING_X_WEB,
} from "../../data/gamingPortal";

/** On-page deck navigator — pairs with header/footer VR Game button. */
export default function GamingPortalJumps() {
  return (
    <nav className="gaming-portal-jumps gaming-portal-jumps--legacy-hud" aria-label="Game page sections">
      <img src={GAMING_VR_ICON_SRC} alt="" className="gaming-portal-jumps__mark" width={48} height={29} decoding="async" />
      <div className="gaming-portal-jumps__chips">
        {GAMING_PORTAL_JUMPS.map((jump) => (
          <a key={jump.id} href={`#${jump.id}`} className="gaming-portal-jumps__chip btn-glass glass-effect-interactive">
            {jump.label}
          </a>
        ))}
        <Link to="/ai-101" className="gaming-portal-jumps__chip btn-glass glass-effect-interactive">
          AI 101
        </Link>
        <Link to={CODE_KIT_ROUTE} className="gaming-portal-jumps__chip btn-glass glass-effect-interactive">
          Code Kit
        </Link>
        <a
          href={GAMING_X_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="gaming-portal-jumps__chip btn-glass glass-effect-interactive gaming-portal-jumps__chip--x"
        >
          X · {GAMING_X_WEB}
        </a>
      </div>
    </nav>
  );
}
