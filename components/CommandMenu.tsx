"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Copy, CornerDownLeft, Keyboard, Languages, Moon, Search, Sparkles, Volume2 } from "lucide-react";
import { openChat } from "@/lib/chat";
import { profile } from "@/lib/content";
import { localePath, switchPath } from "@/lib/i18n";
import { getContent } from "@/lib/localized";
import { scrollToId } from "@/lib/scroll";
import { toggleSound } from "@/lib/sound";
import { openTyping } from "@/lib/typing";
import { useLang } from "@/lib/useLang";
import { useTheme } from "@/lib/useTheme";

type Item = { group: string; label: string; hint?: string; icon: React.ReactNode; run: () => void };

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggle } = useTheme();
  const { lang, t } = useLang();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const c = t.command;

  const items = useMemo<Item[]>(() => {
    const close = () => onOpenChange(false);
    const go = (path: string) => () => {
      close();
      router.push(localePath(lang, path));
    };
    const { nav, projects } = getContent(lang);
    const onHome = pathname === localePath(lang, "/");
    return [
      ...nav.map((n) => ({
        group: c.groups.navigate,
        label: n.label,
        icon: <ArrowRight className="size-4" />,
        run: () => {
          close();
          if (onHome) scrollToId(n.id);
          else router.push(localePath(lang, `/#${n.id}`));
        },
      })),
      ...projects.map((p) => ({
        group: c.groups.projects,
        label: p.name,
        hint: p.category,
        icon: <ArrowUpRight className="size-4" />,
        run: go(`/projects/${p.slug}`),
      })),
      { group: c.groups.pages, label: c.notes, icon: <ArrowUpRight className="size-4" />, run: go("/notes") },
      { group: c.groups.pages, label: c.uses, icon: <ArrowUpRight className="size-4" />, run: go("/uses") },
      { group: c.groups.pages, label: c.card, hint: c.cardHint, icon: <ArrowUpRight className="size-4" />, run: go("/card") },
      {
        group: c.groups.actions,
        label: c.copyEmail,
        hint: profile.email,
        icon: <Copy className="size-4" />,
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          close();
        },
      },
      {
        group: c.groups.actions,
        label: c.linkedin,
        icon: <ArrowUpRight className="size-4" />,
        run: () => window.open(profile.links.linkedin, "_blank", "noopener"),
      },
      ...(profile.links.github
        ? [
            {
              group: c.groups.actions,
              label: c.github,
              icon: <ArrowUpRight className="size-4" />,
              run: () => window.open(profile.links.github, "_blank", "noopener"),
            },
          ]
        : []),
      {
        group: c.groups.actions,
        label: c.language,
        icon: <Languages className="size-4" />,
        run: () => {
          close();
          router.push(switchPath(pathname, lang === "en" ? "fil" : "en"));
        },
      },
      { group: c.groups.actions, label: c.theme, icon: <Moon className="size-4" />, run: toggle },
      { group: c.groups.actions, label: c.sound, icon: <Volume2 className="size-4" />, run: toggleSound },
      {
        group: c.groups.actions,
        label: c.typing,
        hint: c.typingHint,
        icon: <Keyboard className="size-4" />,
        run: () => {
          close();
          openTyping();
        },
      },
    ];
  }, [onOpenChange, toggle, lang, c, router, pathname]);

  const matches = items.filter((i) => (i.label + " " + i.group + " " + (i.hint ?? "")).toLowerCase().includes(query.toLowerCase()));
  const question = query.trim();
  const ask: Item = {
    group: c.groups.ai,
    label: question ? c.askAiQuestion(question) : c.askAi,
    icon: <Sparkles className="size-4" />,
    run: () => {
      onOpenChange(false);
      openChat(question);
    },
  };
  // Empty: AI first. Typed text that matches nothing becomes a question; otherwise matches come first.
  const filtered = !question ? [ask, ...matches] : matches.length ? [...matches, ask] : [ask];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onOpenChange(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") filtered[active]?.run();
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-start justify-center bg-bg/60 px-4 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onOpenChange(false)}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-2xl"
            initial={{ y: 12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder={c.placeholder}
                className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">{c.noResults}</li>}
              {filtered.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                return (
                  <li key={item.group + item.label}>
                    {header && (
                      <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted">{header}</p>
                    )}
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={item.run}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        i === active ? "bg-surface-2 text-fg" : "text-muted"
                      }`}
                    >
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {item.hint && <span className="truncate font-mono text-xs text-muted">{item.hint}</span>}
                      {i === active && <CornerDownLeft className="size-3.5 text-muted" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
