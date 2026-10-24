import type Lenis from "lenis";

let instance: Lenis | undefined;

export function setLenis(lenis: Lenis | undefined) {
  instance = lenis;
}

// Scrolls through Lenis when it is running, otherwise natively.
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
