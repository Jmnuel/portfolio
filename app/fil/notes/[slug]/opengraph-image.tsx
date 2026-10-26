import { getNotes } from "@/lib/notes";
import { noteOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Note";

export async function generateStaticParams() {
  return (await getNotes()).map((n) => ({ slug: n.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return noteOg((await params).slug);
}
