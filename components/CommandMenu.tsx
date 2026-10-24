"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Copy, CornerDownLeft, Moon, Search } from "lucide-react";
import { nav, profile, projects } from "@/lib/content";
import { scrollToId } from "@/lib/scroll";
import { useTheme } from "@/lib/useTheme";

type Item = { group: string; label: string; hint?: string; icon: React.ReactNode; run: () => void };

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggle } = useTheme();

  const items = useMemo<Item[]>(() => {
    const close = () => onOpenChange(false);
    return [
      ...nav.map((n) => ({
        group: "Navigate",
        label: n.label,
        icon: <ArrowRight className="size-4" />,
        run: () => {
          close();
          scrollToId(n.id);
        },
      })),
      ...projects.map((p) => ({
        group: "Projects",
        label: p.name,
        hint: p.category,
        icon: <ArrowUpRight className="size-4" />,
        run: () => {
          close();
          window.location.href = `/projects/${p.slug}`;
        },
      })),
      {
        group: "Actions",
        label: "Copy email",
        hint: profile.email,
        icon: <Copy className="size-4" />,
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          close();
        },
      },
      {
        group: "Actions",
        label: "Open LinkedIn",
        icon: <ArrowUpRight className="size-4" />,
        run: () => window.open(profile.links.linkedin, "_blank", "noopener"),
      },
      ...(profile.links.github
        ? [
            {
              group: "Actions",
              label: "Open GitHub",
              icon: <ArrowUpRight className="size-4" />,
              run: () => window.open(profile.links.github, "_blank", "noopener"),
            },
          ]
        : []),
      {
        group: "Actions",
        label: "Toggle theme",
        icon: <Moon className="size-4" />,
        run: toggle,
      },
    ];
  }, [onOpenChange, toggle]);

  const filtered = items.filter((i) => (i.label + " " + i.group + " " + (i.hint ?? "")).toLowerCase().includes(query.toLowerCase()));

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
                placeholder="Jump to a section, project or action…"
                className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No results.</li>}
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
