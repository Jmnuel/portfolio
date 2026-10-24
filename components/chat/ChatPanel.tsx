"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, RotateCcw, Sparkles, Square, X } from "lucide-react";
import { profile } from "@/lib/content";
import { closeChat, takePendingQuestion, useChatState } from "@/lib/chat";

type Message = { role: "user" | "assistant"; content: string };

const linkClass = "underline decoration-border-strong underline-offset-2 hover:decoration-current";

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
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
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

const SUGGESTIONS = [
  "What has Manuel built?",
  "Tell me about KA-ANDAM",
  "What's in Manuel's tech stack?",
  "Is Manuel open to internships?",
];

const ERRORS: Record<number, string> = {
  429: "You've sent a lot of messages. Please wait a few minutes and try again.",
  503: `The AI assistant isn't switched on yet. You can reach Manuel at ${profile.email}.`,
};

export function ChatPanel() {
  const { open, pending } = useChatState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

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
          append(ERRORS[res.status] ?? "Sorry, something went wrong. Please try again.");
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
        if ((error as Error).name !== "AbortError") append("Connection lost. Please try again.");
      } finally {
        setBusy(false);
        abort.current = null;
      }
    },
    [busy, messages],
  );

  // A question handed over from the command menu or hero is sent as soon as the panel opens.
  useEffect(() => {
    if (!open) return;
    const q = takePendingQuestion();
    if (q) void send(q);
    else requestAnimationFrame(() => field.current?.focus());
  }, [open, pending, send]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const reset = () => {
    abort.current?.abort();
    setMessages([]);
    field.current?.focus();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-end justify-center bg-bg/50 backdrop-blur-sm sm:items-stretch sm:justify-end sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && closeChat()}
          data-lenis-prevent
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="Ask Manuel's AI assistant"
            className="flex h-[85dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-border-strong bg-surface shadow-2xl sm:h-auto sm:max-w-md sm:rounded-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center gap-3 border-b border-border px-4 py-3">
              <span className="grid size-8 place-items-center rounded-lg bg-fg text-bg">
                <Sparkles className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">Ask about Manuel</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">AI assistant · answers from this site</p>
              </div>
              {messages.length > 0 && (
                <button type="button" onClick={reset} aria-label="Start a new chat" className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg">
                  <RotateCcw className="size-4" />
                </button>
              )}
              <button type="button" onClick={closeChat} aria-label="Close chat" className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg">
                <X className="size-4" />
              </button>
            </header>

            <div ref={list} className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col justify-end gap-4">
                  <p className="text-pretty text-sm text-muted">
                    Hi! I can answer questions about Manuel&apos;s projects, skills, experience and how to get in touch.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-fg transition hover:border-border-strong hover:bg-surface-2"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.role === "user" ? "rounded-br-md bg-fg text-bg" : "rounded-bl-md border border-border bg-bg text-fg"
                      }`}
                    >
                      {m.content ? (
                        m.role === "assistant" ? <RichText text={m.content} /> : m.content
                      ) : (
                        <span className="flex gap-1 py-1" aria-label="Thinking">
                          {[0, 1, 2].map((d) => (
                            <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 0.15}s` }} />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              className="border-t border-border p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <div className="flex items-end gap-2 rounded-xl border border-border bg-bg p-2 focus-within:border-border-strong">
                <textarea
                  ref={field}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  rows={1}
                  maxLength={800}
                  placeholder="Ask anything about Manuel…"
                  aria-label="Your question"
                  className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-1.5 py-1.5 text-sm text-fg outline-none placeholder:text-muted"
                />
                {busy ? (
                  <button type="button" onClick={() => abort.current?.abort()} aria-label="Stop" className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-fg">
                    <Square className="size-3.5 fill-current" />
                  </button>
                ) : (
                  <button type="submit" disabled={!input.trim()} aria-label="Send" className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-fg transition disabled:opacity-30">
                    <ArrowUp className="size-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 px-1 text-[11px] text-muted">AI can make mistakes. For anything important, email {profile.email}.</p>
            </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
