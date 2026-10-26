// How long the first-visit intro covers the page, so entrance animations can wait for it.
export const INTRO_SECONDS = 1.35;

let active: boolean | null = null;

// Decided once per page load by the inline script in app/layout.tsx (the "no-intro" class).
export function introActive() {
  if (typeof document === "undefined") return false;
  active ??= !document.documentElement.classList.contains("no-intro");
  return active;
}

// Extra delay for entrance animations that would otherwise play behind the intro.
export const introDelay = () => (introActive() ? INTRO_SECONDS - 0.25 : 0);
