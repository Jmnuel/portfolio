// Static stand-in for the 3D core: shown first while three.js loads, and permanently with
// reduced motion or without WebGL. Dots are grouped into a few opacity bands and each band is
// drawn as one <path>, so the whole sphere is a handful of elements instead of hundreds.
const BANDS = 6;

const PATHS = (() => {
  const bands: string[][] = Array.from({ length: BANDS }, () => []);
  const n = 900;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const z = Math.sin(theta) * r;
    if (z < -0.2) continue; // back hemisphere hidden for a cleaner silhouette
    const depth = (z + 1) / 2; // 0 (back) → 1 (front)
    const cx = 200 + Math.cos(theta) * r * 150;
    const cy = 200 + y * 150;
    const rad = 0.8 + (z + 1) * 0.6;
    // A full circle as two arcs, appended to its depth band's path.
    bands[Math.min(BANDS - 1, Math.floor(depth * BANDS))].push(
      `M${(cx - rad).toFixed(1)} ${cy.toFixed(1)}a${rad.toFixed(2)} ${rad.toFixed(2)} 0 1 0 ${(rad * 2).toFixed(2)} 0a${rad.toFixed(2)} ${rad.toFixed(2)} 0 1 0 ${(-rad * 2).toFixed(2)} 0`,
    );
  }
  return bands.map((d, i) => ({ d: d.join(""), opacity: (0.15 + ((i + 0.5) / BANDS) * 0.75).toFixed(2) }));
})();

export function StaticCore() {
  return (
    <svg viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 h-[min(80vw,640px)] w-[min(80vw,640px)] -translate-x-1/2 -translate-y-1/2 text-fg" aria-hidden>
      <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="currentColor" strokeOpacity="0.15" transform="rotate(-20 200 200)" />
      <ellipse cx="200" cy="200" rx="190" ry="45" fill="none" stroke="currentColor" strokeOpacity="0.1" transform="rotate(25 200 200)" />
      {PATHS.map((p, i) => (
        <path key={i} d={p.d} fill="currentColor" opacity={p.opacity} />
      ))}
    </svg>
  );
}
