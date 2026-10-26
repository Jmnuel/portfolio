import Image from "next/image";
import { dict } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";
import { getContent } from "@/lib/localized";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function About({ lang }: { lang: Lang }) {
  const { profile, education, focus, now } = getContent(lang);
  const t = dict[lang];
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader index="01" label={t.sections.about.label} title={t.sections.about.title} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Terminal-style intro card */}
        <Reveal className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-faint" />
            <span className="size-2.5 rounded-full bg-faint" />
            <span className="size-2.5 rounded-full bg-faint" />
            <span className="ml-3 font-mono text-xs text-muted">~/manuel — zsh</span>
          </div>
          <div className="space-y-4 p-5 font-mono text-sm leading-relaxed sm:p-6">
            <p>
              <span className="text-muted">$</span> whoami
            </p>
            <p className="text-pretty text-fg/90">{profile.bio}</p>
            <p>
              <span className="text-muted">$</span> cat education.txt
            </p>
            <div className="text-fg/90">
              <p>{education.course}</p>
              <p className="text-muted">
                {education.school} · {education.place}
              </p>
            </div>
            <p>
              <span className="text-muted">$</span> echo $FOCUS
            </p>
            <p className="text-fg/90">{profile.roles.join(" · ")}</p>
            <p className="flex items-center gap-1">
              <span className="text-muted">$</span>
              <span className="inline-block h-4 w-2 animate-pulse bg-fg" />
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="halftone relative aspect-square w-full lg:aspect-auto lg:h-full">
            <Image
              src={profile.photo}
              alt={`${t.about.portrait} ${profile.name}`}
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover object-top grayscale contrast-125"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg to-transparent p-5 pt-16">
            <p className="font-pixel text-lg text-fg">{profile.name}</p>
            <p className="font-mono text-xs text-muted">{profile.location}</p>
          </div>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {focus.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08} className="rounded-2xl border border-border bg-surface p-6">
            <p className="font-pixel text-xs text-muted">0{i + 1}</p>
            <h3 className="mt-3 text-lg font-medium text-fg">{f.title}</h3>
            <p className="mt-2 text-pretty text-sm text-muted">{f.body}</p>
          </Reveal>
        ))}
      </div>

      {/* Now: what Manuel is focused on at the moment */}
      <Reveal className="mt-6">
        <div className="bg-dots grid gap-6 rounded-2xl border border-border bg-surface p-6 md:grid-cols-[220px_1fr] md:p-8">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-fg/60" />
                <span className="relative inline-flex size-2 rounded-full bg-fg" />
              </span>
              {t.now.label}
            </p>
            <h3 className="mt-3 text-xl font-medium text-fg">{t.now.title}</h3>
            <p className="mt-1 font-mono text-xs text-muted">
              {t.now.updated} {now.updated}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {now.items.map((item, i) => (
              <li key={item} className="flex gap-3 text-pretty text-sm text-fg/90">
                <span className="font-pixel text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
