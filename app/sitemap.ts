import type { MetadataRoute } from "next";
import { projects, siteUrl } from "@/lib/content";
import { LANGS, localePath } from "@/lib/i18n";
import { getNotes } from "@/lib/notes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await getNotes();
  const pages: { path: string; priority: number; lastModified?: string }[] = [
    { path: "/", priority: 1 },
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, priority: 0.8 })),
    { path: "/notes", priority: 0.6 },
    ...notes.map((n) => ({ path: `/notes/${n.slug}`, priority: 0.6, lastModified: n.date })),
    { path: "/uses", priority: 0.4 },
    { path: "/card", priority: 0.4 },
  ];
  // Every page exists in English and Filipino; each entry lists its language alternates.
  return pages.flatMap(({ path, priority, lastModified }) =>
    LANGS.map((lang) => ({
      url: `${siteUrl}${localePath(lang, path) === "/" ? "" : localePath(lang, path)}`,
      changeFrequency: "monthly" as const,
      priority: lang === "en" ? priority : priority * 0.9,
      ...(lastModified ? { lastModified } : {}),
      alternates: {
        languages: Object.fromEntries(LANGS.map((l) => [l, `${siteUrl}${localePath(l, path) === "/" ? "" : localePath(l, path)}`])),
      },
    })),
  );
}
