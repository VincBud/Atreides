import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { primaryCta, secondaryCta } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="produkt"
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden pt-16 pb-20 sm:pt-20 lg:pt-24 lg:pb-28"
    >
      {/* Background: structural grid, faded out toward the edges. */}
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.5] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-14rem] left-1/2 -z-10 h-[36rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(40,68,95,0.55),transparent)]"
      />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="max-w-2xl">
            <p className="text-eyebrow flex items-center gap-3 text-signal">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-[2px] bg-signal"
              />
              AI Venue Intelligence
            </p>

            <h1
              id="hero-headline"
              className="mt-6 text-[2.625rem] leading-[1.05] font-semibold tracking-tight text-cloud sm:text-[3.25rem] lg:text-[4.25rem]"
            >
              Risiken erkennen, bevor Situationen eskalieren.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Atreides analysiert Live-Daten bestehender Sicherheitskameras und
              unterstützt Security-Teams mit priorisierten Warnmeldungen, Heatmaps
              und relevanten Kontextinformationen.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
              <ButtonLink href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </ButtonLink>
            </div>

            <p className="mt-8 max-w-lg text-sm leading-relaxed text-subtle">
              Die Plattform befindet sich in Entwicklung. Wir sprechen derzeit mit
              ausgewählten Veranstaltungsorten über gemeinsame Pilotprojekte.
            </p>
          </div>

          <div className="lg:pl-4">
            <ProductVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}
