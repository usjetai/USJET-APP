import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  JET_BROWSER_QUICK_MISSIONS,
  type JetBrowserQuickMission,
  type JetBrowserQuickMissionApp,
} from "../../data/jetBrowserQuickMissions";

type JetBrowserQuickMissionsProps = {
  activeMissionId: string | null;
  onSelectMission: (mission: JetBrowserQuickMission) => void;
  onSelectApp: (app: JetBrowserQuickMissionApp) => void;
};

export default function JetBrowserQuickMissions({
  activeMissionId,
  onSelectMission,
  onSelectApp,
}: JetBrowserQuickMissionsProps) {
  const activeMission =
    JET_BROWSER_QUICK_MISSIONS.find((mission) => mission.id === activeMissionId) ??
    JET_BROWSER_QUICK_MISSIONS[0] ??
    null;

  if (!activeMission) {
    return null;
  }

  return (
    <GlassEffectContainer className="jet-browser-quick-mission glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="jet-browser-quick-mission__inner">
        <div className="jet-browser-quick-mission__head">
          <p className="jet-browser-quick-mission__eyebrow">Mission · Quick Mission</p>
          <h2 className="jet-browser-quick-mission__title">Product Hunt AI — iframe clear</h2>
          <p className="jet-browser-quick-mission__lede">
            Tabs load PH AI apps that pass our X-Frame allowlist. Click a mission to fill the tiles, or tap
            one AI to add a single bay.
          </p>
        </div>

        <div
          className="jet-browser-quick-mission__tabs"
          role="tablist"
          aria-label="Quick Mission packs"
        >
          {JET_BROWSER_QUICK_MISSIONS.map((mission) => {
            const selected = mission.id === activeMission.id;
            return (
              <button
                key={mission.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={[
                  "jet-browser-quick-mission__tab btn-glass glass-effect-interactive glass-tint-cyan",
                  selected ? "jet-browser-quick-mission__tab--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSelectMission(mission)}
              >
                {mission.label}
              </button>
            );
          })}
        </div>

        <p className="jet-browser-quick-mission__blurb">{activeMission.blurb}</p>

        <div className="jet-browser-quick-mission__apps" role="list" aria-label={`${activeMission.label} AI apps`}>
          {activeMission.apps.map((app) => (
            <button
              key={app.id}
              type="button"
              role="listitem"
              className="jet-browser-quick-mission__app btn-glass-prominent glass-effect-interactive"
              title={`${app.name} · ${app.productHunt}`}
              onClick={() => onSelectApp(app)}
            >
              {app.name}
            </button>
          ))}
        </div>
      </div>
    </GlassEffectContainer>
  );
}
