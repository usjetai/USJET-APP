import GlassEffectContainer from "../layout/GlassEffectContainer";

const F22_WIREFRAME_SRC = "/fleet/f22-raptor-wireframe.png";
const KNICKS_LOGO_SRC = "/fleet/new-york-knicks-logo.webp";

/** F-22 Raptor wireframe inside the New York Knicks logo badge — Fleet landing hero. */
export default function FleetKnicksF22Hero() {
  return (
    <figure
      className="fleet-knicks-f22"
      aria-label="F-22 Raptor wireframe inside New York Knicks logo"
    >
      <GlassEffectContainer
        className="fleet-knicks-f22__frame glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-blue"
      >
        <div className="fleet-knicks-f22__glow" aria-hidden />
        <div className="fleet-knicks-f22__stage">
          <div className="fleet-knicks-f22__badge">
            <img
              src={KNICKS_LOGO_SRC}
              alt="New York Knicks"
              className="fleet-knicks-f22__logo"
              width={320}
              height={320}
              decoding="async"
              draggable={false}
            />
            <div className="fleet-knicks-f22__jet-inset" aria-hidden>
              <img
                src={F22_WIREFRAME_SRC}
                alt=""
                className="fleet-knicks-f22__wireframe"
                width={848}
                height={849}
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </div>

        <figcaption className="fleet-knicks-f22__caption">
          <span className="fleet-knicks-f22__callsign">F-22 Raptor</span>
          <span className="fleet-knicks-f22__tag">New York Knicks livery</span>
        </figcaption>
      </GlassEffectContainer>
    </figure>
  );
}
