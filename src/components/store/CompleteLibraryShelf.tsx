import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import type { LibraryShelfVolume } from "../../data/libraryShelf";
import { mountPressStack, type PressStackEngine } from "../../lib/pressStackEngine";

type CompleteLibraryShelfProps = {
  volumes: readonly LibraryShelfVolume[];
  kicker: string;
  heading: string;
};

export default function CompleteLibraryShelf({ volumes, kicker, heading }: CompleteLibraryShelfProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<PressStackEngine | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const volume = selected == null ? null : volumes[selected];

  const engineVolumes = useMemo(
    () => volumes.map((item) => ({ id: item.id, title: item.title, author: item.author, coverSrc: item.coverSrc })),
    [volumes],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || engineVolumes.length === 0) return;
    try {
      const engine = mountPressStack(canvas, engineVolumes, {
        onHover: () => undefined,
        onPick: (index) => {
          setSelected(index);
          engineRef.current?.inspect(index);
        },
      });
      if (!engine) {
        setFailed(true);
        return;
      }
      engineRef.current = engine;
      return () => {
        engine.dispose();
        engineRef.current = null;
      };
    } catch {
      setFailed(true);
    }
  }, [engineVolumes]);

  function closeDetail() {
    setSelected(null);
    engineRef.current?.exitInspect();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDetail();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="press-home" aria-label={heading}>
      <header className="press-home__mast">
        <p className="press-home__kicker">{kicker}</p>
        <h1 className="press-home__heading">{heading}</h1>
      </header>

      <div className="press-home__stage">
        {failed ? (
          <p className="press-home__fail">This library needs WebGL.</p>
        ) : (
          <canvas ref={canvasRef} className="press-home__canvas" />
        )}
      </div>

      {volume ? (
        <div className="press-home__dossier glass-effect glass-effect--rounded-rect glass-tint-cyan">
          <p className="press-home__series">{volume.seriesLabel}</p>
          <h2 className="press-home__title">{volume.title}</h2>
          {volume.subtitle ? <p className="press-home__sub">{volume.subtitle}</p> : null}
          <p className="press-home__author">{volume.author}</p>
          <p className="press-home__blurb">{volume.blurb}</p>
          <p className="press-home__price">{volume.priceDisplay}</p>
          <div className="press-home__actions">
            {volume.primaryCta ? (
              <Link to={volume.primaryCta.to} className="press-home__buy glass-effect-interactive">
                {volume.primaryCta.label}
                <ExternalLink size={13} aria-hidden />
              </Link>
            ) : null}
            {volume.secondaryCta ? (
              <Link to={volume.secondaryCta.to} className="press-home__buy glass-effect-interactive">
                {volume.secondaryCta.label}
                <ExternalLink size={13} aria-hidden />
              </Link>
            ) : null}
            <button type="button" className="press-home__back" onClick={closeDetail}>
              Back to the stack
            </button>
          </div>
        </div>
      ) : (
        <p className="press-home__hint">Hover a volume. Click to open it.</p>
      )}
    </section>
  );
}
