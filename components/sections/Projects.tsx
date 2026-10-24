import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeader
        index="02"
        label="projects"
        title="Selected work."
        description="Products for classrooms, disaster response, water service and local artists — all built in and for Catbalogan City."
      />

      <div className="grid gap-6 md:grid-cols-6">
        {projects.map((p, i) => {
          const featured = i === 0;
          return (
            <Reveal
              key={p.slug}
              delay={(i % 2) * 0.08}
              className={featured ? "md:col-span-6" : i === 3 ? "md:col-span-6 lg:col-span-2" : "md:col-span-3 lg:col-span-2"}
            >
              <article
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-border-strong ${
                  featured ? "lg:flex-row" : ""
                }`}
              >
                {featured && <BorderBeam />}
                <Link
                  href={`/projects/${p.slug}`}
                  className={`relative block overflow-hidden border-border ${featured ? "aspect-[16/10] lg:aspect-auto lg:w-3/5 lg:border-r" : "aspect-[16/10] border-b"}`}
                >
                  <Image
                    src={p.image}
                    alt={`${p.name} screenshot`}
                    fill
                    sizes={featured ? "(min-width: 1024px) 680px, 100vw" : "(min-width: 1024px) 380px, 100vw"}
                    className="object-cover object-top grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                    priority={featured}
                  />
                </Link>
                <div className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? "lg:p-8" : ""}`}>
                  <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-widest text-muted">
                    <span>
                      {p.category} · {p.year}
                    </span>
                    <span className="truncate">{p.status}</span>
                  </div>
                  <h3 className={`mt-4 font-semibold tracking-tight text-fg ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                    {p.name}
                  </h3>
                  <p className="mt-1 text-fg/80">{p.tagline}</p>
                  <p className="mt-3 text-pretty text-sm text-muted">{p.summary}</p>
                  {featured && (
                    <ul className="mt-5 grid gap-2 text-sm text-muted sm:grid-cols-2">
                      {p.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex gap-2">
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-fg" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-4 font-mono text-xs text-muted">
                    Role: <span className="text-fg">{p.role}</span>
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center gap-4 pt-6 text-sm">
                    <Link href={`/projects/${p.slug}`} className="group/l inline-flex items-center gap-1.5 text-fg">
                      Case study
                      <ArrowRight className="size-4 transition group-hover/l:translate-x-0.5" />
                    </Link>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted transition hover:text-fg"
                    >
                      Live site <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
