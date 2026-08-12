"use client";

import Link from "next/link";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type ReactNode,
  type SubmitEvent,
} from "react";

import { HONEYPOT_FIELD, LIMITS, VENUE_TYPES } from "@/lib/contact/fields";
import { owner } from "@/lib/site";

import { TurnstileWidget } from "./TurnstileWidget";

/**
 * Contact form.
 *
 * Submits to /api/contact, which validates everything again server-side. The
 * checks here exist for immediate feedback only — they are not a security
 * boundary and the endpoint does not trust them.
 *
 * Entered values survive every failure path. The form is only cleared once the
 * server has confirmed the send.
 */

type FieldName =
  | "name"
  | "company"
  | "email"
  | "venueType"
  | "cameras"
  | "message"
  | "privacy";

type Values = {
  name: string;
  company: string;
  email: string;
  venueType: string;
  cameras: string;
  message: string;
  privacy: boolean;
  /** Honeypot. Hidden from people, irresistible to naive bots. */
  website: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const INITIAL_VALUES: Values = {
  name: "",
  company: "",
  email: "",
  venueType: "",
  cameras: "",
  message: "",
  privacy: false,
  website: "",
};

const FIELD_LABELS: Record<FieldName, string> = {
  name: "Name",
  company: "Unternehmen",
  email: "Geschäftliche E-Mail",
  venueType: "Art der Venue",
  cameras: "Anzahl der Kameras",
  message: "Nachricht",
  privacy: "Datenschutzerklärung",
};

function validate(values: Values): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};

  if (values.name.trim().length < LIMITS.name.min) {
    errors.name = "Bitte geben Sie Ihren Namen an.";
  }
  if (values.company.trim().length < LIMITS.company.min) {
    errors.company = "Bitte geben Sie Ihr Unternehmen an.";
  }
  if (!values.email.trim()) {
    errors.email = "Bitte geben Sie eine geschäftliche E-Mail-Adresse an.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = "Diese E-Mail-Adresse scheint nicht vollständig zu sein.";
  }
  if (!values.venueType) {
    errors.venueType = "Bitte wählen Sie die Art der Venue aus.";
  }
  if (values.cameras.trim()) {
    const parsed = Number(values.cameras);
    if (
      !Number.isInteger(parsed) ||
      parsed < LIMITS.cameras.min ||
      parsed > LIMITS.cameras.max
    ) {
      errors.cameras = "Bitte geben Sie eine plausible Anzahl an Kameras an.";
    }
  }
  if (values.message.trim().length < LIMITS.message.min) {
    errors.message = "Bitte beschreiben Sie Ihr Anliegen in mindestens einem Satz.";
  }
  if (!values.privacy) {
    errors.privacy = "Bitte bestätigen Sie die Kenntnisnahme der Datenschutzerklärung.";
  }

  return errors;
}

const fieldClass =
  "w-full rounded-btn border border-steel/55 bg-navy/60 px-4 py-3 text-base text-cloud transition-colors placeholder:text-subtle/70 hover:border-steel focus:border-signal disabled:opacity-60";

export function ContactForm() {
  const formId = useId();
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileBroken, setTurnstileBroken] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  /**
   * The in-flight guard has to be a ref, not derived state. Several submits
   * dispatched in one tick all read the same pre-render `status`, so a
   * state-based check would let every one of them through.
   */
  const inFlightRef = useRef(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const submitting = status.kind === "submitting";

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  const handleToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
    if (token) setTurnstileBroken(false);
  }, []);

  const handleUnavailable = useCallback(() => setTurnstileBroken(true), []);

  function update<K extends keyof Values>(name: K, value: Values[K]) {
    setValues((current) => ({ ...current, [name]: value }));
    if (status.kind === "success" || status.kind === "error") {
      setStatus({ kind: "idle" });
    }
    if (name in errors) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name as FieldName];
        return next;
      });
    }
  }

  function focusSummary() {
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlightRef.current) return; // Double-click, repeated Enter, re-submit.

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ kind: "idle" });
      focusSummary();
      return;
    }

    inFlightRef.current = true;
    setStatus({ kind: "submitting" });

    let response: Response;
    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          company: values.company.trim(),
          email: values.email.trim(),
          venueType: values.venueType,
          cameras: values.cameras.trim() ? Number(values.cameras) : null,
          message: values.message.trim(),
          privacy: values.privacy,
          turnstileToken: turnstileToken ?? "",
          [HONEYPOT_FIELD]: values.website,
        }),
      });
    } catch {
      inFlightRef.current = false;
      setStatus({
        kind: "error",
        message:
          "Die Verbindung ist fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
      });
      setResetSignal((n) => n + 1);
      focusSummary();
      return;
    }

    const payload = (await response.json().catch(() => null)) as
      | {
          ok?: boolean;
          error?: string;
          fieldErrors?: Partial<Record<FieldName, string>>;
          resetChallenge?: boolean;
        }
      | null;

    inFlightRef.current = false;

    if (response.ok && payload?.ok) {
      // Only now is it safe to discard what the visitor typed.
      setValues(INITIAL_VALUES);
      setErrors({});
      setStatus({ kind: "success" });
      setResetSignal((n) => n + 1);
      return;
    }

    if (payload?.fieldErrors && Object.keys(payload.fieldErrors).length > 0) {
      setErrors(payload.fieldErrors);
    }
    setStatus({
      kind: "error",
      message:
        payload?.error ??
        "Die Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es erneut.",
    });
    // Turnstile tokens are single-use; any attempt consumes one.
    setResetSignal((n) => n + 1);
    focusSummary();
  }

  const errorEntries = (Object.keys(errors) as FieldName[]).filter((key) => errors[key]);
  const hasSummary = errorEntries.length > 0 || status.kind === "error";

  function describedBy(name: FieldName, extra?: string) {
    return (
      [errors[name] ? errorId(name) : null, extra].filter(Boolean).join(" ") ||
      undefined
    );
  }

  return (
    <div className="rounded-panel border border-steel/40 bg-panel/60 p-6 sm:p-8">
      <form onSubmit={handleSubmit} noValidate>
        {/* Combined summary: client validation, server field errors, send failures. */}
        <div
          ref={summaryRef}
          tabIndex={-1}
          role={hasSummary ? "alert" : undefined}
          className={
            hasSummary
              ? "mb-6 rounded-card border border-danger/50 bg-danger/[0.08] p-4"
              : "sr-only"
          }
        >
          {hasSummary ? (
            <>
              {status.kind === "error" ? (
                <p className="text-sm font-semibold text-danger">{status.message}</p>
              ) : null}
              {errorEntries.length > 0 ? (
                <>
                  <p
                    className={`text-sm font-semibold text-danger ${
                      status.kind === "error" ? "mt-2" : ""
                    }`}
                  >
                    Bitte prüfen Sie {errorEntries.length}{" "}
                    {errorEntries.length === 1 ? "Angabe" : "Angaben"}:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                    {errorEntries.map((key) => (
                      <li key={key}>
                        <a href={`#${fieldId(key)}`} className="underline">
                          {FIELD_LABELS[key]}
                        </a>
                        : {errors[key]}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </>
          ) : null}
        </div>

        <fieldset disabled={submitting} className="contents">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id={fieldId("name")}
              label="Name"
              error={errors.name}
              errorId={errorId("name")}
            >
              <input
                id={fieldId("name")}
                name="name"
                type="text"
                autoComplete="name"
                maxLength={LIMITS.name.max}
                required
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy("name")}
                className={fieldClass}
              />
            </Field>

            <Field
              id={fieldId("company")}
              label="Unternehmen"
              error={errors.company}
              errorId={errorId("company")}
            >
              <input
                id={fieldId("company")}
                name="company"
                type="text"
                autoComplete="organization"
                maxLength={LIMITS.company.max}
                required
                value={values.company}
                onChange={(event) => update("company", event.target.value)}
                aria-invalid={Boolean(errors.company)}
                aria-describedby={describedBy("company")}
                className={fieldClass}
              />
            </Field>

            <Field
              id={fieldId("email")}
              label="Geschäftliche E-Mail"
              error={errors.email}
              errorId={errorId("email")}
            >
              <input
                id={fieldId("email")}
                name="email"
                type="email"
                autoComplete="email"
                maxLength={LIMITS.email.max}
                required
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy("email")}
                className={fieldClass}
              />
            </Field>

            <Field
              id={fieldId("venueType")}
              label="Art der Venue"
              error={errors.venueType}
              errorId={errorId("venueType")}
            >
              <select
                id={fieldId("venueType")}
                name="venueType"
                required
                value={values.venueType}
                onChange={(event) => update("venueType", event.target.value)}
                aria-invalid={Boolean(errors.venueType)}
                aria-describedby={describedBy("venueType")}
                className={`${fieldClass} appearance-none`}
              >
                <option value="">Bitte auswählen</option>
                {VENUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field
                id={fieldId("cameras")}
                label="Anzahl der Kameras"
                optionalHint="optional"
                hint="Eine grobe Schätzung genügt."
                hintId={`${formId}-cameras-hint`}
                error={errors.cameras}
                errorId={errorId("cameras")}
              >
                <input
                  id={fieldId("cameras")}
                  name="cameras"
                  type="number"
                  inputMode="numeric"
                  min={LIMITS.cameras.min}
                  max={LIMITS.cameras.max}
                  value={values.cameras}
                  onChange={(event) => update("cameras", event.target.value)}
                  aria-invalid={Boolean(errors.cameras)}
                  aria-describedby={describedBy("cameras", `${formId}-cameras-hint`)}
                  className={`${fieldClass} sm:max-w-xs`}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field
                id={fieldId("message")}
                label="Nachricht"
                error={errors.message}
                errorId={errorId("message")}
              >
                <textarea
                  id={fieldId("message")}
                  name="message"
                  rows={5}
                  maxLength={LIMITS.message.max}
                  required
                  value={values.message}
                  onChange={(event) => update("message", event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={describedBy("message")}
                  className={`${fieldClass} resize-y`}
                />
              </Field>
            </div>
          </div>

          {/*
            Honeypot. Hidden from assistive technology and from autofill, not
            merely moved off-screen with a class a bot could recognise.
          */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
            <label htmlFor={fieldId(HONEYPOT_FIELD)}>
              Bitte dieses Feld leer lassen
            </label>
            <input
              id={fieldId(HONEYPOT_FIELD)}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(event) => update("website", event.target.value)}
            />
          </div>

          <div className="mt-6">
            <div className="flex gap-3">
              <input
                id={fieldId("privacy")}
                name="privacy"
                type="checkbox"
                checked={values.privacy}
                onChange={(event) => update("privacy", event.target.checked)}
                required
                aria-invalid={Boolean(errors.privacy)}
                aria-describedby={describedBy("privacy")}
                className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-signal)]"
              />
              <label
                htmlFor={fieldId("privacy")}
                className="text-sm leading-relaxed text-muted"
              >
                Ich habe die{" "}
                <Link
                  href="/datenschutz"
                  className="text-cloud underline underline-offset-2 hover:text-signal"
                >
                  Datenschutzerklärung
                </Link>{" "}
                gelesen.
              </label>
            </div>
            {errors.privacy ? (
              <FieldError id={errorId("privacy")} message={errors.privacy} />
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2.5 rounded-btn bg-signal px-6 py-3 text-base font-semibold text-navy transition-colors hover:bg-signal/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {submitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy"
                />
                Wird gesendet …
              </>
            ) : (
              "Anfrage senden"
            )}
          </button>
        </fieldset>

        {/* Spam protection. Invisible unless the visitor has to interact. */}
        {siteKey ? (
          <div className="mt-5">
            <TurnstileWidget
              siteKey={siteKey}
              onToken={handleToken}
              onUnavailable={handleUnavailable}
              resetSignal={resetSignal}
            />
            <p className="mt-2 text-xs leading-relaxed text-subtle">
              Dieses Formular ist durch Cloudflare Turnstile vor Missbrauch
              geschützt. Details in der{" "}
              <Link
                href="/datenschutz"
                className="underline underline-offset-2 hover:text-signal"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
            {turnstileBroken ? (
              <p className="mt-2 text-sm text-danger">
                Die Sicherheitsprüfung konnte nicht geladen werden. Bitte laden Sie
                die Seite neu oder schreiben Sie uns direkt an{" "}
                <a
                  href={`mailto:${owner.email}`}
                  className="underline underline-offset-2"
                >
                  {owner.email}
                </a>
                .
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Submission status for screen readers and sighted users alike. */}
        <div aria-live="polite" className="empty:hidden">
          {status.kind === "success" ? (
            <div className="mt-6 rounded-card border border-signal/45 bg-signal/[0.08] p-5">
              <p className="text-sm font-semibold text-cloud">
                Vielen Dank. Ihre Anfrage wurde übermittelt. Wir melden uns bei Ihnen.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Sie erhalten keine automatische Bestätigungsmail. Bei Rückfragen
                antworten wir direkt an die angegebene Adresse.
              </p>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  errorId?: string;
  optionalHint?: string;
  hint?: string;
  hintId?: string;
};

function Field({
  id,
  label,
  children,
  error,
  errorId,
  optionalHint,
  hint,
  hintId,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 text-sm font-medium text-cloud"
      >
        {label}
        {optionalHint ? (
          <span className="text-xs font-normal text-subtle">({optionalHint})</span>
        ) : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-subtle">
          {hint}
        </p>
      ) : null}
      {error && errorId ? <FieldError id={errorId} message={error} /> : null}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm text-danger">
      <svg
        viewBox="0 0 16 16"
        className="mt-0.5 h-3.5 w-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M8 2.5 1.8 13.5h12.4L8 2.5Z" />
        <path d="M8 6.8v3" />
        <path d="M8 11.6v.1" />
      </svg>
      <span>{message}</span>
    </p>
  );
}
