import { stack } from "@/lib/content";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Marquee } from "@/components/ui/Marquee";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Stack() {
  return (
    <section id="stack" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          index="04"
          label="stack"
          title="Tools I reach for."
          description="Languages, frameworks, databases and the AI tools that make up my day-to-day."
        />
      </div>
      <div className="space-y-4">
        {stack.map((row, i) => (
          <Marquee key={i} reverse={i === 1} duration={i === 1 ? "45s" : "38s"}>
            {row.map((t) => (
              <span
                key={t.name}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-surface px-5 py-3 text-sm text-fg"
              >
                {t.icon ? <BrandIcon name={t.icon} className="size-4" /> : <span className="font-pixel text-xs text-muted">{"</>"}</span>}
                {t.name}
              </span>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
