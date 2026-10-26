import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CardBack, CardFront } from "@/components/card/CardSides";
import { CardActions } from "@/components/card/CardActions";
import { Reveal } from "@/components/ui/Reveal";
import { cardQrSvg } from "@/lib/card";
import { profile } from "@/lib/content";
import { dict } from "@/lib/dict";
import { alternates, type Lang } from "@/lib/i18n";

export function cardMetadata(lang: Lang): Metadata {
  const t = dict[lang].card;
  return {
    title: "Digital card",
    description: `${profile.name} — ${t.body}`,
    alternates: alternates("/card", lang),
  };
}

// The card faces stay in English (the standard for business cards); the page around them is localized.
export async function CardPage({ lang }: { lang: Lang }) {
  const qrSvg = await cardQrSvg();
  const t = dict[lang].card;
  const label = "mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted";
  return (
    <>
      <Nav home={false} />
      <main id="main" className="bg-dots mx-auto min-h-dvh max-w-6xl px-4 pb-24 pt-32 sm:px-6">
        <Reveal className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.eyebrow}</p>
          <h1 className="text-gradient mt-4 text-4xl font-semibold tracking-tighter md:text-6xl">{t.title}</h1>
          <p className="mx-auto mt-4 max-w-md text-pretty text-muted">{t.body}</p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          <Reveal delay={0.05}>
            <p className={label}>{t.front}</p>
            <CardFront />
          </Reveal>
          <Reveal delay={0.15}>
            <p className={label}>{t.back}</p>
            <CardBack qrSvg={qrSvg} />
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-10">
          <CardActions />
          <p className="mt-4 text-center font-mono text-[11px] text-muted">{t.pngNote}</p>
        </Reveal>
      </main>
      <Footer lang={lang} />
    </>
  );
}
