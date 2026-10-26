"use client";

import { useState } from "react";
import { motion } from "motion/react";

// A template remounts on every navigation. The first mount is the initial page load (covered by
// the intro, if any); later mounts are in-site navigations and get a quick wipe.
// The page itself is never transformed: a transformed ancestor would break the fixed nav and chat.
let initialLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const [wipe] = useState(() => {
    if (typeof window === "undefined") return false;
    if (initialLoad) {
      initialLoad = false;
      return false;
    }
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  return (
    <>
      {children}
      {wipe && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[80] origin-top border-b border-border-strong bg-surface"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        />
      )}
    </>
  );
}
