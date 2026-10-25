import { vCard } from "@/lib/card";

export const dynamic = "force-static";

export function GET() {
  return new Response(vCard(), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="jhon-manuel-igdalino.vcf"',
    },
  });
}
