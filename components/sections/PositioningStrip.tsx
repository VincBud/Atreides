import { Container } from "@/components/ui/Container";

const statements = [
  {
    title: "Bestehende Kamerainfrastruktur",
    detail: "Konzipiert für die Kameras, die in der Venue bereits vorhanden sind.",
  },
  {
    title: "Priorisierte Lagehinweise",
    detail: "Auffälligkeiten werden nach Dringlichkeit zur Prüfung geordnet.",
  },
  {
    title: "Menschliche Entscheidungshoheit",
    detail: "Bewertung und Maßnahmen bleiben beim verantwortlichen Team.",
  },
];

export function PositioningStrip() {
  return (
    <section
      id="lagebild"
      aria-label="Positionierung"
      className="scroll-mt-24 border-y border-steel/30 bg-navy-deep"
    >
      <Container>
        <ul className="grid divide-y divide-steel/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {statements.map((statement) => (
            <li
              key={statement.title}
              className="flex gap-3.5 py-7 sm:px-6 sm:py-8 sm:first:pl-0 sm:last:pr-0"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-signal"
              />
              <div>
                <p className="text-sm font-semibold tracking-tight text-cloud">
                  {statement.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-subtle">
                  {statement.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
