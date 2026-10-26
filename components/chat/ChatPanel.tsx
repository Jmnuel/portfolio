"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/lib/content";
import { closeChat, takePendingQuestion, useChatState } from "@/lib/chat";
import { useLang } from "@/lib/useLang";

type Message = { role: "user" | "assistant"; content: string };

const linkClass = "underline decoration-border-strong underline-offset-4 hover:decoration-current";

// Renders [label](url), **bold** and bare URLs as React nodes (never as HTML), so answers stay safe to display.
function RichText({ text }: { text: string }) {
  return text.split(/(\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*\n]+\*\*|https?:\/\/[^\s)<>"]+)/g).map((part, i) => {
    const md = part.match(/^\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (md) {
      return (
        <a key={i} href={md[2]} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {md[1]}
        </a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-fg">
          <RichText text={part.slice(2, -2)} />
        </strong>
      );
    }
    if (/^https?:\/\//.test(part)) {
      const url = part.replace(/[.,;:!?]+$/, "");
      return (
        <span key={i}>
          <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
          {part.slice(url.length)}
        </span>
      );
    }
    return part;
  });
}

function Caret() {
  return <span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] animate-pulse bg-fg" />;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">{children}</kbd>;
}

export function ChatPanel() {
  const { t } = useLang();
  const c = t.chat;
  const { open, pending } = useChatState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(0);
  const abort = useRef<AbortController | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const suggestion = c.suggestions[hint % c.suggestions.length];

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;
      const history: Message[] = [...messages, { role: "user", content: question }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
      setBusy(true);

      const controller = new AbortController();
      abort.current = controller;
      const append = (chunk: string) =>
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          append(
            res.status === 429 ? c.errors.rateLimited : res.status === 503 ? `${c.errors.notConfigured} ${profile.email}.` : c.errors.generic,
          );
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          append(decoder.decode(value, { stream: true }));
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") append(c.errors.connection);
      } finally {
        setBusy(false);
        abort.current = null;
        requestAnimationFrame(() => field.current?.focus());
      }
    },
    [busy, messages, c],
  );

  // A question handed over from the command menu or hero is sent as soon as the panel opens.
  useEffect(() => {
    if (!open) return;
    const q = takePendingQuestion();
    if (q) void send(q);
    else requestAnimationFrame(() => field.current?.focus());
  }, [open, pending, send]);

  // Cycle the placeholder through suggested questions while the field is empty.
  useEffect(() => {
    if (!open || input) return;
    const id = setInterval(() => setHint((h) => h + 1), 3500);
    return () => clearInterval(id);
  }, [open, input]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Grow the textarea with its content.
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const reset = () => {
    abort.current?.abort();
    setMessages([]);
    setInput("");
    field.current?.focus();
  };

  const empty = messages.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Ask Manuel's AI assistant"
          className="fixed inset-0 z-[65] bg-bg/75 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-lenis-prevent
        >
          {/* Corner controls */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2 font-mono text-xs text-muted sm:right-6 sm:top-6">
            {!empty && (
              <button type="button" onClick={reset} className="rounded-full px-3 py-1.5 transition hover:bg-surface-2 hover:text-fg">
                {c.newChat}
              </button>
            )}
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close"
              className="flex items-center gap-2 rounded-full px-3 py-1.5 transition hover:bg-surface-2 hover:text-fg"
            >
              <span className="hidden sm:inline">esc</span> ✕
            </button>
          </div>

          <div ref={list} className="h-full overflow-y-auto">
            <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-5 py-24 sm:px-8">
              {empty ? (
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-pixel text-4xl leading-tight text-fg sm:text-6xl"
                >
                  {c.prompt}
                </motion.h2>
              ) : (
                <div className="space-y-10">
                  {messages.map((m, i) =>
                    m.role === "user" ? (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-end text-right">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{c.you}</span>
                        <p className="mt-2 max-w-[85%] whitespace-pre-wrap break-words font-mono text-base text-muted sm:text-lg">{m.content}</p>
                      </motion.div>
                    ) : (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start">
                        <span className="font-pixel text-[11px] tracking-wider text-faint">{c.ai}</span>
                        <div className="mt-2 max-w-[92%] whitespace-pre-wrap break-words text-base leading-relaxed text-fg/90 sm:text-lg">
                          {m.content && <RichText text={m.content} />}
                          {busy && i === messages.length - 1 && <Caret />}
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>
              )}

              <form
                className={empty ? "mt-6" : "mt-12"}
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(input);
                }}
              >
                <textarea
                  ref={field}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    } else if (e.key === "Tab" && !input) {
                      e.preventDefault();
                      setInput(suggestion);
                    }
                  }}
                  rows={1}
                  maxLength={800}
                  disabled={busy}
                  placeholder={empty ? suggestion : c.followUp}
                  aria-label="Your question"
                  className="w-full resize-none overflow-hidden bg-transparent font-mono text-lg text-fg caret-fg outline-none placeholder:text-faint disabled:opacity-50 sm:text-2xl"
                />
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-muted">
                  {busy ? (
                    <button type="button" onClick={() => abort.current?.abort()} className="flex items-center gap-1.5 hover:text-fg">
                      <Kbd>{c.stop}</Kbd> {c.answering}
                    </button>
                  ) : (
                    <>
                      <span className="flex items-center gap-1.5">
                        <Kbd>enter</Kbd> {c.send}
                      </span>
                      {!input && (
                        <span className="hidden items-center gap-1.5 sm:flex">
                          <Kbd>tab</Kbd> {c.useSuggestion}
                        </span>
                      )}
                      <span className="hidden items-center gap-1.5 sm:flex">
                        <Kbd>esc</Kbd> {c.close}
                      </span>
                    </>
                  )}
                  <span className="text-faint">{c.disclaimer}</span>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
