"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
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
  if (reduced) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -72 } }}>
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
