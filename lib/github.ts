import { profile } from "./content";

// Public GitHub data, cached for a day. Any failure returns null so the section simply hides.
const REVALIDATE = 60 * 60 * 24;
const username = profile.links.github.replace(/\/$/, "").split("/").pop() ?? "";

export type ContributionDay = { date: string; level: number };
export type Contributions = { total: number; weeks: ContributionDay[][] };

// The contribution calendar comes from GitHub's public profile fragment; no token needed.
export async function getContributions(): Promise<Contributions | null> {
  if (!username) return null;
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    const html = await res.text();
    const days = [...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"/g)]
      .map((m) => ({ date: m[1], level: Number(m[2]) }))
      .sort((a, b) => a.date.localeCompare(b.date));
    if (!days.length) return null;
    const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
    const total = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : 0;

    // Group into Sunday-first weeks, padding the first week so weekdays line up.
    const weeks: ContributionDay[][] = [];
    const pad = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
    let week: ContributionDay[] = Array.from({ length: pad }, () => ({ date: "", level: -1 }));
    for (const day of days) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length) weeks.push(week);
    return { total, weeks };
  } catch {
    return null;
  }
}

export type Repo = { name: string; description: string; url: string; language: string | null; stars: number; pushedAt: string };

// Only repositories with a description are featured, so half-finished experiments stay out.
export async function getFeaturedRepos(limit = 3): Promise<Repo[]> {
  if (!username) return [];
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=30`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const repos = (await res.json()) as {
      name: string;
      description: string | null;
      html_url: string;
      language: string | null;
      stargazers_count: number;
      pushed_at: string;
      fork: boolean;
    }[];
    return repos
      .filter((r) => !r.fork && r.description)
      .slice(0, limit)
      .map((r) => ({
        name: r.name,
        description: r.description ?? "",
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
      }));
  } catch {
    return [];
  }
}
