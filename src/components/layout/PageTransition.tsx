import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
  routeKey: string;
};

export default function PageTransition({ children, routeKey }: PageTransitionProps) {
  const reduceMotion = useReducedMotion();

  // Homes scroll-film needs a transform-free ancestor or position:sticky dies.
  if (reduceMotion || routeKey === "/") {
    return <div key={routeKey}>{children}</div>;
  }

  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
