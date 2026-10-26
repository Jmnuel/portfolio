import { projects } from "@/lib/content";
import { ProjectPage, projectMetadata } from "@/components/pages/ProjectPage";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  return projectMetadata("fil", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ProjectPage lang="fil" slug={(await params).slug} />;
}
