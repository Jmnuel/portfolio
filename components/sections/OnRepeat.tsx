"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { onRepeat } from "@/lib/content";
import { stopSound } from "@/lib/sound";

export function OnRepeat() {
  const { title, artist, spotifyId, youtubeId } = onRepeat;
  const frame = useRef<HTMLIFrameElement>(null);
  const [active, setActive] = useState(false);

  // Clicks inside a cross-origin iframe aren't observable, but the window loses focus to it.
  // Treat that as "pressed play": stop the ambient track so the two never overlap.
  useEffect(() => {
    const onBlur = () => {
      setTimeout(() => {
        if (document.activeElement === frame.current) {
          stopSound();
          setActive(true);
        }
      });
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  return (
    <div className="grid gap-5 overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:p-5 md:grid-cols-[1fr_1.6fr] md:items-center">
      <div className="min-w-0 md:pl-2">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="flex h-3 items-end gap-[2px] text-fg" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`eq-bar w-[2px] rounded-full bg-current ${active ? "is-playing" : ""}`}
                style={{ animationDelay: `${i * -0.3}s` }}
              />
            ))}
          </span>
          On repeat
        </p>
        <p className="mt-3 text-lg font-medium text-fg">{title}</p>
        <p className="text-sm text-muted">{artist} · what I code to</p>
        <div className="mt-4 flex gap-4 text-sm">
          <a
            href={`https://open.spotify.com/track/${spotifyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted transition hover:text-fg"
          >
            Spotify <ArrowUpRight className="size-4" />
          </a>
          <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted transition hover:text-fg"
          >
            YouTube <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>

      <iframe
        ref={frame}
        // theme=0 is Spotify's neutral dark player, which fits the monochrome palette in both themes.
        src={`https://open.spotify.com/embed/track/${spotifyId}?theme=0`}
        title={`${title} by ${artist} on Spotify`}
        height={152}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="w-full rounded-xl border-0"
      />
    </div>
  );
}
