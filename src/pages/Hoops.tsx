import { useEffect } from "react";
import { motion } from "framer-motion";
import JetHoopsArcadeTile from "../components/hoops/JetHoopsArcadeTile";
import {
  JET_HOOPS_COPY,
  JET_HOOPS_FLIGHT_WORDMARK_SRC,
  JET_HOOPS_KICKER,
  JET_HOOPS_TITLE,
} from "../data/jetHoops";

export default function Hoops() {
  useEffect(() => {
    const prev = document.title;
    document.title = `${JET_HOOPS_TITLE} · USJet.ai`;
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="jet-hoops-page page-atmosphere">
      <div className="jet-hoops-page__inner">
        <motion.header
          className="jet-hoops-page__hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={JET_HOOPS_FLIGHT_WORDMARK_SRC}
            alt=""
            className="jet-hoops-page__flight-wordmark"
            width={830}
            height={514}
            decoding="async"
            draggable={false}
          />
          <p className="jet-hoops-page__kicker">{JET_HOOPS_KICKER}</p>
          <h1 className="jet-hoops-page__title">{JET_HOOPS_TITLE}</h1>
          <p className="jet-hoops-page__copy">{JET_HOOPS_COPY}</p>
        </motion.header>

        <motion.div
          className="jet-hoops-page__stage jet-hoops-page__stage--arcade"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <JetHoopsArcadeTile />
        </motion.div>
      </div>
    </main>
  );
}
