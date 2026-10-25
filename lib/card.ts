import QRCode from "qrcode";
import { education, profile, siteUrl } from "./content";

// The QR code opens the portfolio; ?ref=card shows card scans separately in analytics.
export const cardTargetUrl = `${siteUrl}/?ref=card`;
export const cardUrl = `${siteUrl}/card`;
export const displayUrl = siteUrl.replace(/^https?:\/\//, "");

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// Short labels keep the longest value (the LinkedIn URL) on one line on the card's back.
export const cardLinks = [
  { label: "mail", value: profile.email, href: `mailto:${profile.email}` },
  { label: "in", value: strip(profile.links.linkedin), href: profile.links.linkedin },
  ...(profile.links.github ? [{ label: "gh", value: strip(profile.links.github), href: profile.links.github }] : []),
];

// Dark modules on a white quiet zone scan reliably on every phone camera.
export function cardQrSvg() {
  return QRCode.toString(cardTargetUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 0,
    color: { dark: "#0a0a0a", light: "#ffffff" },
  });
}

// vCard 3.0 is the most widely supported format for "add to contacts" on iOS and Android.
export function vCard() {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.pop() ?? "";
  const middle = rest.join(" ");
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(last)};${esc(first)};${esc(middle)};;`,
    `FN:${esc(profile.name)}`,
    `NICKNAME:${esc(profile.shortName)}`,
    `TITLE:${esc(profile.roles.join(" · "))}`,
    `ORG:${esc(education.school)}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `URL:${siteUrl}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${profile.links.linkedin}`,
    ...(profile.links.github ? [`X-SOCIALPROFILE;TYPE=github:${profile.links.github}`] : []),
    "ADR;TYPE=WORK:;;;Catbalogan City;Samar;;Philippines",
    `NOTE:${esc(profile.headline)} Portfolio: ${siteUrl}`,
    "END:VCARD",
  ].join("\r\n");
}
