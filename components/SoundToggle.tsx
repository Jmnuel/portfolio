"use client";

import { useEffect, useSyncExternalStore } from "react";
import { isPlaying, startSound, subscribeSound, toggleSound, wantsSound } from "@/lib/sound";

export function useSound() {
  return useSyncExternalStore(subscribeSound, isPlaying, () => false);
}

export function SoundToggle() {
  const playing = useSound();

  // Browsers block audio until the visitor interacts, so a saved "on" preference
  // resumes on the first click or key press anywhere except this button.
  useEffect(() => {
    if (!wantsSound()) return;
    const resume = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("[data-sound-toggle]")) return;
      void startSound();
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);
    return cleanup;
  }, []);

  return (
    <button
      type="button"
      data-sound-toggle
      onClick={toggleSound}
      aria-pressed={playing}
      aria-label={playing ? "Turn sound off" : "Turn sound on"}
      title={playing ? "Sound on" : "Sound off"}
      className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg aria-pressed:text-fg"
    >
      <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`eq-bar w-[2px] rounded-full bg-current ${playing ? "is-playing" : ""}`}
            style={{ animationDelay: `${i * -0.22}s` }}
          />
        ))}
      </span>
    </button>
  );
}
