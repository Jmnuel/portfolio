import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { dict } from "@/lib/dict";
import { localePath, type Lang } from "@/lib/i18n";
import { getContent } from "@/lib/localized";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Hackathons({ lang }: { lang: Lang }) {
  const { hackathons, projects } = getContent(lang);
  const t = dict[lang];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader
        index="05"
        label={t.sections.hackathons.label}
        title={t.sections.hackathons.title}
        description={t.sections.hackathons.description}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {hackathons.map((h, i) => {
          const project = projects.find((p) => p.name === h.project);
          const rows = [
            [t.hackathons.date, h.date],
            [t.hackathons.theme, h.theme],
            [t.hackathons.team, h.team],
            [t.hackathons.where, h.where],
            [t.hackathons.host, h.host],
            ...(h.project ? [[t.hackathons.built, h.stage ? `${h.project} · ${h.stage}` : h.project]] : []),
          ];
          return (
            <Reveal
              key={h.name}
              delay={i * 0.08}
              className="bg-dots relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-11 place-items-center rounded-xl border border-border-strong">
                  <Trophy className="size-5" />
                </div>
                <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">{h.result}</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-fg">{h.name}</h3>
              <p className="mt-1 text-sm text-muted">{h.full}</p>
              <dl className="mt-6 grid gap-3 font-mono text-xs">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="w-20 shrink-0 text-muted">{k}</dt>
                    <dd className="text-pretty text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
              {project && (
                <Link
                  href={localePath(lang, `/projects/${project.slug}`)}
                  className="group mt-8 inline-flex items-center gap-1.5 self-start text-sm text-fg"
                >
                  {t.hackathons.see} {project.name} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </Link>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
