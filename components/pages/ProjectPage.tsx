import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { dict } from "@/lib/dict";
import { alternates, localePath, type Lang } from "@/lib/i18n";
import { jsonLdScript, projectJsonLd } from "@/lib/jsonld";
import { getContent } from "@/lib/localized";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/ui/Reveal";

export function projectMetadata(lang: Lang, slug: string): Metadata {
  const project = getContent(lang).projects.find((p) => p.slug === slug);
  if (!project) return {};
  const path = `/projects/${slug}`;
  const description = `${project.tagline} ${project.summary}`;
  return {
    title: project.name,
    description,
    alternates: alternates(path, lang),
    openGraph: { title: project.name, description, url: localePath(lang, path), images: [project.image] },
  };
}

export function ProjectPage({ lang, slug }: { lang: Lang; slug: string }) {
  const { projects } = getContent(lang);
  const t = dict[lang].caseStudy;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  const label = "font-mono text-xs uppercase tracking-[0.2em] text-muted";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(projectJsonLd(p))} />
      <Nav home={false} />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6">
        <Link href={localePath(lang, "/#projects")} className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition hover:text-fg">
          <ArrowLeft className="size-3.5" /> {t.allProjects}
        </Link>

        <Reveal className="mt-8">
          <p className={label}>
            {p.category} · {p.year} · {p.status}
          </p>
          <h1 className="text-gradient mt-4 text-5xl font-semibold tracking-tighter md:text-7xl">{p.name}</h1>
          <p className="mt-4 text-xl text-fg/80 md:text-2xl">{p.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition hover:opacity-90"
            >
              {t.visit} <ArrowUpRight className="size-4" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="group relative mt-12 aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface">
          <Image
            src={p.image}
            alt={`${p.name} screenshot`}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover object-top grayscale transition duration-700 group-hover:grayscale-0"
          />
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-[1fr_260px]">
          <div className="space-y-12">
            <Reveal>
              <h2 className={label}>{t.problem}</h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-fg/90">{p.problem}</p>
            </Reveal>
            <Reveal>
              <h2 className={label}>{t.features}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {p.features.map((f, i) => (
                  <li key={f} className="rounded-xl border border-border bg-surface p-4 text-sm text-fg/90">
                    <span className="font-pixel text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-2">{f}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <aside className="space-y-8 md:sticky md:top-28">
              <div>
                <h2 className={label}>{t.role}</h2>
                <p className="mt-2 text-fg">{p.role}</p>
              </div>
              <div>
                <h2 className={label}>{t.stack}</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              {p.team && (
                <div>
                  <h2 className={label}>{t.team}</h2>
                  <ul className="mt-2 space-y-1.5 text-sm text-fg/90">
                    {p.team.map((member) => (
                      <li key={member}>{member}</li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </Reveal>
        </div>

        <Link
          href={localePath(lang, `/projects/${next.slug}`)}
          data-cursor="Next"
          className="group mt-24 flex items-center justify-between rounded-2xl border border-border bg-surface p-6 transition hover:border-border-strong md:p-8"
        >
          <div>
            <p className={label}>{t.next}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-fg md:text-3xl">{next.name}</p>
          </div>
          <ArrowRight className="size-6 transition group-hover:translate-x-1" />
        </Link>
      </main>
      <Footer lang={lang} />
    </>
  );
}
