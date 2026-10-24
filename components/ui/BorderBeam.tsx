// A small light that travels around the border of its relative, rounded parent.
export function BorderBeam({ size = 140, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <div
        className="absolute aspect-square animate-beam bg-gradient-to-l from-fg via-fg/40 to-transparent"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}
