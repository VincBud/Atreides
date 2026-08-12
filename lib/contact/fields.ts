/**
 * The contact form's field contract.
 *
 * Shared by the browser form and the API route so the two can never drift.
 * The server re-validates everything regardless — this module exists to keep
 * the rules in one place, not to let the server trust the client.
 */

/** Venue types offered by the UI. The server accepts nothing else. */
export const VENUE_TYPES = [
  "Club / Nachtgastronomie",
  "Festival / Großveranstaltung",
  "Festzelt / Eventhalle",
  "Security-Unternehmen",
  "Sonstige",
] as const;

export type VenueType = (typeof VENUE_TYPES)[number];

export const LIMITS = {
  name: { min: 2, max: 120 },
  company: { min: 2, max: 160 },
  email: { max: 254 },
  message: { min: 20, max: 4000 },
  cameras: { min: 0, max: 10000 },
} as const;

/**
 * Hard cap on the raw request body.
 *
 * Comfortably above the sum of the field limits and far below anything worth
 * buffering. Checked against Content-Length and again against the decoded body,
 * since Content-Length can lie.
 */
export const MAX_BODY_BYTES = 16 * 1024;

/** Name of the honeypot field. Real people never see or fill it. */
export const HONEYPOT_FIELD = "website";

/** Every property the endpoint will read. Anything else is rejected. */
export const ALLOWED_KEYS = [
  "name",
  "company",
  "email",
  "venueType",
  "cameras",
  "message",
  "privacy",
  "turnstileToken",
  HONEYPOT_FIELD,
] as const;
