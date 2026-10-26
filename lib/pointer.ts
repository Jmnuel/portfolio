// Mouse-driven effects (custom cursor, magnetic buttons, card tilt) only run on precise pointers
// and never when the visitor prefers reduced motion.
export function finePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
