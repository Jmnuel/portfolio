import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CardBack, CardFront } from "@/components/card/CardSides";
import { CardActions } from "@/components/card/CardActions";
import { Reveal } from "@/components/ui/Reveal";
import { cardQrSvg } from "@/lib/card";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Digital card",
  description: `${profile.name}'s digital business card. Scan the QR code to open the portfolio, or save the contact.`,
  alternates: { canonical: "/card" },
};

export default async function CardPage() {
  const qrSvg = await cardQrSvg();
  return (
    <>
      <Nav home={false} />
      <main className="bg-dots mx-auto min-h-dvh max-w-6xl px-4 pb-24 pt-32 sm:px-6">
        <Reveal className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">digital card</p>
          <h1 className="text-gradient mt-4 text-4xl font-semibold tracking-tighter md:text-6xl">Let&apos;s keep in touch.</h1>
          <p className="mx-auto mt-4 max-w-md text-pretty text-muted">
            Scan the QR code to open my portfolio, or save my contact straight to your phone.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          <Reveal delay={0.05}>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">front</p>
            <CardFront />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">back</p>
            <CardBack qrSvg={qrSvg} />
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-10">
          <CardActions />
          <p className="mt-4 text-center font-mono text-[11px] text-muted">PNGs are print-ready: 3.5 × 2 in at 300 DPI.</p>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
