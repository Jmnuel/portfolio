// Every piece of copy, link and project on the site lives here.

// Update if a custom domain is added; sitemap, robots, canonical URLs and JSON-LD all use it.
export const siteUrl = "https://jmanueligdalino.vercel.app";

export const profile = {
  name: "Jhon Manuel Igdalino",
  shortName: "Manuel",
  initials: "JM",
  roles: ["AI Engineer", "Full-Stack Web & Mobile", "UI/UX"],
  location: "Catbalogan City, Samar, PH",
  status: "Open to internships & freelance",
  headline: "I build AI-powered web and mobile products for real communities.",
  bio: "BS Information Technology student at Samar State University. I design, build and ship full-stack apps — from classroom platforms to disaster-response dashboards — and I lean on AI tooling to move from idea to production fast.",
  photo: "/me.webp",
  email: "jmanueligdalino@gmail.com",
  links: {
    github: "https://github.com/Jmnuel", // the GitHub link is hidden when this is empty
    linkedin: "https://www.linkedin.com/in/jmanueligdalino",
  },
};

export const education = {
  school: "Samar State University",
  course: "Bachelor of Science in Information Technology",
  place: "Catbalogan City, Samar",
};

export const focus = [
  {
    title: "AI Engineering",
    body: "Agentic coding workflows with Claude Code and Codex, LLM features inside products, and automating the boring parts.",
  },
  {
    title: "Full-Stack Web & Mobile",
    body: "Next.js, Node.js and React Native apps on Supabase, Postgres or Firebase — offline-first where it matters.",
  },
  {
    title: "UI/UX Design",
    body: "Figma to production. Interfaces that feel calm, fast and obvious for teachers, rescuers, residents and artists.",
  },
];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  problem: string;
  features: string[];
  stack: string[];
  role: string;
  team?: string[];
  status: string;
  url: string;
  image: string;
  year: string;
  category: string;
};

export const projects: Project[] = [
  {
    slug: "syneed",
    name: "SyneED",
    tagline: "Classrooms that stay connected.",
    summary:
      "A classroom platform that brings class work, communication and consent-led safety tools into one focused Android experience.",
    problem:
      "Teachers juggle group chats, paper schedules and separate apps to reach students, and families worry about safety on the way to class. SyneED puts the classroom hub, messaging and opt-in safety tools in one place, with role-based access for teachers, students and administrators.",
    features: [
      "Classroom hub with schedules, tasks and submissions",
      "Realtime class chat and progress views",
      "Opt-in, consent-led foreground location sharing",
      "Admin approval for new teacher accounts",
      "In-app support requests and cancellable 30-day account deletion",
      "Interactive 3D virtual classroom on the landing page",
    ],
    stack: ["Next.js", "Supabase", "React Native", "Android", "Three.js"],
    role: "Project Lead & Full-Stack Developer",
    team: [
      "Jhon Manuel Igdalino — Project Lead & Full-Stack",
      "Nemenrose Enoveso — UI/UX & Frontend",
      "Chassey Gabon — Backend & Systems Architect",
      "Gerard Bryan Ramos — QA & Product Operations",
    ],
    status: "Android · Coming soon",
    url: "https://syneed.vercel.app/",
    image: "/projects/syneed.webp",
    year: "2026",
    category: "EdTech",
  },
  {
    slug: "ka-andam",
    name: "KA-ANDAM",
    tagline: "Emergency response team management for DRRM.",
    summary:
      "An installable admin dashboard that helps Catbalogan City's disaster risk reduction office coordinate rescuers and response teams.",
    problem:
      "When disasters hit, response offices need one live view of who is available and where teams are deployed. KA-ANDAM gives rescuer administrators a fast, installable dashboard built for the Disaster Risk Reduction & Management office of Catbalogan City.",
    features: [
      "Rescuer and response-team management",
      "Secure admin sign-in with role-based access",
      "Installable PWA for quick access on any device",
      "Dark, low-glare interface for long shifts",
    ],
    stack: ["Next.js", "Supabase", "shadcn/ui", "Tailwind CSS", "PWA"],
    role: "Full-Stack Developer",
    status: "Live · Admin access",
    url: "https://ka-andam.vercel.app/",
    image: "/projects/ka-andam.webp",
    year: "2026",
    category: "Disaster Response",
  },
  {
    slug: "samar-agos",
    name: "SAMAR-AGOS",
    tagline: "Smart water monitoring and response.",
    summary:
      "Residents know what to expect. Water providers know where to act. A platform that links community water reports to monitoring, forecasting and field response.",
    problem:
      "Water interruptions in Catbalogan are reported through scattered calls and posts, so providers react late and residents are left guessing. SAMAR-AGOS turns community reports into operational evidence, forecasts shortages before they become severe, and closes the loop with advisories residents confirm.",
    features: [
      "Community reports and incident tracking",
      "Consumption trends and demand forecasting",
      "Reservoir view and shortage early warning",
      "Work orders for field responders",
      "Barangay and service-zone map with weather data",
      "Demo scenarios: dry season, pump failure, pipeline leak",
    ],
    stack: ["JavaScript", "Firebase", "Firestore", "Leaflet", "Open-Meteo"],
    role: "Full-Stack Developer",
    team: ["Team Los Codigos · rSCENE 2026 Hackathon"],
    status: "Live · Hackathon build",
    url: "https://samar-agos-ic9sb.web.app/",
    image: "/projects/samar-agos.webp",
    year: "2026",
    category: "Civic Tech",
  },
  {
    slug: "siningsumpay",
    name: "SiningSumpay",
    tagline: "Art from local artists, on your wall.",
    summary:
      "An Android marketplace where collectors discover original art from local artists, preview it in their room, and pay safely.",
    problem:
      "Local artists in Samar have few safe channels to sell, and buyers hesitate to pay before seeing a piece. SiningSumpay holds payment until the artwork arrives, lets collectors preview work at real size in their room, and gives artists commissions and payouts in one app.",
    features: [
      "View in Room — real-size camera preview with frames",
      "Personalized feed, search and price filters",
      "Offers and commissions with deposits",
      "Escrow-style payouts via GCash, Maya, GrabPay or card",
      "Map of nearby shows, galleries and art shops",
      "Verified artist badges, stories and QR artist cards",
    ],
    stack: ["Next.js", "Supabase", "React Native", "Android"],
    role: "Full-Stack Developer",
    status: "Android · APK available",
    url: "https://siningsumpay-web.vercel.app/",
    image: "/projects/siningsumpay.webp",
    year: "2026",
    category: "Marketplace",
  },
];

export const experience = [
  {
    period: "2026",
    title: "Project Lead & Full-Stack Developer",
    org: "SyneED",
    body: "Leading a four-person team building a connected-classroom platform on Next.js and Supabase.",
  },
  {
    period: "2025 — 2026",
    title: "Hackathon Developer · Team Los Codigos",
    org: "rSCENE Hackathon · Catbalogan City",
    body: "Competed in two editions of the regional smart-communities hackathon. In 2026 the team built SAMAR-AGOS, smart water monitoring for Catbalogan's water district.",
  },
  {
    period: "2025 — Now",
    title: "Full-Stack Web & Mobile Developer",
    org: "Independent & community projects",
    body: "Shipped KA-ANDAM for disaster response and SiningSumpay for local artists, from Figma to production.",
  },
  {
    period: "2025 — Now",
    title: "AI Engineering",
    org: "Self-directed",
    body: "Building with LLMs and agentic tools like Claude Code and Codex to design, code and ship faster.",
  },
];

export type Hackathon = {
  name: string;
  full: string;
  date: string;
  theme: string;
  where: string;
  host: string;
  team: string;
  project?: string; // must match a project name to link its case study
  result: string;
};

const rscene = {
  name: "rSCENE Hackathon",
  full: "Regional Smart Communities Exposition & Networking Engagement",
  where: "Catbalogan City, Samar",
  host: "DOST Region VIII · City Government of Catbalogan",
  team: "Los Codigos",
  result: "Participant",
};

export const hackathons: Hackathon[] = [
  {
    ...rscene,
    name: "rSCENE Hackathon 2026",
    date: "October 6, 2026",
    theme: "The Living Tapestry — Weaving the Threads of Innovation and Heritage",
    project: "SAMAR-AGOS",
  },
  {
    ...rscene,
    name: "rSCENE Hackathon 2025",
    date: "June 16, 2025",
    theme: "Kauswagan: Harnessing Technology towards Sustainable Development",
  },
];

// `icon` is a simple-icons export name; entries without one render as text chips.
export const stack: { name: string; icon?: string }[][] = [
  [
    { name: "C", icon: "siC" },
    { name: "Python", icon: "siPython" },
    { name: "JavaScript", icon: "siJavascript" },
    { name: "TypeScript", icon: "siTypescript" },
    { name: "React Native", icon: "siReact" },
    { name: "Next.js", icon: "siNextdotjs" },
    { name: "Node.js", icon: "siNodedotjs" },
    { name: "Three.js", icon: "siThreedotjs" },
    { name: "Tailwind CSS", icon: "siTailwindcss" },
    { name: "shadcn/ui", icon: "siShadcnui" },
  ],
  [
    { name: "Supabase", icon: "siSupabase" },
    { name: "PostgreSQL", icon: "siPostgresql" },
    { name: "MySQL", icon: "siMysql" },
    { name: "WatermelonDB" },
    { name: "Firebase", icon: "siFirebase" },
    { name: "Netlify", icon: "siNetlify" },
    { name: "Vercel", icon: "siVercel" },
    { name: "Figma", icon: "siFigma" },
    { name: "Claude Code", icon: "siClaude" },
    { name: "Codex" },
  ],
];

export const stats = [
  { value: 4, suffix: "", label: "Products shipped" },
  { value: 20, suffix: "", label: "Tools in the stack" },
  { value: 2, suffix: "", label: "rSCENE hackathons" },
  { value: 3, suffix: "", label: "Disciplines: AI · Dev · UX" },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];
