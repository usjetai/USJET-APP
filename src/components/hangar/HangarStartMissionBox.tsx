import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  HANGAR_START_MISSION_CATEGORIES,
  HANGAR_START_MISSION_OPTIONS,
  type HangarStartMissionOption,
} from "../../data/hangarStartMissions";

type HangarStartMissionBoxProps = {
  onLaunchMission: (option: HangarStartMissionOption) => void;
};

/**
 * Mission option box — click a button to open that Hangar tile right away.
 * Browser: Swisscows first (embed-friendly). More options land here as they clear X-Frame.
 */
export default function HangarStartMissionBox({ onLaunchMission }: HangarStartMissionBoxProps) {
  return (
    <GlassEffectContainer
      className="hangar-start-mission glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
      aria-label="Start Mission"
    >
      <div className="hangar-start-mission__header">
        <p className="hangar-start-mission__kicker">Mission board</p>
        <h2 className="hangar-start-mission__title">Start Mission</h2>
        <p className="hangar-start-mission__lede">
          Click any button below to open that Hangar tile right away — no hunting the floor. So far one
          browser clears X-Frame for in-tile work.
        </p>
      </div>

      {HANGAR_START_MISSION_CATEGORIES.map((category) => {
        const options = HANGAR_START_MISSION_OPTIONS.filter((opt) => opt.category === category.id);
        if (options.length === 0) return null;

        return (
          <div key={category.id} className="hangar-start-mission__group">
            <p className="hangar-start-mission__group-label">{category.label}</p>
            <div className="hangar-start-mission__options" role="group" aria-label={`${category.label} missions`}>
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="hangar-start-mission__btn btn-glass glass-effect-interactive glass-tint-cyan"
                  onClick={() => onLaunchMission(option)}
                  aria-label={`Start ${option.label} — open Hangar tile ${option.hangarSlot + 1}`}
                >
                  <span className="hangar-start-mission__btn-label">{option.label}</span>
                  <span className="hangar-start-mission__btn-meta">
                    Tile {option.hangarSlot + 1} · {option.blurb}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </GlassEffectContainer>
  );
}
