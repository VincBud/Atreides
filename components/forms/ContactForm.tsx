"use client";

import Link from "next/link";
import { useId, useRef, useState, type ReactNode, type SubmitEvent } from "react";

import { owner } from "@/lib/site";

/**
 * Frontend-only contact form.
 *
 * No backend is connected yet, so the form must never imply that a message was
 * sent. Validation runs normally, but a successful submit only produces an
 * explicit "nothing was transmitted" acknowledgement. Entered values are kept so
 * nothing the visitor typed is lost.
 */

type FieldName = "name" | "company" | "email" | "venueType" | "message" | "privacy";

type Values = {
  name: string;
  company: string;
  email: string;
  venueType: string;
  cameras: string;
  message: string;
  privacy: boolean;
};

const INITIAL_VALUES: Values = {
  name: "",
  company: "",
  email: "",
  venueType: "",
  cameras: "",
  message: "",
  privacy: false,
};

const VENUE_TYPES = [
  "Club / Nachtgastronomie",
  "Festival / Großveranstaltung",
  "Festzelt / Eventhalle",
  "Security-Unternehmen",
  "Sonstige",
];

const FIELD_LABELS: Record<FieldName, string> = {
  name: "Name",
  company: "Unternehmen",
  email: "Geschäftliche E-Mail",
  venueType: "Art der Venue",
  message: "Nachricht",
  privacy: "Datenschutzerklärung",
};

function validate(values: Values): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};

  if (!values.name.trim()) {
    errors.name = "Bitte geben Sie Ihren Namen an.";
  }
  if (!values.company.trim()) {
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
  if (!values.message.trim()) {
    errors.message = "Bitte beschreiben Sie kurz Ihr Anliegen.";
  }
  if (!values.privacy) {
    errors.privacy = "Bitte bestätigen Sie die Kenntnisnahme der Datenschutzerklärung.";
  }

  return errors;
}

const fieldClass =
  "w-full rounded-btn border border-steel/55 bg-navy/60 px-4 py-3 text-base text-cloud transition-colors placeholder:text-subtle/70 hover:border-steel focus:border-signal";

export function ContactForm() {
  const formId = useId();
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [acknowledged, setAcknowledged] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  function update<K extends keyof Values>(name: K, value: Values[K]) {
    setValues((current) => ({ ...current, [name]: value }));
    setAcknowledged(false);
    if (name in errors) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name as FieldName];
        return next;
      });
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setAcknowledged(false);
      // Move attention to the error summary for screen reader and keyboard users.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    // Deliberately no network request: no backend has been approved yet.
    setAcknowledged(true);
  }

  const errorEntries = (Object.keys(errors) as FieldName[]).filter(
    (key) => errors[key],
  );

  function describedBy(name: FieldName, extra?: string) {
    return [errors[name] ? errorId(name) : null, extra].filter(Boolean).join(" ") ||
      undefined;
  }

  return (
    <div className="rounded-panel border border-steel/40 bg-panel/60 p-6 sm:p-8">
      {/* Persistent, unmissable statement of the current backend status. */}
      <p
        className="flex gap-3 rounded-card border border-signal/30 bg-signal/[0.06] p-4 text-sm leading-relaxed text-muted"
        id={`${formId}-status`}
      >
        <svg
          viewBox="0 0 20 20"
          className="mt-0.5 h-4 w-4 shrink-0 text-signal"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="8" />
          <path d="M10 6.5v4.5" />
          <path d="M10 13.6v.1" />
        </svg>
        <span>
          Das Kontaktformular wird derzeit technisch vorbereitet. Bis zur Freigabe
          der Versandlogik werden keine Angaben übertragen.
        </span>
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-7">
        {/* Error summary */}
        <div
          ref={summaryRef}
          tabIndex={-1}
          role={errorEntries.length > 0 ? "alert" : undefined}
          className={
            errorEntries.length > 0
              ? "mb-6 rounded-card border border-danger/50 bg-danger/[0.08] p-4"
              : "sr-only"
          }
        >
          {errorEntries.length > 0 ? (
            <>
              <p className="text-sm font-semibold text-danger">
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
        </div>

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
            >
              <input
                id={fieldId("cameras")}
                name="cameras"
                type="number"
                inputMode="numeric"
                min={0}
                value={values.cameras}
                onChange={(event) => update("cameras", event.target.value)}
                aria-describedby={`${formId}-cameras-hint`}
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
          className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-btn bg-signal px-6 py-3 text-base font-semibold text-navy transition-colors hover:bg-signal/90 sm:w-auto"
        >
          Anfrage senden
        </button>

        {/* Honest post-submit acknowledgement. */}
        <div aria-live="polite">
          {acknowledged ? (
            <div className="mt-6 rounded-card border border-signal/40 bg-signal/[0.08] p-5">
              <p className="text-sm font-semibold text-cloud">
                Ihre Angaben wurden nicht übertragen.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Der Versand ist noch nicht freigeschaltet, daher wurde nichts
                gesendet und nichts gespeichert. Ihre Eingaben bleiben in diesem
                Formular stehen. Bitte kontaktieren Sie uns bis zur Freigabe direkt
                per E-Mail:{" "}
                <a
                  href={`mailto:${owner.email}`}
                  className="font-semibold text-cloud underline underline-offset-2 hover:text-signal"
                >
                  {owner.email}
                </a>
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
