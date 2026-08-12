/**
 * Server-side validation for the contact endpoint.
 *
 * Hand-written rather than pulled from a schema library: the rule set is small,
 * the project keeps its dependency surface deliberately narrow, and doing it
 * here makes the header-injection guards explicit instead of incidental.
 *
 * Nothing the browser sends is trusted. The client's own validation exists for
 * feedback only.
 */

import {
  ALLOWED_KEYS,
  HONEYPOT_FIELD,
  LIMITS,
  VENUE_TYPES,
  type VenueType,
} from "./fields";

export type ContactSubmission = {
  name: string;
  company: string;
  email: string;
  venueType: VenueType;
  /** null when the visitor left it blank. */
  cameras: number | null;
  message: string;
  turnstileToken: string;
};

export type FieldErrors = Partial<
  Record<"name" | "company" | "email" | "venueType" | "cameras" | "message" | "privacy", string>
>;

export type ValidationResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; fieldErrors: FieldErrors; reason: "fields" | "honeypot" | "shape" };

/**
 * Strips characters that would let a value break out of an email header.
 * Applied to everything that reaches a header (subject, reply-to display).
 */
export function stripHeaderChars(value: string) {
  // Control characters only — CR/LF are what enable header injection.
  // Ordinary punctuation such as the hyphen in "Anna-Lena" must survive.
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Deliberately conservative. It is a syntax gate, not an RFC 5322 parser —
 * deliverability is proven by the reply, not by the regex.
 */
const EMAIL = /^[^\s@,;:<>()[\]\\"]+@[^\s@,;:<>()[\]\\".]+\.[a-zA-Z]{2,}$/;

export function validateSubmission(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, fieldErrors: {}, reason: "shape" };
  }

  // Reject unknown properties outright rather than ignoring them, so the
  // payload the endpoint accepts stays exactly the payload the form sends.
  const keys = Object.keys(raw);
  if (keys.some((key) => !(ALLOWED_KEYS as readonly string[]).includes(key))) {
    return { ok: false, fieldErrors: {}, reason: "shape" };
  }

  const body = raw as Record<string, unknown>;

  // Honeypot: a real browser never fills this. Reported separately so the
  // caller can answer with a plausible success and not teach a bot anything.
  if (asString(body[HONEYPOT_FIELD]).length > 0) {
    return { ok: false, fieldErrors: {}, reason: "honeypot" };
  }

  const fieldErrors: FieldErrors = {};

  const name = stripHeaderChars(asString(body.name));
  if (name.length < LIMITS.name.min) {
    fieldErrors.name = "Bitte geben Sie Ihren Namen an.";
  } else if (name.length > LIMITS.name.max) {
    fieldErrors.name = "Der Name ist zu lang.";
  }

  const company = stripHeaderChars(asString(body.company));
  if (company.length < LIMITS.company.min) {
    fieldErrors.company = "Bitte geben Sie Ihr Unternehmen an.";
  } else if (company.length > LIMITS.company.max) {
    fieldErrors.company = "Der Unternehmensname ist zu lang.";
  }

  const email = stripHeaderChars(asString(body.email));
  if (!email) {
    fieldErrors.email = "Bitte geben Sie eine geschäftliche E-Mail-Adresse an.";
  } else if (email.length > LIMITS.email.max || !EMAIL.test(email)) {
    fieldErrors.email = "Diese E-Mail-Adresse scheint nicht vollständig zu sein.";
  }

  const venueType = asString(body.venueType);
  if (!(VENUE_TYPES as readonly string[]).includes(venueType)) {
    fieldErrors.venueType = "Bitte wählen Sie die Art der Venue aus.";
  }

  // Optional. Accepts a number or a numeric string; anything else is an error
  // rather than a silent zero.
  let cameras: number | null = null;
  const rawCameras = body.cameras;
  if (rawCameras !== undefined && rawCameras !== null && rawCameras !== "") {
    const parsed =
      typeof rawCameras === "number" ? rawCameras : Number(asString(rawCameras));
    if (
      !Number.isFinite(parsed) ||
      !Number.isInteger(parsed) ||
      parsed < LIMITS.cameras.min ||
      parsed > LIMITS.cameras.max
    ) {
      fieldErrors.cameras = "Bitte geben Sie eine plausible Anzahl an Kameras an.";
    } else {
      cameras = parsed;
    }
  }

  const message = asString(body.message);
  if (message.length < LIMITS.message.min) {
    fieldErrors.message =
      "Bitte beschreiben Sie Ihr Anliegen in mindestens einem Satz.";
  } else if (message.length > LIMITS.message.max) {
    fieldErrors.message = "Die Nachricht ist zu lang.";
  }

  if (body.privacy !== true) {
    fieldErrors.privacy =
      "Bitte bestätigen Sie die Kenntnisnahme der Datenschutzerklärung.";
  }

  const turnstileToken = asString(body.turnstileToken);

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors, reason: "fields" };
  }

  return {
    ok: true,
    data: {
      name,
      company,
      email,
      venueType: venueType as VenueType,
      cameras,
      message,
      turnstileToken,
    },
  };
}
