"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Command, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { openChat } from "@/lib/chat";
import { nav, profile } from "@/lib/content";
import { introDelay } from "@/lib/intro";
import { Magnetic } from "./motion/Magnetic";
import { ChatPanel } from "./chat/ChatPanel";
import { CommandMenu } from "./CommandMenu";
import { SoundToggle } from "./SoundToggle";
import { ThemeToggle } from "./ThemeToggle";

// The section currently in the middle band of the viewport (home page only).
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const sections = nav.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const onTop = () => window.scrollY < window.innerHeight * 0.5 && setActive(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [enabled]);
  return active;
}

export function Nav({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(home);
  const [hovered, setHovered] = useState<string | null>(null);
  // The pill follows the hovered link, then settles back on the section in view.
  const pill = hovered ?? active;

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: introDelay() }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav className="flex w-full max-w-3xl items-center gap-1 rounded-full border border-border bg-bg/70 p-1.5 pl-4 backdrop-blur-xl">
          <Link href="/" className="mr-auto flex items-center gap-2 font-pixel text-sm tracking-wider text-fg">
            <span className="grid size-6 place-items-center rounded-md bg-fg text-[10px] text-bg">{profile.initials}</span>
            <span className="hidden sm:inline">{profile.shortName.toUpperCase()}</span>
          </Link>
          <ul className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
            {nav.map((n) => (
              <li key={n.id} className="relative">
                {pill === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-surface-2"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <a
                  href={home ? `#${n.id}` : `/#${n.id}`}
                  onPointerEnter={() => setHovered(n.id)}
                  aria-current={active === n.id ? "location" : undefined}
                  className={`relative rounded-full px-3 py-1.5 text-sm transition-colors hover:text-fg ${active === n.id ? "text-fg" : "text-muted"}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <Magnetic strength={0.25} className="mr-1 inline-flex">
            <button
              type="button"
              onClick={() => openChat()}
              className="flex items-center gap-1.5 rounded-full bg-fg px-3 py-1.5 text-xs font-medium text-bg transition-opacity hover:opacity-90"
            >
              <Sparkles className="size-3.5" />
              Ask AI
            </button>
          </Magnetic>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open command menu"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted transition hover:border-border-strong hover:text-fg"
          >
            <Command className="size-3.5" />K
          </button>
          <SoundToggle />
          <ThemeToggle />
        </nav>
      </motion.header>
      <CommandMenu open={open} onOpenChange={setOpen} />
      <ChatPanel />
    </>
  );
}
