import type { Lang } from "@/lib/i18n";
import { getContent } from "@/lib/localized";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Reveal } from "@/components/ui/Reveal";

export function Stats({ lang }: { lang: Lang }) {
  const { stats } = getContent(lang);
  return (
    <section className="border-y border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className={`px-4 py-8 sm:px-6 md:py-10 ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} ${
              i === 2 ? "md:border-l" : ""
            } border-border`}
          >
            <p className="font-pixel text-4xl text-fg md:text-5xl">
              <NumberTicker value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
