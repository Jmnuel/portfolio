import { ArrowUpRight, Star } from "lucide-react";
import { profile } from "@/lib/content";
import { dict } from "@/lib/dict";
import type { Lang } from "@/lib/i18n";
import { getContributions, getFeaturedRepos } from "@/lib/github";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Reveal } from "@/components/ui/Reveal";

// Monochrome contribution levels: empty → strongest.
const LEVEL = ["bg-fg/[0.06]", "bg-fg/25", "bg-fg/45", "bg-fg/70", "bg-fg"];

export async function GithubActivity({ lang }: { lang: Lang }) {
  const [contributions, repos] = await Promise.all([getContributions(), getFeaturedRepos()]);
  if (!contributions && !repos.length) return null;
  const t = dict[lang].github;

  return (
    <Reveal className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-fg">
            <BrandIcon name="siGithub" className="size-4" /> {t.title}
            {contributions && (
              <span className="font-mono text-xs font-normal text-muted">· {t.contributions(contributions.total)}</span>
            )}
          </p>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-muted transition hover:text-fg"
          >
            {t.profile} <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        {contributions && (
          <>
            {/* dir="rtl" makes a narrow, scrollable graph open on the most recent weeks. */}
            <div className="mt-5 overflow-x-auto pb-1" dir="rtl" data-lenis-prevent>
              <div className="flex w-max gap-[3px]" dir="ltr" role="img" aria-label={t.contributions(contributions.total)}>
                {contributions.weeks.map((week, w) => (
                  <div key={w} className="flex flex-col gap-[3px]">
                    {week.map((day, d) => (
                      <span
                        key={d}
                        title={day.date || undefined}
                        className={`size-[11px] rounded-[2px] ${day.level < 0 ? "opacity-0" : LEVEL[day.level]}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-muted">
              {t.less}
              {LEVEL.map((c) => (
                <span key={c} className={`size-[10px] rounded-[2px] ${c}`} />
              ))}
              {t.more}
            </div>
          </>
        )}

        {repos.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{t.repos}</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-3">
              {repos.map((r) => (
                <li key={r.name}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-xl border border-border p-4 transition-colors hover:border-border-strong"
                  >
                    <span className="flex items-center justify-between gap-2 font-mono text-sm text-fg">
                      {r.name}
                      <ArrowUpRight className="size-3.5 text-muted transition group-hover:text-fg" />
                    </span>
                    <span className="mt-2 line-clamp-2 text-pretty text-sm text-muted">{r.description}</span>
                    <span className="mt-auto flex items-center gap-3 pt-3 font-mono text-[11px] text-muted">
                      {r.language && <span>{r.language}</span>}
                      {r.stars > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="size-3" /> {r.stars}
                        </span>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Reveal>
  );
}
