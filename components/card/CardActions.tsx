"use client";

import { useState } from "react";
import { Check, Download, Share2, UserPlus } from "lucide-react";
import { cardUrl } from "@/lib/card";
import { profile } from "@/lib/content";
import { useLang } from "@/lib/useLang";

const button =
  "inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-2.5 text-sm text-fg transition hover:bg-surface-2";

export function CardActions() {
  const [copied, setCopied] = useState(false);
  const { t } = useLang();
  const c = t.card;

  const share = async () => {
    const data = { title: `${profile.name} — digital card`, url: cardUrl };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <a href="/card/vcard" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition hover:opacity-90">
        <UserPlus className="size-4" /> {c.save}
      </a>
      <button type="button" onClick={share} className={button}>
        {copied ? <Check className="size-4" /> : <Share2 className="size-4" />} {copied ? c.copied : c.share}
      </button>
      <a href="/card/image/front" download="jhon-manuel-igdalino-card-front.png" className={button}>
        <Download className="size-4" /> {c.frontPng}
      </a>
      <a href="/card/image/back" download="jhon-manuel-igdalino-card-back.png" className={button}>
        <Download className="size-4" /> {c.backPng}
      </a>
    </div>
  );
}
