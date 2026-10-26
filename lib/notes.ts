import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";

// Notes are Markdown files in content/notes with a small frontmatter block:
// ---
// title: ...
// date: YYYY-MM-DD
// summary: ...
// tags: a, b, c
// ---
// They're read at build time; the content is trusted (it lives in this repo).
const dir = join(process.cwd(), "content/notes");

export type Note = { slug: string; title: string; date: string; summary: string; tags: string[]; minutes: number; html: string };

function parse(slug: string, raw: string): Note {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const meta: Record<string, string> = {};
  for (const line of (match?.[1] ?? "").split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const body = match?.[2] ?? raw;
  const words = body.replace(/<!--[\s\S]*?-->/g, "").split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: meta.title ?? slug,
    date: meta.date ?? "",
    summary: meta.summary ?? "",
    tags: (meta.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    minutes: Math.max(1, Math.round(words / 200)),
    html: marked.parse(body, { async: false }),
  };
}

export async function getNotes(): Promise<Note[]> {
  let files: string[] = [];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const notes = await Promise.all(files.map(async (f) => parse(f.replace(/\.md$/, ""), await readFile(join(dir, f), "utf8"))));
  return notes.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNote(slug: string) {
  return (await getNotes()).find((n) => n.slug === slug) ?? null;
}

export function formatDate(date: string, lang: "en" | "fil") {
  if (!date) return "";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(lang === "fil" ? "fil-PH" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
