"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { StaticCore } from "./StaticCore";

const NeuralCore = dynamic(() => import("./NeuralCore"), { ssr: false });

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// The light SVG core paints immediately; the 3D core (three.js) only loads once the page has
// finished loading and the browser is idle, then crossfades in. This keeps the heavy library
// out of the critical start-up path on slow phones.
export function HeroVisual() {
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !canUseWebGL()) return;
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => setShow3d(true);
    const start = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go, { timeout: 2500 });
      else timer = setTimeout(go, 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <AnimatePresence>
        {!show3d && (
          <motion.div key="static" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            <StaticCore />
          </motion.div>
        )}
      </AnimatePresence>
      {show3d && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <NeuralCore />
        </motion.div>
      )}
    </div>
  );
}
