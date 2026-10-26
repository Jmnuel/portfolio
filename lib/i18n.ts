// English lives at the root ("/", "/projects/x"); Filipino mirrors every page under "/fil".
export type Lang = "en" | "fil";
export const LANGS: Lang[] = ["en", "fil"];
export const LANG_LABEL: Record<Lang, string> = { en: "EN", fil: "FIL" };
export const HTML_LANG: Record<Lang, string> = { en: "en", fil: "fil" };

// Builds a link for a language: localePath("fil", "/#about") -> "/fil#about".
export function localePath(lang: Lang, path: string) {
  if (lang === "en") return path;
  if (path === "/" || path === "") return "/fil";
  if (path.startsWith("/#")) return `/fil${path.slice(1)}`;
  return `/fil${path}`;
}

export function langFromPath(pathname: string): Lang {
  return pathname === "/fil" || pathname.startsWith("/fil/") ? "fil" : "en";
}

// The same page in the other language, for the language switch and hreflang links.
export function switchPath(pathname: string, to: Lang) {
  const base = langFromPath(pathname) === "fil" ? pathname.slice(4) || "/" : pathname;
  return localePath(to, base);
}

// hreflang alternates for a page's metadata.
export function alternates(path: string, lang: Lang) {
  return {
    canonical: localePath(lang, path),
    languages: { en: localePath("en", path), fil: localePath("fil", path), "x-default": localePath("en", path) },
  };
}
