import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-dots grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="font-pixel text-7xl text-fg">404</p>
        <p className="mt-4 text-muted">This page drifted out of orbit.</p>
        <Link href="/" className="mt-8 inline-block rounded-full border border-border-strong px-5 py-2.5 text-sm text-fg transition hover:bg-surface-2">
          Back home
        </Link>
      </div>
    </main>
  );
}
