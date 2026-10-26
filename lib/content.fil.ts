import type { Project } from "./content";

// Filipino translations of the portfolio content in lib/content.ts. Names, links, stacks and
// other values that don't change between languages stay in content.ts only.
type ProjectText = Partial<Pick<Project, "tagline" | "summary" | "problem" | "features" | "role" | "status" | "category" | "team">>;

export const fil = {
  profile: {
    status: "Bukas sa internship at freelance",
    headline: "Gumagawa ako ng AI-powered na web at mobile na produkto para sa totoong komunidad.",
    bio: "Estudyante ng BS Information Technology sa Samar State University. Nagdidisenyo, gumagawa at naglalabas ako ng full-stack apps — mula sa mga platform para sa silid-aralan hanggang sa mga dashboard para sa disaster response — at gumagamit ako ng AI tools para mabilis na maging produkto ang isang ideya.",
  },
  focus: [
    {
      title: "AI Engineering",
      body: "Agentic coding workflows gamit ang Claude Code at Codex, mga LLM feature sa loob ng produkto, at pag-automate ng mga paulit-ulit na gawain.",
    },
    {
      title: "Full-Stack Web & Mobile",
      body: "Mga app sa Next.js, Node.js at React Native gamit ang Supabase, Postgres o Firebase — offline-first kung kailangan.",
    },
    {
      title: "UI/UX Design",
      body: "Mula Figma hanggang production. Mga interface na kalmado, mabilis at madaling gamitin para sa mga guro, rescuer, residente at artist.",
    },
  ],
  projects: {
    syneed: {
      tagline: "Mga silid-aralang laging konektado.",
      summary: "Isang classroom platform na pinagsasama ang gawain sa klase, komunikasyon at consent-based na safety tools sa iisang Android app.",
      problem:
        "Gumagamit ang mga guro ng iba't ibang group chat, papel na iskedyul at hiwa-hiwalay na app para maabot ang mga estudyante, at nag-aalala ang mga pamilya sa kaligtasan ng mga bata papunta sa klase. Pinagsasama ng SyneED ang classroom hub, messaging at opt-in na safety tools sa iisang lugar, na may role-based access para sa mga guro, estudyante at administrador.",
      features: [
        "Classroom hub na may iskedyul, gawain at submission",
        "Realtime na class chat at progress view",
        "Opt-in at consent-based na pagbabahagi ng lokasyon",
        "Pag-apruba ng admin sa mga bagong account ng guro",
        "In-app na support request at 30-araw na pagbura ng account na puwedeng kanselahin",
        "Interactive na 3D virtual classroom sa landing page",
      ],
      role: "Project Lead at Full-Stack Developer",
      status: "Android · Malapit nang ilabas",
    },
    "ka-andam": {
      tagline: "Pamamahala ng emergency response team para sa DRRM.",
      summary:
        "Ang aking BSIT capstone project: isang installable na admin dashboard na tumutulong sa disaster risk reduction office ng Catbalogan City na i-coordinate ang mga rescuer at response team.",
      problem:
        "Kapag may sakuna, kailangan ng mga response office ng iisang live na view kung sino ang available at saan naka-deploy ang mga team. Binibigyan ng KA-ANDAM ang mga rescuer administrator ng mabilis at installable na dashboard na ginawa para sa Disaster Risk Reduction & Management office ng Catbalogan City. Ito ang aking kasalukuyang capstone project sa Samar State University.",
      features: [
        "Pamamahala ng mga rescuer at response team",
        "Ligtas na admin sign-in na may role-based access",
        "Installable na PWA para mabilis buksan sa kahit anong device",
        "Madilim at hindi nakakasilaw na interface para sa mahahabang shift",
      ],
      status: "Capstone · Ginagawa pa",
    },
    "samar-agos": {
      tagline: "Matalinong pagmo-monitor at pagtugon sa serbisyo ng tubig.",
      summary:
        "Alam ng mga residente ang aasahan. Alam ng water provider kung saan kikilos. Isang platform na nag-uugnay ng mga ulat ng komunidad tungkol sa tubig sa monitoring, forecasting at field response.",
      problem:
        "Ang mga water interruption sa Catbalogan ay iniuulat sa magkakahiwalay na tawag at post, kaya huli nang kumikilos ang provider at naghihintay lang ang mga residente. Ginagawang operational na ebidensya ng SAMAR-AGOS ang mga ulat ng komunidad, nagbibigay ng forecast bago lumala ang kakulangan, at tinatapos ang proseso sa mga advisory na kinukumpirma ng mga residente.",
      features: [
        "Mga ulat ng komunidad at pag-track ng insidente",
        "Trend ng konsumo at demand forecasting",
        "View ng reservoir at maagang babala sa kakulangan",
        "Mga work order para sa mga field responder",
        "Mapa ng barangay at service zone na may datos ng panahon",
        "Mga demo na senaryo: tag-araw, sirang pump, tagas sa tubo",
      ],
      team: ["Team Los Codigos · rSCENE 2026 Hackathon"],
      status: "Live · Ginawa sa hackathon",
    },
    siningsumpay: {
      tagline: "Sining mula sa mga lokal na artist, sa iyong dingding.",
      summary:
        "Isang Android marketplace kung saan nakakahanap ang mga collector ng orihinal na sining mula sa mga lokal na artist, nasisilip ito sa kanilang kuwarto, at nakakabayad nang ligtas.",
      problem:
        "Kaunti ang ligtas na paraan ng mga lokal na artist sa Samar para magbenta, at nag-aalangan ang mga mamimili na magbayad bago makita ang likha. Hinahawakan ng SiningSumpay ang bayad hanggang dumating ang artwork, ipinapakita ang tunay na laki nito sa kuwarto ng collector, at binibigyan ang mga artist ng commission at payout sa iisang app. Nagsimula ito bilang prototype ng Team Los Codigos sa rSCENE 2025 Hackathon; ang buong sistema ay ginawa noong 2026.",
      features: [
        "View in Room — camera preview sa tunay na laki, may frame",
        "Personalized na feed, search at filter ng presyo",
        "Mga alok at commission na may deposito",
        "Escrow-style na payout sa GCash, Maya, GrabPay o card",
        "Mapa ng mga malapit na exhibit, gallery at art shop",
        "Verified artist badge, mga kuwento at QR artist card",
      ],
      status: "Android · May APK na",
    },
  } satisfies Record<string, ProjectText>,
  experience: [
    {
      period: "2026 — Kasalukuyan",
      title: "Capstone Project · KA-ANDAM",
      org: "Samar State University · BSIT",
      body: "Gumagawa ng dashboard para sa pamamahala ng emergency response team ng disaster risk reduction office ng Catbalogan City.",
    },
    {
      period: "2026",
      title: "Project Lead at Full-Stack Developer",
      org: "SyneED",
      body: "Pinamumunuan ang apat na miyembrong team sa paggawa ng connected-classroom platform gamit ang Next.js at Supabase.",
    },
    {
      period: "2025 — 2026",
      title: "Hackathon Developer · Team Los Codigos",
      org: "rSCENE Hackathon · Catbalogan City",
      body: "Sumali sa dalawang edisyon ng regional smart-communities hackathon: ginawa ang prototype ng SiningSumpay, isang marketplace para sa mga lokal na artist, noong 2025, at ang SAMAR-AGOS, smart water monitoring para sa water district ng Catbalogan, noong 2026.",
    },
    {
      period: "2025 — Kasalukuyan",
      title: "Full-Stack Web & Mobile Developer",
      org: "Mga independent at pangkomunidad na proyekto",
      body: "Dinala ang SiningSumpay para sa mga lokal na artist at ang SAMAR-AGOS para sa serbisyo ng tubig mula Figma hanggang production.",
    },
    {
      period: "2025 — Kasalukuyan",
      title: "AI Engineering",
      org: "Sariling pag-aaral",
      body: "Gumagawa gamit ang mga LLM at agentic tools tulad ng Claude Code at Codex para mas mabilis magdisenyo, mag-code at maglabas ng produkto.",
    },
  ],
  hackathons: [
    { date: "Oktubre 6, 2026", result: "Kalahok" },
    { date: "Hunyo 16, 2025", result: "Kalahok", stage: "prototype" },
  ],
  stats: ["Mga produktong nagawa", "Tools sa stack", "rSCENE hackathons", "Disiplina: AI · Dev · UX"],
  nav: { about: "Tungkol", projects: "Proyekto", experience: "Karanasan", stack: "Stack", contact: "Kontak" } as Record<string, string>,
  now: {
    updated: "Oktubre 2026",
    items: [
      "Ginagawa ang KA-ANDAM, ang aking BSIT capstone project sa Samar State University.",
      "Inihahanda ang SyneED para sa Android kasama ang apat na miyembrong team.",
      "Nag-aaral ng agentic AI workflows gamit ang Claude Code at Codex.",
      "Naghahanap ng internship at freelance na oportunidad.",
    ],
  },
  // Keyed by the English group name / item name in content.ts.
  uses: {
    groups: {
      "AI tools": "AI tools",
      "Languages & frameworks": "Mga language at framework",
      "Data & backend": "Data at backend",
      "Design & deploy": "Disenyo at deploy",
    } as Record<string, string>,
    notes: {
      "Claude Code": "Agentic coding sa terminal, mula pagpaplano hanggang paglabas.",
      Codex: "Pangalawang AI pair programmer para sa paggawa at pag-review ng code.",
      "Google Gemini": "Nagpapatakbo sa AI assistant ng site na ito.",
      "Next.js": "Mga web app at landing page, kasama ang portfolio na ito.",
      "React Native": "Mga Android app tulad ng SyneED at SiningSumpay.",
      "TypeScript & JavaScript": "Ang language sa likod ng karamihan ng aking proyekto.",
      "Node.js": "Mga API at server-side na trabaho.",
      "Python & C": "Scripting, data work at mga gawain sa kurso.",
      "Tailwind CSS & shadcn/ui": "Styling at accessible na UI building blocks.",
      "Three.js": "3D sa web, tulad ng hero ng site na ito.",
      Supabase: "Postgres, auth at storage para sa karamihan ng aking app.",
      "Firebase & Firestore": "Auth at realtime na datos para sa SAMAR-AGOS.",
      "PostgreSQL & MySQL": "Mga relational database.",
      WatermelonDB: "Offline-first na lokal na database para sa React Native.",
      Figma: "Wireframe, UI design at prototype.",
      Vercel: "Hosting ng mga Next.js app, kasama ang site na ito.",
      Netlify: "Mga static site at mabilisang deploy.",
    } as Record<string, string>,
  },
};
