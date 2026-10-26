"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { dict } from "./dict";
import { HTML_LANG, langFromPath } from "./i18n";

// Client components read the language from the URL; server components get it as a prop.
export function useLang() {
  const lang = langFromPath(usePathname() ?? "/");
  return { lang, t: dict[lang] };
}

// Keeps <html lang> in sync with the page (the root layout is shared by both languages).
export function LangSync() {
  const { lang } = useLang();
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);
  return null;
}
