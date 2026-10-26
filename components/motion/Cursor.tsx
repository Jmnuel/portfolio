"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { finePointer } from "@/lib/pointer";

// A dot that tracks the pointer exactly and a ring that trails it. Both use difference blending,
// so they invert whatever is underneath and stay visible in either theme. The ring grows over
// links and buttons, and shows a label over elements marked with data-cursor="View" etc.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [text, setText] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!finePointer()) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      const labelled = target?.closest?.("[data-cursor]");
      setLabel(labelled?.getAttribute("data-cursor") ?? null);
      setHover(!!target?.closest?.("a, button, [role=button], summary, label"));
      setText(!!target?.closest?.("input, textarea, [contenteditable=true]"));
    };
    const leave = () => setVisible(false);
    // A click often navigates or opens an overlay, so the old hover state no longer applies.
    const click = () => {
      setLabel(null);
      setHover(false);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("click", click);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("click", click);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  const ringSize = label ? 76 : hover ? 44 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference" style={{ opacity: visible && !text ? 1 : 0 }}>
      <motion.div className="absolute left-0 top-0 size-1.5 rounded-full bg-white" style={{ x, y, translateX: "-50%", translateY: "-50%" }} />
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-white"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: ringSize, height: ringSize, backgroundColor: label ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)" }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-black"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
