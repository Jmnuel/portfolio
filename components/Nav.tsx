"use client";

import { useState } from "react";
import Link from "next/link";
import { Command } from "lucide-react";
import { motion } from "motion/react";
import { nav, profile } from "@/lib/content";
import { CommandMenu } from "./CommandMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Nav({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav className="flex w-full max-w-3xl items-center gap-1 rounded-full border border-border bg-bg/70 p-1.5 pl-4 backdrop-blur-xl">
          <Link href="/" className="mr-auto flex items-center gap-2 font-pixel text-sm tracking-wider text-fg">
            <span className="grid size-6 place-items-center rounded-md bg-fg text-[10px] text-bg">{profile.initials}</span>
            <span className="hidden sm:inline">{profile.shortName.toUpperCase()}</span>
          </Link>
          <ul className="hidden items-center md:flex">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={home ? `#${n.id}` : `/#${n.id}`}
                  className="rounded-full px-3 py-1.5 text-sm text-muted transition hover:text-fg"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open command menu"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted transition hover:border-border-strong hover:text-fg"
          >
            <Command className="size-3.5" />K
          </button>
          <ThemeToggle />
        </nav>
      </motion.header>
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  );
}
