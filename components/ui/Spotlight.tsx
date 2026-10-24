"use client";

import { useEffect, useRef } from "react";

// A soft light that follows the cursor inside its relative parent.
export function Spotlight({ size = 520 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      el.style.setProperty("--x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      el.style.opacity = "1";
    };
    const onLeave = () => (el.style.opacity = "0");
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
      style={{
        background: `radial-gradient(${size}px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklab, var(--fg) 7%, transparent), transparent 70%)`,
      }}
    />
  );
}
