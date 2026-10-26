import Link from "next/link";
import { profile } from "@/lib/content";
import { dict } from "@/lib/dict";
import { localePath, type Lang } from "@/lib/i18n";

const link = "underline decoration-border-strong underline-offset-4 transition hover:text-fg";

export function Footer({ lang }: { lang: Lang }) {
  const t = dict[lang].footer;
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 font-mono text-xs text-muted sm:flex-row sm:px-6">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>·</span>
          <Link href={localePath(lang, "/notes")} className={link}>
            {t.notes}
          </Link>
          <Link href={localePath(lang, "/uses")} className={link}>
            {t.uses}
          </Link>
          <Link href={localePath(lang, "/card")} className={link}>
            {t.card}
          </Link>
        </p>
        <p>
          {t.built} · {profile.location}
        </p>
      </div>
    </footer>
  );
}
