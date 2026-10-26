import { NotesIndex, notesMetadata } from "@/components/pages/NotesPages";

export const metadata = notesMetadata("fil");

export default function Page() {
  return <NotesIndex lang="fil" />;
}
