"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { openChat } from "@/lib/chat";
import { getContent } from "@/lib/localized";
import { useLang } from "@/lib/useLang";
import { introDelay } from "@/lib/intro";
import { HyperText } from "@/components/ui/HyperText";
import { Spotlight } from "@/components/ui/Spotlight";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Magnetic } from "@/components/motion/Magnetic";
import { HeroVisual } from "./HeroVisual";

const ease = [0.22, 1, 0.36, 1] as const;
const item = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: delay + introDelay(), ease },
});
// The name and headline are the page's largest text, so they're visible from the first paint
// (good for load speed) and only slide into place.
const slide = (delay: number) => ({
  initial: { y: 20 },
  animate: { y: 0 },
  transition: { duration: 0.8, delay: delay + introDelay(), ease },
});

export function Hero() {
  const { lang, t } = useLang();
  const { profile } = getContent(lang);
  const section = useRef<HTMLElement>(null);
  // As the hero scrolls away, the copy lifts and fades while the 3D core drifts slower (parallax).
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <section ref={section} className="relative isolate flex min-h-dvh items-center overflow-hidden pb-20 pt-32">
      <div className="bg-dots absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Spotlight />
      <motion.div style={{ y: visualY }} className="absolute inset-0 -z-10 opacity-60 lg:left-[38%] lg:opacity-100">
        <HeroVisual />
      </motion.div>
      {/* Keeps text readable where it overlaps the particles on small screens */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/70 to-transparent lg:via-bg/20" />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="max-w-2xl">
          <motion.div {...item(0.1)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-xs text-muted backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-fg/60" />
                <span className="relative inline-flex size-2 rounded-full bg-fg" />
              </span>
              {profile.status}
            </span>
          </motion.div>

          <motion.h1 {...slide(0.2)} className="mt-6 font-semibold leading-[0.95] tracking-tighter">
            <span className="block text-sm font-normal tracking-normal text-muted">{t.hero.hi}</span>
            <HyperText
              text={profile.name.toUpperCase()}
              delay={introDelay() * 1000}
              className="text-gradient mt-2 block text-5xl sm:text-6xl md:text-7xl"
            />
          </motion.h1>

          <motion.p {...item(0.35)} className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:text-sm">
            {profile.roles.map((r, i) => (
              <span key={r} className="flex items-center gap-3">
                {i > 0 && <span className="text-faint">/</span>}
                <span className="text-fg">{r}</span>
              </span>
            ))}
          </motion.p>

          <motion.p {...slide(0.45)} className="mt-6 max-w-xl text-pretty text-lg text-muted md:text-xl">
            {profile.headline}
          </motion.p>

          <motion.div {...item(0.55)} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition hover:opacity-90"
              >
                {t.hero.viewProjects}
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <CopyEmail />
            </Magnetic>
          </motion.div>

          <motion.p {...item(0.65)} className="mt-6 flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted">
            <MapPin className="size-3.5" /> {profile.location} · {t.hero.press}{" "}
            <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">Ctrl/⌘ K</kbd> {t.hero.toNavigate}{" "}
            <button type="button" onClick={() => openChat()} className="inline-flex items-center gap-1 text-fg underline decoration-border-strong underline-offset-4 transition hover:decoration-fg">
              <Sparkles className="size-3" /> {t.hero.askAssistant}
            </button>
          </motion.p>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label={t.hero.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 + introDelay() }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
      >
        {t.hero.scroll}
        <ArrowDown className="size-3.5 animate-bounce" />
      </motion.a>
    </section>
  );
}
