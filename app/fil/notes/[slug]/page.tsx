import { getNotes } from "@/lib/notes";
import { NotePage, noteMetadata } from "@/components/pages/NotesPages";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getNotes()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props) {
  return noteMetadata("fil", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <NotePage lang="fil" slug={(await params).slug} />;
}
