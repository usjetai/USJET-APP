import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FLEET_HARDWARE_ROUTE } from "../../data/aiHardware";
const COMPUTER_SRC = "/store/hardware/operator-rig-computer.png";

const JARVIS_SCREENS = [
  { slot: "s1", layer: "Engine", chip: "Ollama", lines: ["w80", "w60", "w40"] },
  { slot: "s2", layer: "Jarvis screen", chip: "Open WebUI", lines: ["w80", "w40"] },
  { slot: "s3", layer: "Memory vault", chip: "AnythingLLM", lines: ["w60", "w80", "w40"] },
  { slot: "s4", layer: "Vision", chip: "Vision", lines: ["w80", "w60"] },
  { slot: "s5", layer: "Manual", chip: "AI Book Series", lines: ["w60", "w80", "w40"] },
] as const;

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
  const jarvisRef = useRef<HTMLDivElement>(null);
  const screensRef = useRef<(HTMLElement | null)[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    const kick = () => {
      video.muted = true;
      const play = video.play();
      if (play) play.catch(() => undefined);
    };
    kick();
    video.addEventListener("canplay", kick);
    video.addEventListener("loadeddata", kick);
    document.addEventListener("touchstart", kick, { passive: true });
    document.addEventListener("scroll", kick, { passive: true });
    return () => {
      video.removeEventListener("canplay", kick);
      video.removeEventListener("loadeddata", kick);
      document.removeEventListener("touchstart", kick);
      document.removeEventListener("scroll", kick);
    };
  }, []);

  useEffect(() => {
    const spacerNode = spacerRef.current;
    const stageNode = stageRef.current;
    if (!spacerNode || !stageNode) return;
    const spacer = spacerNode;
    const stage = stageNode;

    const coarse =
      window.matchMedia("(pointer: coarse)").matches && window.matchMedia("(hover: none)").matches;

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
        const x = lerp(0, -210, park);
        const y = lerp(lerp(90, 0, inT), 48, park);
        const s = lerp(lerp(0.72, 1, inT), 0.52, park);
        computer.style.opacity = String(lerp(inT, 0.38, park));
        computer.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${s})`;
      }

      if (glowRef.current) {
        glowRef.current.style.opacity = String(seg(b1e, 0.55, 1) * 0.9);
      }

      const orbIn = ease(seg(p, 0.46, 0.56));
      if (jarvisRef.current) {
        jarvisRef.current.style.opacity = String(orbIn);
        jarvisRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(0.86, 1, orbIn)})`;
      }
      if (orbIn > 0.2) {
        const video = videoRef.current;
        if (video && video.paused) {
          video.muted = true;
          video.play().catch(() => undefined);
        }
      }

      screensRef.current.forEach((screen, i) => {
        if (!screen) return;
        const start = 0.52 + i * 0.055;
        const out = ease(seg(p, start, start + 0.09));
        screen.style.setProperty("--out", String(out));
        screen.style.opacity = String(out);
      });

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
            <div className="homes-hero__jarvis" ref={jarvisRef} aria-hidden>
              <div className="homes-hero__mesh" />
              <div className="homes-hero__orb">
                <video
                  ref={videoRef}
                  className="homes-hero__orb-video"
                  src="/store/hardware/jarvis-bot.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-hidden
                />
              </div>
              {JARVIS_SCREENS.map((screen, i) => (
                <div
                  key={screen.slot}
                  className={`homes-hero__screen homes-hero__screen--${screen.slot}`}
                  ref={(node) => {
                    screensRef.current[i] = node;
                  }}
                >
                  <article className="homes-hero__screen-card">
                    <header className="homes-hero__screen-hd">
                      <i />
                      <span>{screen.layer}</span>
                    </header>
                    <div className="homes-hero__screen-bd">
                      {screen.lines.map((w, line) => (
                        <span key={`${w}-${line}`} className={`homes-hero__screen-ln homes-hero__screen-ln--${w}`} />
                      ))}
                      <span className="homes-hero__screen-chip">{screen.chip}</span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="homes-hero__hud" ref={hudRef}>
            <h1 className="homes-hero__title usjet-logo-stone">
              Which files would you
              <br />
              <span className="homes-hero__accent">never paste into AI?</span>
            </h1>
            <p className="homes-hero__sub">
              Those are the ones this machine is for. The model runs on your desk — your documents are never sent to a
              model provider.
            </p>
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
