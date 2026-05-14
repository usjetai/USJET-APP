import { motion } from "framer-motion";

const MovingBackground = () => (
  <motion.div
    className="moving-bg-layer pointer-events-none fixed inset-0 z-[2] overflow-hidden bg-transparent"
    aria-hidden
  >
    <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ x: "-100%", y: `${Math.random() * 100}%`, opacity: 0 }}
        animate={{ x: "250%", opacity: [0, 0.3, 0] }}
        transition={{
          duration: 10 + Math.random() * 10,
          repeat: Infinity,
          ease: "linear",
          delay: i * 2,
        }}
        className="absolute h-px w-[400px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
      />
    ))}
  </motion.div>
);

export default MovingBackground;
