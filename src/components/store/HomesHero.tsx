import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FLEET_HARDWARE_ROUTE, OPERATOR_STACK } from "../../data/aiHardware";

const COMPUTER_SRC = "/store/hardware/operator-rig-computer.png";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function ease(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function seg(p: number, a: number, b: number) {
  return clamp((p - a) / (b - a), 0, 1);
}

export default function HomesHero() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const computerRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const slabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const spacerNode = spacerRef.current;
    const stageNode = stageRef.current;
    if (!spacerNode || !stageNode) return;
    const spacer = spacerNode;
    const stage = stageNode;

    const coarse =
      window.matchMedia("(pointer: coarse)").matches && window.matchMedia("(hover: none)").matches;

    const SLAB_GAP = 64;
    const slabCount = OPERATOR_STACK.length;
    const SLAB_TOP = -(slabCount - 1) * SLAB_GAP;

    function render(p: number) {
      const b0 = seg(p, 0, 0.12);
      const b1 = seg(p, 0.12, 0.48);
      const b1e = ease(b1);
      const b2 = seg(p, 0.48, 0.82);
      const b2e = ease(b2);

      const computer = computerRef.current;
      if (computer) {
        const inT = b1e;
        const park = b2e;
        const x = lerp(0, -118, park);
        const y = lerp(lerp(90, 0, inT), -36, park);
        const s = lerp(lerp(0.72, 1, inT), 0.78, park);
        computer.style.opacity = String(inT);
        computer.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${s})`;
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = String(seg(b1e, 0.55, 1) * 0.9);
      }

      slabRefs.current.forEach((sl, si) => {
        if (!sl) return;
        const stride = 1 / (slabCount + 0.5);
        const t = ease(seg(b2, si * stride, si * stride + stride));
        const restY = SLAB_TOP + si * SLAB_GAP;
        sl.style.opacity = String(t);
        sl.style.transform = `translate(-50%, -50%) translate3d(72px, ${lerp(restY + 120, restY, t)}px, ${lerp(-30, 0, t)}px) rotateX(${lerp(-55, 0, t)}deg)`;
      });

      const orbT = ease(seg(b2, 0.72, 1));
      const orbRestY = SLAB_TOP - 58;
      if (orbRef.current) {
        orbRef.current.style.opacity = String(orbT);
        orbRef.current.style.transform = `translate(-50%, -50%) translate(72px, ${lerp(orbRestY + 130, orbRestY, orbT)}px) scale(${lerp(0.4, 1, orbT)})`;
      }

      if (hudRef.current) {
        hudRef.current.style.opacity = String(clamp(1 - b1 * 1.15, 0, 1));
        hudRef.current.style.transform = `translateY(${(1 - b0) * -20}px)`;
      }
      const ctaT = seg(p, 0.84, 0.94);
      if (ctaRef.current) {
        ctaRef.current.style.opacity = String(ctaT);
        ctaRef.current.style.transform = `translateY(${(1 - ctaT) * 24}px)`;
        ctaRef.current.style.pointerEvents = ctaT > 0.5 ? "auto" : "none";
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - seg(p, 0.02, 0.1));
      }
      if (sceneRef.current) {
        sceneRef.current.style.transform = `rotateX(${2 - b1 * 2 - b2 * 1}deg) translateY(${b1 * 6 + b2 * 4}px)`;
      }
    }

    function pinStage() {
      const vh = window.innerHeight;
      const max = Math.max(1, spacer.offsetHeight - vh);
      const rect = spacer.getBoundingClientRect();
      const p = clamp(-rect.top / max, 0, 1);
      stage.style.left = "0";
      stage.style.right = "0";
      stage.style.width = "100%";
      if (rect.top > 0) {
        stage.style.position = "absolute";
        stage.style.top = "0";
        stage.style.bottom = "auto";
      } else if (rect.bottom > vh) {
        stage.style.position = "fixed";
        stage.style.top = "0";
        stage.style.bottom = "auto";
      } else {
        stage.style.position = "absolute";
        stage.style.top = "auto";
        stage.style.bottom = "0";
      }
      render(p);
    }

    if (coarse) {
      spacer.classList.add("homes-hero--static");
      let start: number | null = null;
      const DUR = 6400;
      let raf = 0;
      const autoplay = (ts: number) => {
        if (start == null) start = ts;
        const p = clamp((ts - start) / DUR, 0, 1);
        render(p);
        if (p < 1) raf = requestAnimationFrame(autoplay);
      };
      raf = requestAnimationFrame(autoplay);
      const replay = () => {
        start = null;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(autoplay);
      };
      spacer.addEventListener("click", replay);
      return () => {
        cancelAnimationFrame(raf);
        spacer.removeEventListener("click", replay);
      };
    }

    let alive = true;
    const loop = () => {
      if (!alive) return;
      pinStage();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    window.addEventListener("resize", pinStage);
    return () => {
      alive = false;
      window.removeEventListener("resize", pinStage);
    };
  }, []);

  return (
    <section className="homes-hero" aria-label="How USJET builds a home computer">
      <div className="homes-hero__spacer" ref={spacerRef}>
        <div className="homes-hero__stage" ref={stageRef}>
          <div className="homes-hero__scene" ref={sceneRef}>
            <div className="homes-hero__glow" ref={glowRef} aria-hidden />
            <img
              ref={computerRef}
              className="homes-hero__computer"
              src={COMPUTER_SRC}
              alt=""
              width={266}
              height={168}
              decoding="async"
            />
            <div className="homes-hero__stack" aria-hidden>
              {OPERATOR_STACK.map((layer, i) => (
                <div
                  key={layer.id}
                  className="homes-hero__slab"
                  ref={(el) => {
                    slabRefs.current[i] = el;
                  }}
                >
                  <span className="homes-hero__slab-lab">{layer.layer}</span>
                  <span className="homes-hero__slab-sub">{layer.name}</span>
                  <span className="homes-hero__slab-dot" />
                </div>
              ))}
            </div>
            <div className="homes-hero__orb" ref={orbRef} aria-hidden>
              <span className="homes-hero__orb-ring homes-hero__orb-ring--outer" />
              <span className="homes-hero__orb-ring homes-hero__orb-ring--inner" />
              <span className="homes-hero__orb-core">
                <span className="homes-hero__orb-wave" aria-hidden>
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} className="homes-hero__orb-wave-bar" />
                  ))}
                </span>
              </span>
            </div>
          </div>

          <div className="homes-hero__hud" ref={hudRef}>
            <h1 className="homes-hero__title usjet-logo-stone">
              We give the computer a
              <br />
              <span className="homes-hero__accent">personal Jarvis.</span>
            </h1>
            <p className="homes-hero__sub">We buy the Mac, put the assistant on it, ship it talking.</p>
          </div>

          <div className="homes-hero__cta" ref={ctaRef}>
            <a className="homes-hero__btn homes-hero__btn--primary glass-effect-interactive" href="#hw-catalog">
              Order yours
            </a>
            <Link className="homes-hero__btn homes-hero__btn--ghost glass-effect-interactive" to={FLEET_HARDWARE_ROUTE}>
              Shop Business
            </Link>
          </div>

          <div className="homes-hero__hint" ref={hintRef} aria-hidden>
            <span className="homes-hero__mouse" />
            <span>Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
