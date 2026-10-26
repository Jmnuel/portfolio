import { Reveal } from "./Reveal";
import { WordReveal } from "@/components/motion/WordReveal";

export function SectionHeader({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="font-pixel text-fg">{index}</span> — {label}
        </p>
      </Reveal>
      <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
        <WordReveal text={title} wordClassName="text-gradient" delay={0.1} />
      </h2>
      {description && (
        <Reveal delay={0.25}>
          <p className="mt-4 max-w-2xl text-pretty text-muted md:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
