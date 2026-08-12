import type { Metadata } from "next";

import {
  LegalLayout,
  LegalList,
  LegalSection,
  Value,
} from "@/components/layout/LegalLayout";
import { owner, ownerAddressInline, siteConfig } from "@/lib/site";

const description =
  "Impressum und Anbieterkennzeichnung von Atreides gemäß § 5 Digitale-Dienste-Gesetz.";

export const metadata: Metadata = {
  title: "Impressum",
  description,
  alternates: { canonical: "/impressum" },
  // Without these, the page would inherit the landing page's social titles.
  openGraph: {
    title: `Impressum — ${siteConfig.name}`,
    description,
    url: "/impressum",
  },
  twitter: {
    title: `Impressum — ${siteConfig.name}`,
    description,
  },
};

/**
 * The operator is a natural person. § 5 DDG requires legal form, registry data
 * and an authorised representative only for legal entities, so those rows are
 * absent by design — not pending.
 */
export default function ImpressumPage() {
  return (
    <LegalLayout
      title="Impressum"
      intro="Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG)."
    >
      <LegalSection heading="Anbieter">
        <p>
          <Value>{owner.name}</Value>
        </p>
        <address className="not-italic">
          {owner.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <p>
          Diese Website wird von {owner.name} als natürliche Person betrieben. Es
          besteht derzeit keine Gesellschaft als Betreiberin der Website.
        </p>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <LegalList
          items={[
            <>
              E-Mail:{" "}
              <a
                href={`mailto:${owner.email}`}
                className="font-semibold text-cloud underline underline-offset-2 hover:text-signal"
              >
                {owner.email}
              </a>
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>
          <Value>{owner.name}</Value>, {ownerAddressInline}
        </p>
      </LegalSection>

      {/*
        A "Streitbeilegung" section was removed before launch rather than
        shipped with an unfilled placeholder. Two reasons, both to be confirmed
        by the owner:
          - The § 36 VSBG declaration is addressed at consumer business. This is
            a B2B site with no consumer contracts and no online sales, and the
            operator is a sole natural person.
          - The EU ODR platform the previous text linked to was discontinued, so
            keeping the link would point visitors at a dead service.
        If a consumer-facing offering is ever added, this section must come back
        with the operator's own declaration — it cannot be written for them.
      */}

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
