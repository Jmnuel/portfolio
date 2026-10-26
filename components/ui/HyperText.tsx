"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";

// Scrambles letters into place on mount and again on hover.
export function HyperText({
  text,
  className,
  duration = 900,
  delay = 0,
}: {
  text: string;
  className?: string;
  duration?: number;
  delay?: number; // ms before the first scramble
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  const run = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(progress * text.length);
      setDisplay(
        text
          .split("")
          .map((ch, i) => (ch === " " || i < revealed ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    const id = setTimeout(run, delay);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(frame.current);
    };
  }, [run, delay]);

  return (
    <span className={className} onMouseEnter={run} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
