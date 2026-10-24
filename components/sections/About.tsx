import Image from "next/image";
import { education, focus, profile } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OnRepeat } from "./OnRepeat";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader index="01" label="about" title="Builder from Samar, shipping for real people." />

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
              alt={`Portrait of ${profile.name}`}
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

      <Reveal className="mt-6">
        <OnRepeat />
      </Reveal>
    </section>
  );
}
