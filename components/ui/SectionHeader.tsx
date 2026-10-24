import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        <span className="font-pixel text-fg">{index}</span> — {label}
      </p>
      <h2 className="text-gradient mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-4 max-w-2xl text-pretty text-muted md:text-lg">{description}</p>}
    </Reveal>
  );
}
