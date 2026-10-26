import { stack } from "@/lib/content";
import { dict } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Marquee } from "@/components/ui/Marquee";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GithubActivity } from "./GithubActivity";

export function Stack({ lang }: { lang: Lang }) {
  const t = dict[lang].sections.stack;
  return (
    <section id="stack" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader index="04" label={t.label} title={t.title} description={t.description} />
      </div>
      <div className="space-y-4">
        {stack.map((row, i) => (
          <Marquee key={i} reverse={i === 1} duration={i === 1 ? "45s" : "38s"}>
            {row.map((tool) => (
              <span
                key={tool.name}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-surface px-5 py-3 text-sm text-fg"
              >
                {tool.icon ? <BrandIcon name={tool.icon} className="size-4" /> : <span className="font-pixel text-xs text-muted">{"</>"}</span>}
                {tool.name}
              </span>
            ))}
          </Marquee>
        ))}
      </div>
      <GithubActivity lang={lang} />
    </section>
  );
}
