import type { Metadata } from "next";
import { dict } from "@/lib/dict";
import { alternates, type Lang } from "@/lib/i18n";
import { getContent } from "@/lib/localized";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Reveal } from "@/components/ui/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";

export function usesMetadata(lang: Lang): Metadata {
  const t = dict[lang].uses;
  return { title: "Uses", description: t.body, alternates: alternates("/uses", lang) };
}

export function UsesPage({ lang }: { lang: Lang }) {
  const { uses } = getContent(lang);
  const t = dict[lang].uses;
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
        </Reveal>

        <div className="mt-14 space-y-14">
          {uses
            .filter((g) => g.items.length)
            .map((g) => (
              <section key={g.group}>
                <Reveal>
                  <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{g.group}</h2>
                </Reveal>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {g.items.map((item, i) => (
                    <li key={item.name}>
                      <Reveal delay={(i % 2) * 0.06} className="flex h-full gap-4 rounded-2xl border border-border bg-surface p-5">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-fg">
                          {item.icon ? <BrandIcon name={item.icon} className="size-4" /> : <span className="font-pixel text-[10px] text-muted">{"</>"}</span>}
                        </span>
                        <span>
                          <span className="block font-medium text-fg">{item.name}</span>
                          <span className="mt-1 block text-pretty text-sm text-muted">{item.note}</span>
                        </span>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
