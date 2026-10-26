import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { profile, siteUrl } from "./content";
import type { Lang } from "./i18n";
import { getContent } from "./localized";
import { getNote } from "./notes";

// Share images (Open Graph / Twitter) for case studies and notes, rendered at build time.
export const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "node_modules/geist/dist/fonts");
const fonts = async () => [
  { name: "Geist", data: await readFile(join(fontDir, "geist-sans/Geist-SemiBold.ttf")), weight: 600 as const },
  { name: "Geist Mono", data: await readFile(join(fontDir, "geist-mono/GeistMono-Regular.ttf")), weight: 400 as const },
];

// Satori can't read WebP, so screenshots are converted to a grayscale PNG data URI.
async function screenshot(path: string) {
  const png = await sharp(join(process.cwd(), "public", path)).resize(760).grayscale().png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

function Frame({ eyebrow, title, body, image }: { eyebrow: string; title: string; body: string; image?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a0a", color: "#ededed", fontFamily: "Geist Mono", position: "relative" }}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" width={760} height={475} style={{ position: "absolute", right: -80, top: 120, borderRadius: 20, opacity: 0.55, border: "1px solid #333" }} />
      )}
      {/* Fades the screenshot out behind the text (satori needs explicit edges, not inset). */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          backgroundImage: "linear-gradient(90deg, #0a0a0a 0%, #0a0a0a 52%, rgba(10,10,10,0.35) 100%)",
        }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: 720, height: 630 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, color: "#8a8a8a", letterSpacing: 3, textTransform: "uppercase" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 10, background: "#ededed", color: "#0a0a0a", fontSize: 20 }}>
            {profile.initials}
          </div>
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Geist", fontWeight: 600, fontSize: title.length > 24 ? 58 : 80, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          <div style={{ marginTop: 22, fontSize: 24, lineHeight: 1.4, color: "#a3a3a3" }}>{body.length > 110 ? `${body.slice(0, 108).replace(/\s+\S*$/, "")}…` : body}</div>
        </div>
        <div style={{ fontSize: 22, color: "#6b6b6b" }}>{siteUrl.replace(/^https?:\/\//, "")}</div>
      </div>
    </div>
  );
}

export async function projectOg(lang: Lang, slug: string) {
  const p = getContent(lang).projects.find((x) => x.slug === slug);
  if (!p) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    <Frame eyebrow={`${p.category} · ${p.year}`} title={p.name} body={p.tagline} image={await screenshot(p.image)} />,
    { ...ogSize, fonts: await fonts() },
  );
}

export async function noteOg(slug: string) {
  const n = await getNote(slug);
  if (!n) return new Response("Not found", { status: 404 });
  return new ImageResponse(<Frame eyebrow="notes" title={n.title} body={n.summary} />, { ...ogSize, fonts: await fonts() });
}
