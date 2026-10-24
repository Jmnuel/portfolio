// Static stand-in for the 3D core, used for reduced motion or when WebGL is unavailable.
const DOTS = (() => {
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  const n = 900;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const z = Math.sin(theta) * r;
    if (z < -0.2) continue; // back hemisphere hidden for a cleaner silhouette
    dots.push({
      x: 200 + Math.cos(theta) * r * 150,
      y: 200 + y * 150,
      r: 0.8 + (z + 1) * 0.6,
      o: 0.15 + ((z + 1) / 2) * 0.75,
    });
  }
  return dots;
})();

export function StaticCore() {
  return (
    <svg viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 h-[min(80vw,640px)] w-[min(80vw,640px)] -translate-x-1/2 -translate-y-1/2 text-fg" aria-hidden>
      <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="currentColor" strokeOpacity="0.15" transform="rotate(-20 200 200)" />
      <ellipse cx="200" cy="200" rx="190" ry="45" fill="none" stroke="currentColor" strokeOpacity="0.1" transform="rotate(25 200 200)" />
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.x.toFixed(2)} cy={d.y.toFixed(2)} r={d.r.toFixed(2)} fill="currentColor" opacity={d.o.toFixed(2)} />
      ))}
    </svg>
  );
}
