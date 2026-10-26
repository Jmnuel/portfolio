import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Intro } from "@/components/motion/Intro";
import { Cursor } from "@/components/motion/Cursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { profile, siteUrl } from "@/lib/content";

// Only the Square cut is used; importing geist/font/pixel would preload all five.
const GeistPixelSquare = localFont({
  src: "../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2",
  variable: "--font-geist-pixel-square",
  weight: "500",
});

const title = `${profile.name} — AI Engineer & Full-Stack Developer`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${profile.name}` },
  description: profile.headline + " " + profile.bio,
  authors: [{ name: profile.name, url: siteUrl }],
  keywords: [profile.name, "AI Engineer", "Full-Stack Developer", "Next.js", "React Native", "Catbalogan", "Samar", "Philippines"],
  alternates: { canonical: "/" },
  openGraph: { title, description: profile.headline, type: "website", url: "/", siteName: profile.name },
  twitter: { card: "summary_large_image", title, description: profile.headline },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

// Runs before paint so the stored theme never flashes, and so the intro shows only on the
// first visit of a session (never with reduced motion) without a flash of the page first.
const themeScript = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}
try{if(matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("intro-seen"))document.documentElement.classList.add("no-intro");else sessionStorage.setItem("intro-seen","1")}catch(e){document.documentElement.classList.add("no-intro")}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="noise min-h-dvh">
        <Intro />
        <Cursor />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
