/**
 * Central site configuration.
 *
 * Values marked as placeholders must be replaced by the site owner before
 * launch. They are intentionally left as visible bracketed strings so that
 * missing information is impossible to overlook in the rendered output.
 */

export const siteConfig = {
  name: "Atreides",
  tagline: "AI Venue Intelligence",
  url: "https://atreides-security.com",
  locale: "de_DE",
  title: "Atreides — AI Venue Intelligence für moderne Security-Teams",
  description:
    "Atreides verwandelt Daten bestehender Sicherheitskameras in priorisierte Lagehinweise, Heatmaps und mehr Übersicht für menschlich geführte Security-Teams.",
  footerDescription:
    "AI Venue Intelligence für mehr Übersicht und menschlich geführte Sicherheitsentscheidungen.",
} as const;

/** Owner inputs that are still outstanding. Rendered verbatim on the site. */
export const placeholders = {
  entity: "[RECHTSFORM / BETREIBER ERGÄNZEN]",
  address: "[VOLLSTÄNDIGE ANSCHRIFT ERGÄNZEN]",
  representative: "[VERTRETUNGSBERECHTIGTE PERSON ERGÄNZEN]",
  email: "[GESCHÄFTLICHE E-MAIL ERGÄNZEN]",
  phone: "[TELEFON OPTIONAL ERGÄNZEN]",
  hosting: "[HOSTING-ANBIETER ERGÄNZEN]",
  registry: "[REGISTERGERICHT UND REGISTERNUMMER ERGÄNZEN]",
  vatId: "[UMSATZSTEUER-ID ERGÄNZEN, FALLS VORHANDEN]",
  lastUpdated: "[STAND / DATUM ERGÄNZEN]",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/*
 * Anchors are root-relative (`/#…`) rather than bare (`#…`) so the header keeps
 * working on /impressum and /datenschutz, where the sections do not exist.
 */
export const navItems: readonly NavItem[] = [
  { label: "Produkt", href: "/#produkt" },
  { label: "Funktionsweise", href: "/#funktionsweise" },
  { label: "Einsatzbereiche", href: "/#einsatzbereiche" },
  { label: "Verantwortung", href: "/#verantwortung" },
  { label: "Kontakt", href: "/#kontakt" },
] as const;

export const primaryCta = {
  label: "Pilotprojekt besprechen",
  href: "/#kontakt",
} as const;

export const secondaryCta = {
  label: "Funktionsweise ansehen",
  href: "/#funktionsweise",
} as const;
