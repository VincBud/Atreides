/**
 * Central site configuration.
 *
 * Single source of truth for the operator's legal data, the production domain
 * and the hosting provider. Nothing here is a placeholder any more — if a value
 * is unknown, it is omitted from the site rather than shown as a gap.
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

/**
 * Production infrastructure, as actually deployed.
 *
 * OWNER VERIFICATION STILL OUTSTANDING — deliberately not stated on the public
 * privacy page, because none of it has been confirmed:
 *   - whether a data processing agreement (AVV/DPA) with the provider is in place
 *   - the deployment region and where access data is actually processed
 *   - how long the provider retains access logs
 *   - the mechanism relied on for any transfer outside the EU/EEA
 * The privacy policy is written so it remains accurate without them. Once
 * confirmed, extend section 3 of app/datenschutz/page.tsx.
 */
export const hosting = {
  provider: "Vercel",
} as const;

/**
 * Editorial revision date of the legal pages.
 *
 * Static on purpose: deriving it from the current date would silently claim the
 * documents were reviewed on every request.
 */
export const legalLastUpdated = "12. August 2026";

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
