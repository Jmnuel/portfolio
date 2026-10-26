"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { finePointer } from "@/lib/pointer";

// A card that tilts a few degrees toward the pointer, with a soft light following it.
export function TiltCard({ children, className, max = 5 }: { children: React.ReactNode; className?: string; max?: number }) {
  const [enabled, setEnabled] = useState(false);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionValue(0);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, color-mix(in oklab, var(--fg) 9%, transparent), transparent 65%)`;

  useEffect(() => setEnabled(finePointer()), []);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
    glow.set(1);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
    glow.set(0);
  };

  return (
    <motion.article
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
        style={{ background: glare, opacity: glow }}
      />
    </motion.article>
  );
}
