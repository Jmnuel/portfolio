import type { Metadata } from "next";
import { profile } from "@/lib/content";
import { fil } from "@/lib/content.fil";
import { alternates } from "@/lib/i18n";
import { HomePage } from "@/components/pages/HomePage";

export const revalidate = 86400;

const title = `${profile.name} — AI Engineer at Full-Stack Developer`;

export const metadata: Metadata = {
  title: { absolute: title },
  description: `${fil.profile.headline} ${fil.profile.bio}`,
  alternates: alternates("/", "fil"),
  openGraph: { title, description: fil.profile.headline, locale: "fil_PH", url: "/fil" },
};

export default function Page() {
  return <HomePage lang="fil" />;
}
