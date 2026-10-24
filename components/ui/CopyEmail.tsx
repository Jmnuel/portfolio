"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { profile } from "@/lib/content";

export function CopyEmail({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`group inline-flex max-w-full items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 font-mono text-sm text-fg transition hover:bg-surface-2 ${className}`}
    >
      {copied ? <Check className="size-4 shrink-0" /> : <Copy className="size-4 shrink-0 text-muted group-hover:text-fg" />}
      <span className="truncate">{copied ? "Copied!" : profile.email}</span>
    </button>
  );
}
