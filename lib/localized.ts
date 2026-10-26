import * as base from "./content";
import { fil } from "./content.fil";
import type { Lang } from "./i18n";

// Portfolio content for a language: English from content.ts, with Filipino text from
// content.fil.ts laid over it. Untranslated fields fall back to English.
export function getContent(lang: Lang) {
  if (lang === "en") {
    return {
      profile: base.profile,
      education: base.education,
      focus: base.focus,
      projects: base.projects,
      experience: base.experience,
      hackathons: base.hackathons,
      stats: base.stats,
      nav: base.nav,
      now: base.now,
      uses: base.uses,
    };
  }
  return {
    profile: { ...base.profile, ...fil.profile },
    education: base.education,
    focus: fil.focus,
    projects: base.projects.map((p) => ({ ...p, ...(fil.projects as Record<string, Partial<base.Project>>)[p.slug] })),
    experience: fil.experience,
    hackathons: base.hackathons.map((h, i) => ({ ...h, ...fil.hackathons[i] })),
    stats: base.stats.map((s, i) => ({ ...s, label: fil.stats[i] ?? s.label })),
    nav: base.nav.map((n) => ({ ...n, label: fil.nav[n.id] ?? n.label })),
    now: fil.now,
    uses: base.uses.map((g) => ({
      group: fil.uses.groups[g.group] ?? g.group,
      items: g.items.map((it) => ({ ...it, note: fil.uses.notes[it.name] ?? it.note })),
    })),
  };
}

export type Content = ReturnType<typeof getContent>;
