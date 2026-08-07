import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Erfassen",
    body: "Bestehende Kameras liefern Live-Videodaten aus den relevanten Bereichen der Venue.",
  },
  {
    title: "Analysieren",
    body: "Atreides verarbeitet Bewegungs- und Situationssignale und erkennt auffällige Veränderungen innerhalb definierter Zonen.",
  },
  {
    title: "Unterstützen",
    body: "Das Security-Team erhält einen priorisierten Hinweis mit Kontext und entscheidet selbst über das weitere Vorgehen.",
  },
];

export function Workflow() {
  return (
    <Section id="funktionsweise" tone="deep" labelledBy="workflow-headline">
      <SectionHeading
        id="workflow-headline"
        eyebrow="Funktionsweise"
        headline="Drei Schritte zu mehr operativer Übersicht."
      />

      <ol className="relative mt-14 grid gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-6">
        {/* Connecting line, desktop only. */}
        <div
          aria-hidden="true"
          className="absolute top-[3.25rem] right-8 left-8 hidden h-px bg-gradient-to-r from-steel/10 via-steel/60 to-steel/10 lg:block"
        />

        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative rounded-card border border-steel/40 bg-panel/60 p-7"
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="font-display inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-signal/40 bg-navy text-base font-bold text-signal tabular-nums"
              >
                {index + 1}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-cloud">
                <span className="sr-only">{`Schritt ${index + 1}: `}</span>
                {step.title}
              </h3>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-subtle">
        Der Ablauf ist so angelegt, dass jeder Hinweis eine menschliche Prüfung
        auslöst — nicht eine automatische Maßnahme.
      </p>
    </Section>
  );
}
