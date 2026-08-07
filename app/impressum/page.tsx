import type { Metadata } from "next";

import {
  LegalLayout,
  LegalList,
  LegalSection,
  Placeholder,
} from "@/components/layout/LegalLayout";
import { placeholders, siteConfig } from "@/lib/site";

const description =
  "Impressum und Anbieterkennzeichnung von Atreides. Die gesetzlich erforderlichen Angaben werden derzeit ergänzt.";

export const metadata: Metadata = {
  title: "Impressum",
  description,
  alternates: { canonical: "/impressum" },
  // Without these, the page would inherit the landing page's Open Graph title.
  openGraph: {
    title: `Impressum — ${siteConfig.name}`,
    description,
    url: "/impressum",
  },
};

export default function ImpressumPage() {
  return (
    <LegalLayout
      title="Impressum"
      intro="Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG)."
    >
      <LegalSection heading="Anbieter">
        <LegalList
          items={[
            <>
              Betreiber: <Placeholder>{placeholders.entity}</Placeholder>
            </>,
            <>
              Anschrift: <Placeholder>{placeholders.address}</Placeholder>
            </>,
            <>
              Vertretungsberechtigte Person:{" "}
              <Placeholder>{placeholders.representative}</Placeholder>
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="Kontakt">
        <LegalList
          items={[
            <>
              E-Mail: <Placeholder>{placeholders.email}</Placeholder>
            </>,
            <>
              Telefon: <Placeholder>{placeholders.phone}</Placeholder>
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="Registereintrag und Umsatzsteuer">
        <LegalList
          items={[
            <>
              Registereintrag: <Placeholder>{placeholders.registry}</Placeholder>
            </>,
            <>
              Umsatzsteuer-Identifikationsnummer:{" "}
              <Placeholder>{placeholders.vatId}</Placeholder>
            </>,
          ]}
        />
        <p>
          Sofern kein Registereintrag oder keine Umsatzsteuer-Identifikationsnummer
          besteht, sind die entsprechenden Zeilen vor der Veröffentlichung zu
          entfernen.
        </p>
      </LegalSection>

      <LegalSection heading="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>
          <Placeholder>{placeholders.representative}</Placeholder>,{" "}
          <Placeholder>{placeholders.address}</Placeholder>
        </p>
      </LegalSection>

      <LegalSection heading="Streitbeilegung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung bereit. Diese finden Sie unter{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            className="text-cloud underline underline-offset-2 hover:text-signal"
            rel="noopener noreferrer"
            target="_blank"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
        <p>
          Ob eine Bereitschaft oder Verpflichtung zur Teilnahme an einem
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          besteht, ist vom Betreiber zu ergänzen:{" "}
          <Placeholder>[ANGABE ZUR VERBRAUCHERSCHLICHTUNG ERGÄNZEN]</Placeholder>
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Inhalte und Links">
        <p>
          Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine
          Gewähr übernommen werden.
        </p>
        <p>
          Diese Website enthält Links zu externen Websites Dritter, auf deren
          Inhalte kein Einfluss besteht. Für die Inhalte der verlinkten Seiten ist
          stets der jeweilige Anbieter oder Betreiber verantwortlich.
        </p>
      </LegalSection>

      <LegalSection heading="Urheberrecht">
        <p>
          Die auf dieser Website veröffentlichten Inhalte, Texte und Grafiken
          unterliegen dem deutschen Urheberrecht. Eine Vervielfältigung oder
          Verwendung außerhalb der gesetzlich zulässigen Fälle bedarf der
          vorherigen schriftlichen Zustimmung des Betreibers.
        </p>
      </LegalSection>

      <LegalSection heading="Hinweis zum Produktstand">
        <p>
          Atreides befindet sich in Entwicklung. Die auf dieser Website
          beschriebenen Funktionen stellen den geplanten Funktionsumfang dar und
          begründen keine Zusicherung von Eigenschaften.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
