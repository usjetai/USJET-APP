import CrucifixLaserIcon from "../icons/CrucifixLaserIcon";

/** Full-width spinning crucifix with green (left) and red (right) lasers across the viewport. */
export default function CrucifixLaserCrown() {
  return (
    <div className="crucifix-laser-crown" aria-hidden>
      <div className="crucifix-laser-crown__spin">
        <span className="crucifix-laser-crown__beam crucifix-laser-crown__beam--green" />
        <span className="crucifix-laser-crown__beam crucifix-laser-crown__beam--green crucifix-laser-crown__beam--glow" />
        <span className="crucifix-laser-crown__beam crucifix-laser-crown__beam--red" />
        <span className="crucifix-laser-crown__beam crucifix-laser-crown__beam--red crucifix-laser-crown__beam--glow" />
        <div className="crucifix-laser-crown__cross">
          <CrucifixLaserIcon className="crucifix-laser-crown__icon" />
        </div>
      </div>
    </div>
  );
}
