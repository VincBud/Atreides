import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const principles = [
  "Jeder relevante Hinweis wird von Menschen geprüft.",
  "Die finale Bewertung bleibt beim verantwortlichen Team.",
  "Maßnahmen werden nicht automatisch ausgelöst.",
  "Atreides unterstützt die Lagebeurteilung, nicht die Etikettierung von Personen.",
];

const chain = [
  { label: "Signal aus der Zone", actor: "System" },
  { label: "Priorisierter Hinweis", actor: "System" },
  { label: "Prüfung der Situation", actor: "Mensch" },
  { label: "Entscheidung und Maßnahme", actor: "Mensch" },
];

export function HumanControl() {
  return (
    <Section id="verantwortung" tone="light" labelledBy="humancontrol-headline">
      {/* The cinematic sequence states the principle. This section explains
          the reasoning behind it, deliberately in different words. */}
      <SectionHeading
        id="humancontrol-headline"
        eyebrow="Human in the loop"
        headline="Warum die Entscheidung beim Team bleibt."
        tone="light"
        className="max-w-4xl"
        intro="Ein System, das Situationen bewertet, verschiebt Verantwortung. Atreides ist deshalb so angelegt, dass es Aufmerksamkeit lenkt und Kontext aufbereitet — und überall dort, wo eine Einschätzung nötig wird, an einen Menschen übergibt. Es klassifiziert keine Person als gefährlich und löst keine eigenständigen Maßnahmen aus."
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-20">
        <div>
          <ul className="space-y-4">
            {principles.map((principle) => (
              <li key={principle} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-signal"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="var(--color-navy)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                </span>
                <span className="text-base leading-relaxed text-graphite">
                  {principle}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Decision chain: who acts at each step. */}
        <div className="rounded-panel border border-graphite/15 bg-white/70 p-6 sm:p-8">
          <h3 className="text-eyebrow text-graphite-muted">Ablauf einer Meldung</h3>
          <ol className="mt-7 space-y-3">
            {chain.map((step, index) => {
              const isHuman = step.actor === "Mensch";
              return (
                <li key={step.label} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border text-xs font-bold tabular-nums ${
                        isHuman
                          ? "border-graphite bg-graphite text-cloud"
                          : "border-graphite/25 bg-transparent text-graphite-muted"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {index < chain.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="mt-1 w-px flex-1 bg-graphite/20"
                      />
                    ) : null}
                  </div>
                  <div className="pb-5">
                    <p className="text-base font-semibold tracking-tight text-graphite">
                      {step.label}
                    </p>
                    <p className="mt-1 text-sm text-graphite-muted">
                      Verantwortung: {step.actor}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 border-t border-graphite/15 pt-6 text-sm leading-relaxed text-graphite-muted">
            Die letzten beiden Schritte liegen ausschließlich beim Security-Team.
            Atreides bereitet Informationen auf und dokumentiert die Prüfung.
          </p>
        </div>
      </div>
    </Section>
  );
}
