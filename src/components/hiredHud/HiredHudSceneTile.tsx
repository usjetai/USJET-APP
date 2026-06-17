import {
  HIRED_HUD_SCENE_PANELS,
  HIRED_HUD_SCENE_TILE_COPY,
  HIRED_HUD_SCENE_TILE_KICKER,
  HIRED_HUD_SCENE_TILE_TITLE,
} from "../../data/hiredHudSceneTile";

export default function HiredHudSceneTile() {
  return (
    <li className="hired-hud__tile hired-hud__tile--scene-mosaic" aria-label="Sovereign crew environments">
      <div className="hired-hud__scene-tile">
        <header className="hired-hud__scene-tile-head">
          <p className="hired-hud__scene-tile-kicker">{HIRED_HUD_SCENE_TILE_KICKER}</p>
          <h2 className="hired-hud__scene-tile-title">{HIRED_HUD_SCENE_TILE_TITLE}</h2>
          <p className="hired-hud__scene-tile-copy">{HIRED_HUD_SCENE_TILE_COPY}</p>
        </header>

        <ul className="hired-hud__scene-grid" aria-label="Crew environment panels">
          {HIRED_HUD_SCENE_PANELS.map((panel) => (
            <li key={panel.slug} className="hired-hud__scene-panel">
              <div className="hired-hud__scene-panel-frame">
                <img
                  src={panel.path}
                  alt={panel.label}
                  className="hired-hud__scene-panel-img"
                  width={960}
                  height={540}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <span className="hired-hud__scene-panel-ring" aria-hidden />
              </div>
              <span className="hired-hud__scene-panel-label">{panel.label}</span>
              <span className="hired-hud__scene-panel-caption">{panel.caption}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
