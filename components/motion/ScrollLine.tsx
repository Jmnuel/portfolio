"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

// A vertical line that draws itself as its (relative) parent scrolls through the viewport.
export function ScrollLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute bottom-0 top-0 w-px ${className}`}>
      <motion.div className="h-full w-full origin-top bg-fg" style={{ scaleY }} />
    </div>
  );
}
