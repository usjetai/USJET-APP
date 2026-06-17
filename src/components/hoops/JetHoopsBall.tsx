import { motion } from "framer-motion";
import { JET_HOOPS_BALL_RADIUS } from "../../data/jetHoops";

type JetHoopsBallProps =
  | {
      mode: "idle";
      x: number;
      y: number;
      fromX?: never;
      fromY?: never;
      toX?: never;
      toY?: never;
      duration?: never;
      onPassComplete?: never;
    }
  | {
      mode: "pass";
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      duration: number;
      onPassComplete: () => void;
      x?: never;
      y?: never;
    };

const ballStyle = {
  width: JET_HOOPS_BALL_RADIUS * 2,
  height: JET_HOOPS_BALL_RADIUS * 2,
  marginLeft: -JET_HOOPS_BALL_RADIUS,
  marginTop: -JET_HOOPS_BALL_RADIUS,
};

/** Yellow rock — idle at handler or animated pass arc. */
export default function JetHoopsBall(props: JetHoopsBallProps) {
  if (props.mode === "pass") {
    const midY = (props.fromY + props.toY) / 2 - 36;

    return (
      <motion.div
        className="jet-hoops__ball"
        style={ballStyle}
        initial={{ x: props.fromX, y: props.fromY }}
        animate={{
          x: [props.fromX, (props.fromX + props.toX) / 2, props.toX],
          y: [props.fromY, midY, props.toY],
        }}
        transition={{
          duration: props.duration,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.48, 1],
        }}
        onAnimationComplete={props.onPassComplete}
      />
    );
  }

  return (
    <motion.div
      className="jet-hoops__ball"
      style={ballStyle}
      animate={{ x: props.x, y: props.y }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
    />
  );
}
