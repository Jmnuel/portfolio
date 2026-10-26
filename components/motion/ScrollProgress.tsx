"use client";

import { motion, useScroll, useSpring } from "motion/react";

// A hairline across the top of the viewport that fills as the page scrolls.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-fg/70" style={{ scaleX }} />;
}
