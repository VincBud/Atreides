import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Principles only. Nothing here asserts a hosting region, certification or
 * implementation status — items that are design objectives say so explicitly.
 */
const principles = [
  {
    title: "Keine Gesichtserkennung",
    status: "Produktgrundsatz",
  },
  {
    title: "Keine biometrische Identifikation",
    status: "Produktgrundsatz",
  },
  {
    title: "Rollenbasierte Zugriffe",
    status: "Designziel",
  },
  {
    title: "Nachvollziehbare Prüfung von Hinweisen",
    status: "Designziel",
  },
  {
    title: "Konfigurierbare Datenaufbewahrung",
    status: "Designziel",
  },
];

export function ResponsibleTechnology() {
  return (
    <Section labelledBy="responsible-headline">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <SectionHeading
          id="responsible-headline"
          eyebrow="Verantwortungsvolle Technologie"
          headline="Sicherheit braucht Vertrauen und klare Grenzen."
          intro="Atreides wird nach dem Prinzip der Datenminimierung und mit klarer menschlicher Kontrolle konzipiert. Gesichtserkennung und biometrische Identifikation sind nicht Teil der Produktpositionierung."
        />

        <div>
          <ul className="divide-y divide-steel/30 rounded-card border border-steel/40 bg-panel/60">
            {principles.map((principle) => (
              <li
                key={principle.title}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-5"
              >
                <span className="text-base font-medium text-cloud">
                  {principle.title}
                </span>
                <span className="rounded-full border border-steel/60 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-subtle">
                  {principle.status}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 rounded-card border border-signal/30 bg-signal/[0.06] p-5 text-sm leading-relaxed text-muted">
            <span className="font-semibold text-cloud">Hinweis: </span>
            Konkrete technische und datenschutzrechtliche Ausgestaltung wird
            gemeinsam mit Pilotpartnern und Fachberatung definiert.
          </p>
        </div>
      </div>
    </Section>
  );
}
