import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { hackathons, projects } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Hackathons() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader index="05" label="hackathons" title="Built under pressure." />
      <div className="grid gap-6 md:grid-cols-2">
        {hackathons.map((h) => {
          const project = projects.find((p) => p.name === h.project);
          return (
            <Reveal key={h.name} className="bg-dots relative overflow-hidden rounded-2xl border border-border bg-surface p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-11 place-items-center rounded-xl border border-border-strong">
                  <Trophy className="size-5" />
                </div>
                <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">{h.result}</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-fg">{h.name}</h3>
              <p className="mt-1 text-sm text-muted">{h.full}</p>
              <dl className="mt-6 grid gap-3 font-mono text-xs">
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted">WHERE</dt>
                  <dd className="text-fg">{h.where}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted">HOST</dt>
                  <dd className="text-fg">{h.host}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-muted">BUILT</dt>
                  <dd className="text-fg">{h.project}</dd>
                </div>
              </dl>
              {project && (
                <Link href={`/projects/${project.slug}`} className="group mt-8 inline-flex items-center gap-1.5 text-sm text-fg">
                  See {project.name} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </Link>
              )}
            </Reveal>
          );
        })}
        <Reveal delay={0.1} className="grid place-items-center rounded-2xl border border-dashed border-border p-8 text-center">
          <div>
            <p className="font-pixel text-sm text-muted">NEXT_HACKATHON.exe</p>
            <p className="mt-2 text-sm text-muted">Always looking for the next 48-hour build.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
