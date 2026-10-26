import type { Lang } from "@/lib/i18n";
import { jsonLdScript, personJsonLd, projectListJsonLd } from "@/lib/jsonld";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/hero/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Stack } from "@/components/sections/Stack";
import { Hackathons } from "@/components/sections/Hackathons";
import { Contact } from "@/components/sections/Contact";

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(personJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(projectListJsonLd())} />
      <Nav />
      <main id="main">
        <Hero />
        <Stats lang={lang} />
        <About lang={lang} />
        <Projects lang={lang} />
        <Experience lang={lang} />
        <Stack lang={lang} />
        <Hackathons lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
