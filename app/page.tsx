import type { Metadata } from "next";
import { alternates } from "@/lib/i18n";
import { HomePage } from "@/components/pages/HomePage";

// GitHub activity on the home page is refreshed at most once a day.
export const revalidate = 86400;

export const metadata: Metadata = { alternates: alternates("/", "en") };

export default function Page() {
  return <HomePage lang="en" />;
}
