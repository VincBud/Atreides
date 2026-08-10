/**
 * Central site configuration.
 *
 * Values still marked as placeholders must be replaced by the site owner before
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

/**
 * Legal operator of the website.
 *
 * The site is operated by Vincent Fitsch as a natural person — there is no
 * company, no registry entry and no VAT ID behind it. § 5 DDG requires legal
 * form and an authorised representative only for legal entities, so those rows
 * are omitted entirely rather than rendered empty or as "nicht vorhanden".
 * No telephone number is published by choice.
 */
export const owner = {
  name: "Vincent Fitsch",
  addressLines: ["Birkenweg 7a", "83064 Raubling", "Deutschland"],
  /** Single contact address used in Impressum, privacy policy and on the page. */
  email: "vincentfitsch@gmail.com",
} as const;

/** One-line address for inline use in running text. */
export const ownerAddressInline = owner.addressLines.join(", ");

/** Owner inputs that are still outstanding. Rendered verbatim on the site. */
export const placeholders = {
  hosting: "[HOSTING-ANBIETER ERGÄNZEN]",
  hostingDetails:
    "[SPEICHERDAUER, AUFTRAGSVERARBEITUNG UND SERVERSTANDORT ERGÄNZEN]",
  consumerArbitration: "[ANGABE ZUR VERBRAUCHERSCHLICHTUNG ERGÄNZEN]",
  /** Set to the actual public launch date when the site goes live. */
  lastUpdated: "[VERÖFFENTLICHUNGSDATUM ERGÄNZEN]",
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
