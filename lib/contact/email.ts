/**
 * Enquiry email.
 *
 * Everything the visitor typed is escaped before it reaches the HTML body, and
 * anything that lands in a header has already had control characters stripped
 * by the validator. The recipient comes from CONTACT_TO_EMAIL only — there is
 * no request parameter that can redirect where mail goes.
 */

import type { ContactSubmission } from "./schema";

export const FROM_ADDRESS =
  "Atreides Website <website@mail.atreides-security.com>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(date);
}

type Row = { label: string; value: string };

function rows(submission: ContactSubmission, timestamp: string): Row[] {
  return [
    { label: "Name", value: submission.name },
    { label: "Unternehmen", value: submission.company },
    { label: "E-Mail", value: submission.email },
    { label: "Venue-Typ", value: submission.venueType },
    {
      label: "Anzahl Kameras",
      value: submission.cameras === null ? "keine Angabe" : String(submission.cameras),
    },
    { label: "Eingegangen", value: timestamp },
  ];
}

export function buildSubject(submission: ContactSubmission) {
  return `Neue Atreides Pilotanfrage — ${submission.company}`;
}

export function buildText(submission: ContactSubmission, timestamp: string) {
  const lines = rows(submission, timestamp).map((row) => `${row.label}: ${row.value}`);
  return [
    "Neue Anfrage über das Kontaktformular auf atreides-security.com",
    "",
    ...lines,
    "",
    "Nachricht:",
    submission.message,
    "",
    "— Antworten Sie direkt auf diese E-Mail, um der anfragenden Person zu antworten.",
  ].join("\n");
}

export function buildHtml(submission: ContactSubmission, timestamp: string) {
  const cells = rows(submission, timestamp)
    .map(
      (row) => `
        <tr>
          <td style="padding:6px 16px 6px 0;color:#5b6b7c;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(
            row.label,
          )}</td>
          <td style="padding:6px 0;color:#18202a;font-size:14px;font-weight:600;">${escapeHtml(
            row.value,
          )}</td>
        </tr>`,
    )
    .join("");

  // Message is escaped first, then newlines become <br> — never the reverse.
  const message = escapeHtml(submission.message).replace(/\n/g, "<br>");

  return `<!doctype html>
<html lang="de">
<body style="margin:0;padding:24px;background:#f4f7f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #dde4ea;border-radius:12px;overflow:hidden;">
    <div style="background:#0b1426;padding:18px 24px;">
      <span style="color:#f2a900;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Atreides</span>
      <div style="color:#f4f7f9;font-size:17px;font-weight:600;margin-top:4px;">Neue Pilotanfrage</div>
    </div>
    <div style="padding:24px;">
      <table style="border-collapse:collapse;width:100%;">${cells}</table>
      <div style="margin-top:20px;padding-top:18px;border-top:1px solid #e4eaef;">
        <div style="color:#5b6b7c;font-size:13px;margin-bottom:8px;">Nachricht</div>
        <div style="color:#18202a;font-size:14px;line-height:1.6;">${message}</div>
      </div>
      <div style="margin-top:22px;color:#5b6b7c;font-size:12px;">
        Antworten Sie direkt auf diese E-Mail, um der anfragenden Person zu antworten.
      </div>
    </div>
  </div>
</body>
</html>`;
}
