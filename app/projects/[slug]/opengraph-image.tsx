import { projects } from "@/lib/content";
import { ogSize, projectOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Project case study";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return projectOg("en", (await params).slug);
}
