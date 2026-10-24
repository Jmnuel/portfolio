import { experience } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader index="03" label="experience" title="What I've been building." />

      <ol className="relative border-l border-border md:ml-40">
        {experience.map((e, i) => (
          <li key={e.title + e.org} className="relative pb-12 pl-8 last:pb-0">
            <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border border-fg bg-bg" />
            <Reveal delay={i * 0.06}>
              <p className="font-mono text-xs uppercase tracking-widest text-muted md:absolute md:-left-48 md:top-1 md:w-32 md:text-right">
                {e.period}
              </p>
              <h3 className="mt-1 text-lg font-medium text-fg md:mt-0">{e.title}</h3>
              <p className="font-mono text-sm text-muted">{e.org}</p>
              <p className="mt-2 max-w-2xl text-pretty text-muted">{e.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
