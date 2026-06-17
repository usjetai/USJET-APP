import { useEffect } from "react";
import { motion } from "framer-motion";
import JetGame from "../components/hoops/JetGame";
import {
  JET_HOOPS_COPY,
  JET_HOOPS_KICKER,
  JET_HOOPS_TEAM_STYLES,
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
          <p className="jet-hoops-page__kicker">{JET_HOOPS_KICKER}</p>
          <h1 className="jet-hoops-page__title">{JET_HOOPS_TITLE}</h1>
          <p className="jet-hoops-page__copy">{JET_HOOPS_COPY}</p>
          <div className="jet-hoops-page__teams" aria-label="Teams">
            <span className="jet-hoops-page__team jet-hoops-page__team--blue">
              {JET_HOOPS_TEAM_STYLES.blue.label}
            </span>
            <span className="jet-hoops-page__versus">vs</span>
            <span className="jet-hoops-page__team jet-hoops-page__team--red">
              {JET_HOOPS_TEAM_STYLES.red.label}
            </span>
          </div>
        </motion.header>

        <motion.div
          className="jet-hoops-page__stage"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <JetGame />
        </motion.div>
      </div>
    </main>
  );
}
