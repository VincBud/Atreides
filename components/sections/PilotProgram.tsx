import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ZoneGrid } from "@/components/ui/ZoneGrid";
import { primaryCta } from "@/lib/site";

const steps = [
  {
    title: "Infrastruktur verstehen",
    body: "Gemeinsame Bestandsaufnahme von Venue, Kamerazonen und operativen Abläufen.",
  },
  {
    title: "Szenarien definieren",
    body: "Auswahl weniger, klar abgegrenzter Situationen mit echtem Mehrwert für das Team.",
  },
  {
    title: "Begrenzten Piloten planen",
    body: "Start in einem definierten Bereich statt mit einem flächendeckenden Rollout.",
  },
  {
    title: "Gemeinsam auswerten",
    body: "Feedback aus dem realen Security-Ablauf fließt direkt in die weitere Produktentwicklung ein.",
  },
];

export function PilotProgram() {
  return (
    <Section
      id="pilotprogramm"
      tone="deep"
      labelledBy="pilot-headline"
      decoration={
        <ZoneGrid
          className="pointer-events-none absolute -top-16 -right-24 -z-10 w-[28rem] max-w-[70vw]"
          opacity={0.12}
        />
      }
    >
      <div className="max-w-3xl">
        <SectionHeading
          id="pilot-headline"
          eyebrow="Pilotprogramm"
          headline="Atreides gemeinsam in realen Venue-Abläufen entwickeln."
          intro="Wir suchen ausgewählte Veranstaltungsorte und Security-Teams, die relevante Szenarien, bestehende Kamerainfrastruktur und operative Anforderungen in einem klar abgegrenzten Pilotprojekt mit uns evaluieren möchten."
        />
      </div>

      <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="rounded-card border border-steel/40 bg-panel/60 p-6"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-[1px] bg-signal"
              />
              <span className="text-eyebrow text-subtle tabular-nums">
                Schritt {index + 1}
              </span>
            </div>
            <h3 className="mt-4 text-base font-semibold tracking-tight text-cloud">
              {step.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col gap-5 rounded-panel border border-steel/40 bg-panel/50 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="max-w-xl text-base leading-relaxed text-muted">
          Umfang, Zeitraum und Rahmenbedingungen eines Piloten legen wir individuell
          mit der Security-Leitung fest.
        </p>
        <ButtonLink href={primaryCta.href} className="shrink-0">
          {primaryCta.label}
        </ButtonLink>
      </div>
    </Section>
  );
}
