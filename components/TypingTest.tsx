"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { closeTyping, useTypingOpen } from "@/lib/typing";
import { useLang } from "@/lib/useLang";

const SECONDS = 30;
const WORDS =
  "react next supabase figma python node vercel android samar catbalogan typescript tailwind firebase leaflet three design deploy commit build ship query schema render state hook route stream prompt model token cache server client mobile web pixel motion vector agent claude gemini codex syneed agos sining andam capstone hackathon team code data map water art classroom rescue".split(
    " ",
  );
const BEST_KEY = "typing-best";

function shuffleWords(n: number) {
  return Array.from({ length: n }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(" ");
}

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function TypingTest() {
  const open = useTypingOpen();
  const { t } = useLang();
  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [best, setBest] = useState(0);
  const field = useRef<HTMLInputElement>(null);
  const caret = useRef<HTMLSpanElement>(null);

  const reset = useCallback(() => {
    setTarget(shuffleWords(80));
    setTyped("");
    setStartedAt(null);
    setNow(0);
    setBest(readBest());
    requestAnimationFrame(() => field.current?.focus());
  }, []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const elapsed = startedAt ? Math.min(SECONDS, (now - startedAt) / 1000) : 0;
  const done = startedAt !== null && elapsed >= SECONDS;

  useEffect(() => {
    if (!startedAt || done) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [startedAt, done]);

  const { correct, wpm, accuracy } = useMemo(() => {
    let ok = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) ok++;
    const minutes = Math.max(elapsed, 1) / 60;
    return {
      correct: ok,
      wpm: Math.round(ok / 5 / minutes),
      accuracy: typed.length ? Math.round((ok / typed.length) * 100) : 100,
    };
  }, [typed, target, elapsed]);

  // Save a new best once the round ends.
  useEffect(() => {
    if (!done || wpm <= best) return;
    setBest(wpm);
    try {
      localStorage.setItem(BEST_KEY, String(wpm));
    } catch {}
  }, [done, wpm, best]);

  useEffect(() => {
    caret.current?.scrollIntoView({ block: "nearest" });
  }, [typed.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeTyping();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onInput = (value: string) => {
    if (done) return;
    if (!startedAt) {
      const n = Date.now();
      setStartedAt(n);
      setNow(n);
    }
    setTyped(value.slice(0, target.length));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.typing.title}
          className="fixed inset-0 z-[65] bg-bg/80 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => requestAnimationFrame(() => field.current?.focus())}
          data-lenis-prevent
        >
          <button
            type="button"
            onClick={closeTyping}
            className="absolute right-4 top-4 rounded-full px-3 py-1.5 font-mono text-xs text-muted transition hover:bg-surface-2 hover:text-fg sm:right-6 sm:top-6"
          >
            <span className="hidden sm:inline">esc</span> ✕
          </button>

          <div className="mx-auto flex h-full max-w-3xl flex-col justify-center px-5 sm:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-pixel text-3xl text-fg sm:text-5xl">{t.typing.title}</h2>
              <span className="font-pixel text-4xl tabular-nums text-fg sm:text-6xl">{Math.ceil(SECONDS - elapsed)}</span>
            </div>
            <p className="mt-2 font-mono text-xs text-muted">{startedAt ? t.typing.hint : t.typing.start}</p>

            {/* Hidden input catches typing on every device, including phone keyboards. */}
            <input
              ref={field}
              value={typed}
              onChange={(e) => onInput(e.target.value)}
              disabled={done}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              aria-label={t.typing.start}
              className="absolute h-px w-px opacity-0"
            />

            <div className="mt-8 h-[7.5em] overflow-hidden font-mono text-xl leading-[2.5em] sm:text-2xl">
              <p className="break-words">
                {target.split("").map((ch, i) => {
                  const state = i < typed.length ? (typed[i] === ch ? "ok" : "bad") : "todo";
                  return (
                    <span
                      key={i}
                      ref={i === typed.length ? caret : undefined}
                      className={`relative ${
                        state === "ok" ? "text-fg" : state === "bad" ? "rounded-sm bg-fg/15 text-muted line-through" : "text-faint"
                      }`}
                    >
                      {i === typed.length && !done && (
                        <span aria-hidden className="absolute -left-px top-[0.55em] h-[1.3em] w-0.5 animate-pulse bg-fg" />
                      )}
                      {ch}
                    </span>
                  );
                })}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-4 font-mono">
              <Stat value={wpm} label={t.typing.wpm} />
              <Stat value={`${accuracy}%`} label={t.typing.accuracy} />
              <Stat value={best || "—"} label={t.typing.best} muted />
              {done && (
                <button
                  type="button"
                  onClick={reset}
                  className="ml-auto rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
                >
                  {t.typing.again}
                </button>
              )}
            </div>
            <p className="sr-only" aria-live="polite">
              {done ? `${wpm} ${t.typing.wpm}, ${accuracy}% ${t.typing.accuracy}, ${correct}` : ""}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ value, label, muted }: { value: string | number; label: string; muted?: boolean }) {
  return (
    <div>
      <p className={`font-pixel text-3xl tabular-nums ${muted ? "text-muted" : "text-fg"}`}>{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">{label}</p>
    </div>
  );
}
