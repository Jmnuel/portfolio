import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { dict } from "@/lib/dict";
import { alternates, localePath, type Lang } from "@/lib/i18n";
import { formatDate, getNote, getNotes } from "@/lib/notes";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";

export function notesMetadata(lang: Lang): Metadata {
  const t = dict[lang].notes;
  return { title: t.title.replace(/\.$/, ""), description: t.body, alternates: alternates("/notes", lang) };
}

export async function noteMetadata(lang: Lang, slug: string): Promise<Metadata> {
  const note = await getNote(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary,
    alternates: alternates(`/notes/${slug}`, lang),
    openGraph: { type: "article", title: note.title, description: note.summary, publishedTime: note.date },
  };
}

export async function NotesIndex({ lang }: { lang: Lang }) {
  const notes = await getNotes();
  const t = dict[lang].notes;
  return (
    <>
      <Nav home={false} />
      <main id="main" className="mx-auto min-h-dvh max-w-4xl px-4 pb-24 pt-32 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.eyebrow}</p>
        </Reveal>
        <h1 className="mt-4 text-4xl font-semibold tracking-tighter md:text-6xl">
          <WordReveal text={t.title} wordClassName="text-gradient" />
        </h1>
        <Reveal delay={0.15}>
          <p className="mt-4 max-w-xl text-pretty text-muted">{t.body}</p>
          {t.englishOnly && <p className="mt-2 font-mono text-xs text-muted">{t.englishOnly}</p>}
        </Reveal>

        <ul className="mt-12 divide-y divide-border border-y border-border">
          {notes.map((n, i) => (
            <li key={n.slug}>
              <Reveal delay={i * 0.06}>
                <Link
                  href={localePath(lang, `/notes/${n.slug}`)}
                  data-cursor={t.read}
                  className="group grid gap-2 py-8 transition-colors md:grid-cols-[160px_1fr_auto] md:items-baseline md:gap-8"
                >
                  <span className="font-mono text-xs text-muted">{formatDate(n.date, lang)}</span>
                  <span>
                    <span className="block text-xl font-medium tracking-tight text-fg md:text-2xl">{n.title}</span>
                    <span className="mt-2 block text-pretty text-sm text-muted">{n.summary}</span>
                    <span className="mt-3 flex flex-wrap gap-1.5">
                      {n.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted">
                          {tag}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-muted transition group-hover:text-fg">
                    {t.minRead(n.minutes)} <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </main>
      <Footer lang={lang} />
    </>
  );
}

export async function NotePage({ lang, slug }: { lang: Lang; slug: string }) {
  const note = await getNote(slug);
  if (!note) notFound();
  const t = dict[lang].notes;
  return (
    <>
      <Nav home={false} />
      <main id="main" className="mx-auto min-h-dvh max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <Link href={localePath(lang, "/notes")} className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition hover:text-fg">
          <ArrowLeft className="size-3.5" /> {t.back}
        </Link>
        <Reveal className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {formatDate(note.date, lang)} · {t.minRead(note.minutes)}
          </p>
          <h1 className="text-gradient mt-4 text-4xl font-semibold tracking-tighter text-balance md:text-5xl">{note.title}</h1>
          <p className="mt-4 text-pretty text-lg text-muted">{note.summary}</p>
        </Reveal>
        <Reveal delay={0.1}>
          {/* Notes are Markdown files from this repo, rendered at build time. */}
          <article className="note-body mt-12" dangerouslySetInnerHTML={{ __html: note.html }} />
        </Reveal>
      </main>
      <Footer lang={lang} />
    </>
  );
}
