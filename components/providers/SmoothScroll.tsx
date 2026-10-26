"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { setLenis } from "@/lib/scroll";

function LenisBridge() {
  const lenis = useLenis();
  useEffect(() => {
    setLenis(lenis);
    return () => setLenis(undefined);
  }, [lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  // reducedMotion="user": with the OS "reduce motion" setting on, motion keeps fades but
  // drops movement (slides, tilts, parallax) across the whole site.
  const content = <MotionConfig reducedMotion="user">{children}</MotionConfig>;
  if (reduced) return content;
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -72 } }}>
      <LenisBridge />
      {content}
    </ReactLenis>
  );
}
