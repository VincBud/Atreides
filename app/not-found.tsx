import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ZoneGrid } from "@/components/ui/ZoneGrid";
import { primaryCta } from "@/lib/site";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  // A 404 has no canonical content; keep it out of the index.
  robots: { index: false, follow: true },
};

/**
 * Branded 404.
 *
 * Deliberately static: it reuses the zone-grid motif and the site's type scale,
 * but never mounts the cinematic sequence. Someone who landed here by mistake
 * should get a fast, clear page and a way onward — not a 700vh camera flight.
 */
export default function NotFound() {
  return (
    <main
      id="inhalt"
      className="relative isolate flex flex-1 items-center overflow-hidden py-24 sm:py-32"
    >
      <ZoneGrid
        className="pointer-events-none absolute -top-20 -right-16 -z-10 w-[26rem] max-w-[65vw]"
        opacity={0.1}
      />

      <Container>
        <div className="max-w-2xl">
          <p className="text-eyebrow flex items-center gap-3 text-signal">
            <span aria-hidden="true" className="h-2 w-2 rounded-[2px] bg-signal" />
            Fehler 404
          </p>

          <h1 className="mt-6 text-[2.25rem] leading-[1.1] font-semibold tracking-tight text-cloud sm:text-[3rem]">
            Diese Seite gibt es nicht.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Die aufgerufene Adresse führt ins Leere — möglicherweise wurde sie
            geändert oder falsch übernommen. Von der Startseite aus finden Sie
            alle Inhalte zu Atreides.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/">Zur Startseite</ButtonLink>
            <ButtonLink href={primaryCta.href} variant="secondary">
              {primaryCta.label}
            </ButtonLink>
          </div>

          <p className="mt-10 text-sm text-subtle">
            Rechtliches:{" "}
            <a
              href="/impressum"
              className="underline underline-offset-2 hover:text-signal"
            >
              Impressum
            </a>{" "}
            ·{" "}
            <a
              href="/datenschutz"
              className="underline underline-offset-2 hover:text-signal"
            >
              Datenschutz
            </a>
          </p>
        </div>
      </Container>
    </main>
  );
}
