import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const alt = `${profile.name} — portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const dots = Array.from({ length: 260 }, (_, i) => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / 259) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    return { x: 900 + Math.cos(t) * r * 190, y: 315 + y * 190, o: 0.2 + ((Math.sin(t) * r + 1) / 2) * 0.8 };
  });

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0a", color: "#ededed", position: "relative" }}>
        {dots.map((d, i) => (
          <div
            key={i}
            style={{ position: "absolute", left: d.x, top: d.y, width: 4, height: 4, borderRadius: 4, background: "#fff", opacity: d.o }}
          />
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, width: 720 }}>
          <div style={{ fontSize: 22, color: "#8a8a8a", letterSpacing: 4 }}>{profile.roles.join("  /  ").toUpperCase()}</div>
          <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24, lineHeight: 1, letterSpacing: -3 }}>{profile.name}</div>
          <div style={{ fontSize: 30, color: "#a3a3a3", marginTop: 28, lineHeight: 1.3 }}>{profile.headline}</div>
        </div>
      </div>
    ),
    size,
  );
}
