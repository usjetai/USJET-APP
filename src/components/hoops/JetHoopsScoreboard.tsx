import { motion } from "framer-motion";
import { JET_HOOPS_TEAM_STYLES, type JetHoopsTeamId } from "../../data/jetHoops";

type JetHoopsScoreboardProps = {
  blueScore: number;
  redScore: number;
  secondsLeft: number;
  gameOver: boolean;
  lastScorer: JetHoopsTeamId | null;
};

function formatClock(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function JetHoopsScoreboard({
  blueScore,
  redScore,
  secondsLeft,
  gameOver,
  lastScorer,
}: JetHoopsScoreboardProps) {
  const urgent = !gameOver && secondsLeft <= 10;

  return (
    <div className={`jet-hoops-scoreboard${gameOver ? " jet-hoops-scoreboard--final" : ""}`}>
      <div className="jet-hoops-scoreboard__panel jet-hoops-scoreboard__panel--blue">
        <span className="jet-hoops-scoreboard__label">{JET_HOOPS_TEAM_STYLES.blue.label}</span>
        <motion.span
          key={`blue-${blueScore}`}
          className="jet-hoops-scoreboard__score"
          initial={{ scale: 1.35, color: "rgb(165 243 252)" }}
          animate={{ scale: 1, color: "rgb(240 249 255)" }}
          transition={{ type: "spring", stiffness: 520, damping: 24 }}
        >
          {blueScore}
        </motion.span>
      </div>

      <div className={`jet-hoops-scoreboard__clock${urgent ? " jet-hoops-scoreboard__clock--urgent" : ""}`}>
        <span className="jet-hoops-scoreboard__clock-label">{gameOver ? "Final" : "Clock"}</span>
        <span className="jet-hoops-scoreboard__clock-value">{gameOver ? "0:00" : formatClock(secondsLeft)}</span>
        {lastScorer && !gameOver ? (
          <span className="jet-hoops-scoreboard__flash">
            +2 · {JET_HOOPS_TEAM_STYLES[lastScorer].label}
          </span>
        ) : null}
      </div>

      <div className="jet-hoops-scoreboard__panel jet-hoops-scoreboard__panel--red">
        <span className="jet-hoops-scoreboard__label">{JET_HOOPS_TEAM_STYLES.red.label}</span>
        <motion.span
          key={`red-${redScore}`}
          className="jet-hoops-scoreboard__score"
          initial={{ scale: 1.35, color: "rgb(254 202 202)" }}
          animate={{ scale: 1, color: "rgb(255 241 242)" }}
          transition={{ type: "spring", stiffness: 520, damping: 24 }}
        >
          {redScore}
        </motion.span>
      </div>
    </div>
  );
}
