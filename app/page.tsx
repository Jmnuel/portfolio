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
import { jsonLdScript, personJsonLd, projectListJsonLd } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(personJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(projectListJsonLd())} />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <About />
        <Projects />
        <Experience />
        <Stack />
        <Hackathons />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
