import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { JET_HOOPS_LOGO_MP4_SRC, JET_HOOPS_LOGO_POSTER_SRC } from "../../data/jetHoops";

/** USJET animated logo — 5s looped video on the Hoops hero. */
export default function JetHoopsHeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      video.pause();
      return undefined;
    }

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    void video.play().catch(() => undefined);

    return undefined;
  }, []);

  return (
    <motion.div
      className="jet-hoops-page__logo-shell"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <video
        ref={videoRef}
        className="jet-hoops-page__logo jet-hoops-page__logo--video"
        src={JET_HOOPS_LOGO_MP4_SRC}
        poster={JET_HOOPS_LOGO_POSTER_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        width={480}
        height={332}
        aria-label="USJET animated logo"
      />
    </motion.div>
  );
}
