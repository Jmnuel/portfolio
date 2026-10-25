import { profile } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 font-mono text-xs text-muted sm:flex-row sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name} ·{" "}
          <a href="/card" className="underline decoration-border-strong underline-offset-4 transition hover:text-fg">
            digital card
          </a>
        </p>
        <p>Built with Next.js + React Three Fiber · {profile.location}</p>
      </div>
    </footer>
  );
}
