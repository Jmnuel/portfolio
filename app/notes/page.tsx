import { NotesIndex, notesMetadata } from "@/components/pages/NotesPages";

export const metadata = notesMetadata("en");

export default function Page() {
  return <NotesIndex lang="en" />;
}
