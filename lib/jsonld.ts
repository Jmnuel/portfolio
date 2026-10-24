import { education, profile, projects, siteUrl, stack, type Project } from "./content";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    alternateName: profile.shortName,
    url: siteUrl,
    image: `${siteUrl}${profile.photo}`,
    email: `mailto:${profile.email}`,
    jobTitle: "AI Engineer & Full-Stack Developer",
    description: profile.bio,
    address: { "@type": "PostalAddress", addressLocality: "Catbalogan City", addressRegion: "Samar", addressCountry: "PH" },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
    knowsAbout: stack.flat().map((t) => t.name),
    sameAs: Object.values(profile.links).filter(Boolean),
  };
}

export function projectListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Projects by ${profile.name}`,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/projects/${p.slug}`,
      name: p.name,
    })),
  };
}

export function projectJsonLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/projects/${p.slug}#project`,
    name: p.name,
    description: p.summary,
    url: p.url,
    image: `${siteUrl}${p.image}`,
    applicationCategory: p.category,
    operatingSystem: p.stack.includes("Android") ? "Android, Web" : "Web",
    creator: { "@id": `${siteUrl}/#person` },
  };
}

// Escapes "<" so content can never close the surrounding <script> tag.
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
