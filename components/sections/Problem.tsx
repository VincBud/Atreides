import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const cards = [
  {
    title: "Begrenzte Aufmerksamkeit",
    body: "Kein Team kann jede Kamera dauerhaft mit derselben Konzentration beobachten.",
  },
  {
    title: "Dynamische Menschenmengen",
    body: "Auslastung, Bewegungsrichtungen und Gruppendynamiken können sich innerhalb weniger Minuten verändern.",
  },
  {
    title: "Reaktion statt Vorsprung",
    body: "Viele Situationen werden erst priorisiert, wenn sie bereits deutlich eskaliert sind.",
  },
  {
    title: "Daten ohne Lagebild",
    body: "Vorhandene Kameras liefern Videomaterial, aber nicht automatisch eine klare operative Priorisierung.",
  },
];

export function Problem() {
  return (
    <Section tone="deep" labelledBy="problem-headline">
      <SectionHeading
        id="problem-headline"
        eyebrow="Die Herausforderung"
        headline="Mehr Kameras bedeuten nicht automatisch mehr Übersicht."
        intro="Security-Teams müssen gleichzeitig zahlreiche Bereiche, Kameras und Lageveränderungen im Blick behalten. Relevante Entwicklungen können dabei zwischen vielen unauffälligen Videostreams zu spät sichtbar werden."
      />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {cards.map((card, index) => (
          <li
            key={card.title}
            className="flex flex-col rounded-card border border-steel/40 bg-panel/60 p-6 transition-colors duration-200 hover:border-steel/70"
          >
            <span
              aria-hidden="true"
              className="font-display text-sm font-semibold text-subtle tabular-nums"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-cloud">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
