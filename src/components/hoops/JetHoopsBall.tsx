import { motion } from "framer-motion";
import { JET_HOOPS_BALL_RADIUS } from "../../data/jetHoops";

export type JetHoopsBallFlight = {
  id: number;
  kind: "pass" | "shot";
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  duration: number;
  toSlot?: number;
};

type JetHoopsBallProps =
  | {
      mode: "idle";
      x: number;
      y: number;
      bob?: boolean;
    }
  | {
      mode: "flight";
      flight: JetHoopsBallFlight;
      onComplete: () => void;
    };

const BALL_SIZE = JET_HOOPS_BALL_RADIUS * 2;

function arcPeakY(fromY: number, toY: number, kind: "pass" | "shot"): number {
  const lift = kind === "shot" ? 72 : 48;
  return Math.min(fromY, toY) - lift;
}

/** Yellow rock with court shadow and arced flight path. */
export default function JetHoopsBall(props: JetHoopsBallProps) {
  if (props.mode === "flight") {
    const { flight, onComplete } = props;
    const peakY = arcPeakY(flight.fromY, flight.toY, flight.kind);
    const midX = (flight.fromX + flight.toX) / 2;

    return (
      <motion.div
        className="jet-hoops__ball-wrap"
        initial={{ x: flight.fromX, y: flight.fromY }}
        animate={{
          x: [flight.fromX, midX, flight.toX],
          y: [flight.fromY, peakY, flight.toY],
        }}
        transition={{
          duration: flight.duration,
          ease: [0.33, 0.02, 0.22, 1],
          times: [0, 0.46, 1],
        }}
        onAnimationComplete={onComplete}
        style={{
          marginLeft: -JET_HOOPS_BALL_RADIUS,
          marginTop: -JET_HOOPS_BALL_RADIUS,
        }}
      >
        <span className="jet-hoops__ball-shadow jet-hoops__ball-shadow--flight" aria-hidden />
        <span className="jet-hoops__ball" style={{ width: BALL_SIZE, height: BALL_SIZE }} aria-hidden />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="jet-hoops__ball-wrap"
      animate={{ x: props.x, y: props.y }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      style={{
        marginLeft: -JET_HOOPS_BALL_RADIUS,
        marginTop: -JET_HOOPS_BALL_RADIUS,
      }}
    >
      <motion.span
        className="jet-hoops__ball-shadow"
        aria-hidden
        animate={props.bob ? { scale: [1, 0.9, 1], opacity: [0.55, 0.4, 0.55] } : undefined}
        transition={props.bob ? { repeat: Infinity, duration: 0.85, ease: "easeInOut" } : undefined}
      />
      <motion.span
        className="jet-hoops__ball"
        style={{ width: BALL_SIZE, height: BALL_SIZE }}
        aria-hidden
        animate={props.bob ? { y: [0, -4, 0] } : undefined}
        transition={props.bob ? { repeat: Infinity, duration: 0.85, ease: "easeInOut" } : undefined}
      />
    </motion.div>
  );
}
