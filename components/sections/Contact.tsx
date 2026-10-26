import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/lib/content";
import { BrandIcon, LinkedInIcon } from "@/components/ui/BrandIcon";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { WordReveal } from "@/components/motion/WordReveal";

const links = [
  { label: "Email", href: `mailto:${profile.email}`, icon: <Mail className="size-4" /> },
  { label: "LinkedIn", href: profile.links.linkedin, icon: <LinkedInIcon /> },
  { label: "GitHub", href: profile.links.github, icon: <BrandIcon name="siGithub" /> },
].filter((l) => l.href);

export function Contact() {
  return (
    <section id="contact" className="relative isolate scroll-mt-24 overflow-hidden border-t border-border px-4 py-28 sm:px-6 md:py-40">
      <div className="bg-dots absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      {/* Vertical light beams */}
      <div aria-hidden className="absolute inset-0 -z-10 flex justify-center gap-24 opacity-40">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="relative h-full w-px overflow-hidden bg-fg/[0.06]">
            {/* A soft pulse of light travels down each beam at its own pace. */}
            <span
              className="beam-fall absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-fg/50 to-transparent"
              style={{ animationDuration: `${6 + i * 1.3}s`, animationDelay: `${i * -1.7}s` }}
            />
          </span>
        ))}
      </div>

      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="font-pixel text-fg">06</span> — contact
        </p>
        <h2 className="mt-6 text-5xl font-semibold tracking-tighter text-balance md:text-7xl">
          <WordReveal text="Let's build something." wordClassName="text-gradient" delay={0.15} />
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-muted md:text-lg">
          Open to internships, freelance work and hackathon teams. Send a message — I usually reply within a day.
        </p>
        <div className="mt-10 flex justify-center">
          <Magnetic strength={0.25}>
            <CopyEmail />
          </Magnetic>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition hover:border-border-strong hover:text-fg"
              >
                {l.icon}
                {l.label}
                <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
