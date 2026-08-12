/**
 * Contact endpoint.
 *
 * Browser → this route → Turnstile siteverify → Resend → CONTACT_TO_EMAIL.
 * Nothing is persisted; the email is the only record.
 *
 * Order matters: cheap checks first (shape, honeypot, fields), then the
 * network call to Cloudflare, then Resend. A malformed or bot payload never
 * reaches a paid provider.
 *
 * The client is told what it needs to fix and nothing else — no provider
 * errors, no configuration state, no stack traces.
 */

import { Resend } from "resend";

import {
  buildHtml,
  buildSubject,
  buildText,
  formatTimestamp,
  FROM_ADDRESS,
} from "@/lib/contact/email";
import { MAX_BODY_BYTES } from "@/lib/contact/fields";
import { validateSubmission, type FieldErrors } from "@/lib/contact/schema";
import { verifyTurnstile } from "@/lib/contact/turnstile";

/** Needs a Node runtime for the Resend SDK. */
export const runtime = "nodejs";
/** Never cached, never prerendered. */
export const dynamic = "force-dynamic";

type Failure = {
  status: number;
  error: string;
  fieldErrors?: FieldErrors;
  /** Signals the client to fetch a fresh Turnstile token before retrying. */
  resetChallenge?: boolean;
};

const GENERIC_ERROR =
  "Die Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt per E-Mail.";

function fail({ status, error, fieldErrors, resetChallenge }: Failure) {
  return Response.json(
    { ok: false, error, fieldErrors, resetChallenge },
    { status },
  );
}

/**
 * Server-side only. Deliberately never includes message content, names or
 * email addresses — the console is not a place for enquiry data.
 */
function logOutcome(outcome: string, detail?: Record<string, unknown>) {
  console.info("[contact]", outcome, detail ? JSON.stringify(detail) : "");
}

export async function POST(request: Request) {
  // ---- configuration ------------------------------------------------------
  // Read at request time, never at module scope, so a missing variable during
  // build or static analysis cannot break the build.
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_TO_EMAIL;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!resendApiKey || !recipient || !turnstileSecret) {
    // Names only — never values.
    logOutcome("misconfigured", {
      missing: [
        !resendApiKey && "RESEND_API_KEY",
        !recipient && "CONTACT_TO_EMAIL",
        !turnstileSecret && "TURNSTILE_SECRET_KEY",
      ].filter(Boolean),
    });
    return fail({ status: 503, error: GENERIC_ERROR });
  }

  // ---- transport ----------------------------------------------------------
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail({ status: 415, error: GENERIC_ERROR });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return fail({ status: 413, error: GENERIC_ERROR });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return fail({ status: 400, error: GENERIC_ERROR });
  }

  // Content-Length can lie; measure what actually arrived.
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return fail({ status: 413, error: GENERIC_ERROR });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return fail({ status: 400, error: GENERIC_ERROR });
  }

  // ---- validation ---------------------------------------------------------
  const validation = validateSubmission(parsed);

  if (!validation.ok) {
    if (validation.reason === "honeypot") {
      // Answer as if it worked. A bot learns nothing; no email is sent.
      logOutcome("honeypot");
      return Response.json({ ok: true }, { status: 200 });
    }
    if (validation.reason === "shape") {
      return fail({ status: 400, error: GENERIC_ERROR });
    }
    return fail({
      status: 400,
      error: "Bitte prüfen Sie die markierten Angaben.",
      fieldErrors: validation.fieldErrors,
    });
  }

  const submission = validation.data;

  // ---- bot protection -----------------------------------------------------
  const forwardedFor = request.headers.get("x-forwarded-for");
  const remoteIp = forwardedFor?.split(",")[0]?.trim() || undefined;

  const turnstile = await verifyTurnstile(
    submission.turnstileToken,
    turnstileSecret,
    remoteIp,
  );

  if (!turnstile.ok) {
    logOutcome("turnstile-rejected", { codes: turnstile.codes });
    return fail({
      status: 403,
      error: turnstile.retryable
        ? "Die Sicherheitsprüfung ist abgelaufen. Bitte senden Sie das Formular erneut."
        : "Die Sicherheitsprüfung konnte nicht abgeschlossen werden. Bitte laden Sie die Seite neu.",
      resetChallenge: true,
    });
  }

  // ---- delivery -----------------------------------------------------------
  const timestamp = formatTimestamp(new Date());

  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [recipient],
      // The only place the visitor's address reaches a header, and it has
      // already passed strict syntax validation and control-char stripping.
      replyTo: submission.email,
      subject: buildSubject(submission),
      text: buildText(submission, timestamp),
      html: buildHtml(submission, timestamp),
    });

    if (error) {
      logOutcome("send-failed", { name: error.name });
      return fail({ status: 502, error: GENERIC_ERROR, resetChallenge: true });
    }
  } catch {
    logOutcome("send-threw");
    return fail({ status: 502, error: GENERIC_ERROR, resetChallenge: true });
  }

  logOutcome("sent");
  return Response.json({ ok: true }, { status: 200 });
}
