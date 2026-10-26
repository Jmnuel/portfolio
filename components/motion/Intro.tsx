"use client";

import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion } from "motion/react";
import { profile } from "@/lib/content";
import { introActive } from "@/lib/intro";

// First-visit intro: a quick 0 → 100 counter, then the panel wipes up to reveal the site.
// Rendered on the server too, so it covers the page from the first paint; the inline
// script in app/layout.tsx hides it (via .no-intro) when it shouldn't play.
export function Intro() {
  const [show, setShow] = useState(true);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!introActive()) {
      setShow(false);
      return;
    }
    const controls = animate(0, 100, {
      duration: 0.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (count.current) count.current.textContent = String(Math.round(v)).padStart(3, "0");
      },
      onComplete: () => setShow(false),
    });
    return () => controls.stop();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-intro
          aria-hidden
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-bg p-6 sm:p-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span>{profile.name}</span>
            <span>portfolio · {new Date().getFullYear()}</span>
          </div>
          <div className="flex justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid size-16 place-items-center rounded-2xl bg-fg font-pixel text-2xl text-bg"
            >
              {profile.initials}
            </motion.span>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{profile.roles.join(" / ")}</span>
            <span ref={count} className="font-pixel text-5xl tabular-nums text-fg sm:text-7xl">
              000
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
