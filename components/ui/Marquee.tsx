import type { CSSProperties } from "react";

export function Marquee({
  children,
  reverse = false,
  duration = "40s",
}: {
  children: React.ReactNode;
  reverse?: boolean;
  duration?: string;
}) {
  return (
    <div
      className="group flex overflow-hidden [--gap:1rem] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      style={{ "--duration": duration } as CSSProperties}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className="flex shrink-0 animate-marquee gap-[var(--gap)] pr-[var(--gap)] group-hover:[animation-play-state:paused]"
          style={{ animationDirection: reverse ? "reverse" : "normal" }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
