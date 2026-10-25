import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { cardLinks, cardQrSvg, displayUrl } from "@/lib/card";
import { profile } from "@/lib/content";

// Print-ready PNGs of the card: 3.5 × 2 in at 300 DPI. Rendered once at build time.
export const dynamic = "force-static";
const W = 1050;
const H = 600;

export function generateStaticParams() {
  return [{ side: "front" }, { side: "back" }];
}

const fontDir = join(process.cwd(), "node_modules/geist/dist/fonts");
const loadFonts = async () => [
  { name: "Geist", data: await readFile(join(fontDir, "geist-sans/Geist-SemiBold.ttf")), weight: 600 as const },
  { name: "Geist Mono", data: await readFile(join(fontDir, "geist-mono/GeistMono-Regular.ttf")), weight: 400 as const },
  { name: "Geist Mono", data: await readFile(join(fontDir, "geist-mono/GeistMono-Bold.ttf")), weight: 700 as const },
];

const base = {
  width: "100%",
  height: "100%",
  display: "flex",
  background: "#0a0a0a",
  color: "#ededed",
  fontFamily: "Geist Mono",
  position: "relative" as const,
};

function Dots({ corner }: { corner: "tr" | "bl" }) {
  const dots = [];
  for (let y = 0; y < H; y += 30) {
    for (let x = 0; x < W; x += 30) {
      const dx = corner === "tr" ? W - x : x;
      const dy = corner === "tr" ? y : H - y;
      const fade = Math.max(0, 1 - Math.hypot(dx, dy) / 700);
      if (fade > 0.02) {
        dots.push(
          <div key={`${x}-${y}`} style={{ position: "absolute", left: x, top: y, width: 3, height: 3, borderRadius: 3, background: "#fff", opacity: 0.1 * fade }} />,
        );
      }
    }
  }
  return <>{dots}</>;
}

function Front() {
  return (
    <div style={base}>
      <Dots corner="tr" />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", padding: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 92, height: 92, borderRadius: 16, background: "#ededed", color: "#0a0a0a", fontSize: 38, fontWeight: 700 }}>
            {profile.initials}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 21, letterSpacing: 2.5, color: "#8a8a8a", textTransform: "uppercase" }}>
            <div style={{ width: 13, height: 13, borderRadius: 13, background: "#ededed" }} />
            {profile.status}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Geist", fontWeight: 600, fontSize: 76, letterSpacing: -2.5, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ marginTop: 24, fontSize: 23, letterSpacing: 3.5, color: "#a3a3a3", textTransform: "uppercase" }}>{profile.roles.join("  /  ")}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 44, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.12)", fontSize: 22, color: "#8a8a8a" }}>
            <span>{profile.email}</span>
            <span>{profile.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Back({ qrDataUri }: { qrDataUri: string }) {
  return (
    <div style={base}>
      <Dots corner="bl" />
      <div style={{ display: "flex", alignItems: "center", gap: 52, width: "100%", padding: 64 }}>
        <div style={{ display: "flex", width: 420, height: 420, flexShrink: 0, borderRadius: 24, background: "#ffffff", padding: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUri} width={364} height={364} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 450, height: 420 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.5 }}>scan to view my portfolio</div>
            <div style={{ marginTop: 14, fontSize: 22, color: "#a3a3a3" }}>{displayUrl}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 19 }}>
            {cardLinks.map((l) => (
              <div key={l.label} style={{ display: "flex", gap: 14 }}>
                <span style={{ width: 62, color: "#5a5a5a", letterSpacing: 2, textTransform: "uppercase" }}>{l.label}</span>
                <span style={{ color: "#d4d4d4" }}>{l.value}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, color: "#6b6b6b" }}>→ Ask my AI assistant on the site</div>
        </div>
      </div>
    </div>
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ side: string }> }) {
  const { side } = await params;
  if (side !== "front" && side !== "back") return new Response("Not found", { status: 404 });
  const fonts = await loadFonts();
  const element =
    side === "front" ? <Front /> : <Back qrDataUri={`data:image/svg+xml;base64,${Buffer.from(await cardQrSvg()).toString("base64")}`} />;
  return new ImageResponse(element, { width: W, height: H, fonts });
}
