import { profile } from "@/lib/content";
import { cardLinks, displayUrl } from "@/lib/card";

// Both sides use the standard 3.5 × 2 in business-card ratio.
const side =
  "relative aspect-[7/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] text-[#ededed] shadow-2xl shadow-black/40";

const dots = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
};

export function CardFront() {
  return (
    <div className={side} style={{ containerType: "inline-size" }}>
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_70%)]" style={dots} />
      <div className="relative flex h-full flex-col justify-between p-[6cqw]">
        <div className="flex items-start justify-between">
          <span className="grid size-[9cqw] place-items-center rounded-[1.6cqw] bg-[#ededed] font-pixel text-[3.6cqw] text-[#0a0a0a]">
            {profile.initials}
          </span>
          <span className="flex items-center gap-[1.4cqw] font-mono text-[2.1cqw] uppercase tracking-[0.15em] text-[#8a8a8a]">
            <span className="size-[1.4cqw] rounded-full bg-[#ededed]" />
            {profile.status}
          </span>
        </div>
        <div>
          <p className="text-[7.4cqw] font-semibold leading-none tracking-tight">{profile.name}</p>
          <p className="mt-[2.4cqw] font-mono text-[2.3cqw] uppercase tracking-[0.18em] text-[#a3a3a3]">
            {profile.roles.join("  /  ")}
          </p>
          <div className="mt-[4.5cqw] flex items-center justify-between border-t border-white/10 pt-[3cqw] font-mono text-[2.2cqw] text-[#8a8a8a]">
            <span>{profile.email}</span>
            <span>{profile.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardBack({ qrSvg }: { qrSvg: string }) {
  return (
    <div className={side} style={{ containerType: "inline-size" }}>
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_bottom_left,black_10%,transparent_70%)]" style={dots} />
      <div className="relative flex h-full items-center gap-[5cqw] p-[6cqw]">
        <div className="aspect-square h-[88%] shrink-0 rounded-[2.4cqw] bg-white p-[2.6cqw]">
          <div className="size-full [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
        </div>
        <div className="flex h-[88%] min-w-0 flex-1 flex-col justify-between">
          <div>
            <p className="font-pixel text-[4cqw] leading-tight">scan to view my portfolio</p>
            <p className="mt-[1.6cqw] truncate font-mono text-[2.1cqw] text-[#a3a3a3]">{displayUrl}</p>
          </div>
          <ul className="space-y-[1.3cqw] font-mono text-[1.85cqw]">
            {cardLinks.map((l) => (
              <li key={l.label} className="flex gap-[1.6cqw]">
                <span className="w-[5.5cqw] shrink-0 uppercase tracking-[0.12em] text-[#5a5a5a]">{l.label}</span>
                <span className="truncate text-[#d4d4d4]">{l.value}</span>
              </li>
            ))}
          </ul>
          <p className="font-mono text-[1.8cqw] text-[#6b6b6b]">✦ Ask my AI assistant on the site</p>
        </div>
      </div>
    </div>
  );
}
