"use client";

import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

export default function NotFound() {
  const { lang, t } = useLang();
  return (
    <main className="bg-dots grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="font-pixel text-7xl text-fg">404</p>
        <p className="mt-4 text-muted">{t.notFound.body}</p>
        <Link
          href={localePath(lang, "/")}
          className="mt-8 inline-block rounded-full border border-border-strong px-5 py-2.5 text-sm text-fg transition hover:bg-surface-2"
        >
          {t.notFound.home}
        </Link>
      </div>
    </main>
  );
}
