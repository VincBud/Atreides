import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const useCases = [
  {
    title: "Clubs und Nachtgastronomie",
    body: "Mehr Übersicht über stark frequentierte Bereiche, Tanzflächen, Zugänge und dynamische Gruppensituationen.",
  },
  {
    title: "Festivals und Großveranstaltungen",
    body: "Unterstützung bei der Beobachtung von Menschenströmen, Engstellen und schnell wechselnden Belastungssituationen.",
  },
  {
    title: "Festzelte und Eventhallen",
    body: "Strukturierte Lagehinweise für unübersichtliche Innenräume mit hoher Besucherdichte.",
  },
  {
    title: "Security-Unternehmen",
    body: "Eine zentrale Entscheidungsgrundlage für Teams, die mehrere Kameras und Bereiche gleichzeitig betreuen.",
  },
];

export function UseCases() {
  return (
    <Section id="einsatzbereiche" labelledBy="usecases-headline">
      <SectionHeading
        id="usecases-headline"
        eyebrow="Einsatzbereiche"
        headline="Entwickelt für komplexe Veranstaltungsumgebungen."
      />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16">
        {useCases.map((useCase) => (
          <li
            key={useCase.title}
            className="group relative overflow-hidden rounded-card border border-steel/40 bg-panel/60 p-7 transition-colors duration-200 hover:border-steel/70 sm:p-8"
          >
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 h-full w-1 bg-signal/0 transition-colors duration-200 group-hover:bg-signal/70"
            />
            <h3 className="text-xl font-semibold tracking-tight text-cloud">
              {useCase.title}
            </h3>
            <p className="mt-3.5 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              {useCase.body}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
