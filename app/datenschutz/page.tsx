import type { Metadata } from "next";

import {
  LegalLayout,
  LegalList,
  LegalSection,
  Value,
} from "@/components/layout/LegalLayout";
import { hosting, legalLastUpdated, owner, siteConfig } from "@/lib/site";

const description =
  "Informationen zur Verarbeitung personenbezogener Daten beim Besuch der Atreides-Website.";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description,
  alternates: { canonical: "/datenschutz" },
  // Without these, the page would inherit the landing page's Open Graph title.
  openGraph: {
    title: `Datenschutzerklärung — ${siteConfig.name}`,
    description,
    url: "/datenschutz",
  },
};

/**
 * This page describes the site exactly as it behaves today: a static site on
 * Vercel with no analytics, no cookies, self-hosted fonts and a contact form
 * whose submit path is not connected. It must be revised the moment a form
 * backend or any additional service is added.
 */
export default function DatenschutzPage() {
  return (
    <LegalLayout
      title="Datenschutzerklärung"
      intro="Diese Erklärung beschreibt, welche Daten beim Besuch dieser Website verarbeitet werden. Sie bildet den aktuellen technischen Stand der Website ab und ist bei Änderungen an Hosting oder Kontaktformular anzupassen."
    >
      <LegalSection heading="1. Verantwortliche Stelle">
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der
          Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
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
          E-Mail:{" "}
          <a
            href={`mailto:${owner.email}`}
            className="font-semibold text-cloud underline underline-offset-2 hover:text-signal"
          >
            {owner.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="2. Umfang der Verarbeitung auf dieser Website">
        <p>
          Diese Website ist eine statische Informationsseite. Es findet kein
          Tracking statt, es werden keine Analyse- oder Marketingdienste
          eingebunden und es werden keine Cookies zu Analyse- oder Werbezwecken
          gesetzt.
        </p>
        <LegalList
          items={[
            "Keine Webanalyse und keine Reichweitenmessung.",
            "Keine Werbe- oder Tracking-Cookies.",
            "Keine Einbindung externer Skripte, Karten oder Videodienste.",
            "Keine Social-Media-Plugins.",
          ]}
        />
        <p>
          Aus diesem Grund wird kein Cookie-Banner eingesetzt. Sollten künftig
          einwilligungspflichtige Dienste ergänzt werden, ist diese Erklärung
          entsprechend zu erweitern.
        </p>
      </LegalSection>

      {/*
        Deliberately limited to what has been verified: the provider, the fact
        that access data is processed on request, the legal basis, and that we
        keep no logs of our own. Retention periods, deployment region, the DPA
        and any transfer mechanism are NOT stated because none of them have been
        confirmed — see the note on `hosting` in lib/site.ts before extending.
      */}
      <LegalSection heading="3. Hosting und Zugriffsdaten">
        <p>
          Diese Website wird bei <Value>{hosting.provider}</Value> gehostet. Der
          Hosting-Anbieter stellt die Website technisch bereit und verarbeitet
          dabei die Daten, die Ihr Browser beim Aufruf automatisch übermittelt.
          Dazu gehören typischerweise:
        </p>
        <LegalList
          items={[
            "IP-Adresse des anfragenden Endgeräts",
            "Datum und Uhrzeit des Zugriffs",
            "aufgerufene Adresse und übertragene Datenmenge",
            "Browsertyp und Betriebssystem",
          ]}
        />
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse
          liegt in der technisch fehlerfreien und sicheren Bereitstellung der
          Website.
        </p>
        <p>
          Diese Zugriffsdaten werden von uns weder gespeichert noch ausgewertet.
          Wir betreiben keine eigene Protokollierung, keine Analyse und keine
          serverseitige Verarbeitung von Besucherdaten.
        </p>
      </LegalSection>

      <LegalSection heading="4. Schriftarten">
        <p>
          Die verwendeten Schriftarten werden zusammen mit der Website ausgeliefert
          und lokal geladen. Beim Aufruf der Seite wird deshalb keine Verbindung zu
          Servern von Google Fonts hergestellt.
        </p>
      </LegalSection>

      <LegalSection heading="5. Kontaktformular">
        <p>
          Das auf der Startseite dargestellte Kontaktformular ist derzeit technisch
          nicht angebunden. Eingaben werden ausschließlich im Browser verarbeitet,
          nicht an einen Server übermittelt und nicht gespeichert.
        </p>
        <p>
          Sobald ein Versandweg eingerichtet ist, wird diese Erklärung um Empfänger,
          Rechtsgrundlage, Speicherdauer und eingesetzte Dienstleister ergänzt.
        </p>
      </LegalSection>

      <LegalSection heading="6. Kontaktaufnahme per E-Mail">
        <p>
          Wenn Sie uns per E-Mail kontaktieren, werden die von Ihnen übermittelten
          Angaben zur Bearbeitung Ihrer Anfrage und für mögliche Anschlussfragen
          verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei
          vertragsbezogenen Anfragen, andernfalls Art. 6 Abs. 1 lit. f DSGVO
          aufgrund unseres berechtigten Interesses an der Beantwortung der Anfrage.
        </p>
        <p>
          Die Daten werden gelöscht, sobald sie für die Zweckerreichung nicht mehr
          erforderlich sind und keine gesetzlichen Aufbewahrungsfristen
          entgegenstehen.
        </p>
      </LegalSection>

      <LegalSection heading="7. Weitergabe von Daten">
        {/* No claim about a processing agreement: its existence is unverified. */}
        <p>
          Eine Weitergabe Ihrer Daten an Dritte erfolgt nicht. Ausgenommen ist der
          Hosting-Anbieter, der die Website technisch bereitstellt, sowie eine
          Weitergabe aufgrund gesetzlicher Verpflichtungen.
        </p>
      </LegalSection>

      <LegalSection heading="8. Ihre Rechte">
        <p>Sie haben im Rahmen der gesetzlichen Voraussetzungen das Recht:</p>
        <LegalList
          items={[
            "auf Auskunft über die zu Ihrer Person verarbeiteten Daten (Art. 15 DSGVO)",
            "auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
            "auf Löschung (Art. 17 DSGVO)",
            "auf Einschränkung der Verarbeitung (Art. 18 DSGVO)",
            "auf Datenübertragbarkeit (Art. 20 DSGVO)",
            "auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)",
          ]}
        />
        <p>
          Zur Ausübung dieser Rechte genügt eine Nachricht an{" "}
          <a
            href={`mailto:${owner.email}`}
            className="font-semibold text-cloud underline underline-offset-2 hover:text-signal"
          >
            {owner.email}
          </a>
          .
        </p>
        <p>
          Unabhängig davon steht Ihnen ein Beschwerderecht bei einer
          Datenschutz-Aufsichtsbehörde zu, insbesondere in dem Mitgliedstaat Ihres
          Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
          Verstoßes.
        </p>
      </LegalSection>

      <LegalSection heading="9. Hinweis zum Produkt">
        <p>
          Diese Datenschutzerklärung betrifft ausschließlich den Betrieb dieser
          Website. Sie trifft keine Aussage über die Datenverarbeitung innerhalb der
          Atreides-Plattform. Die datenschutzrechtliche Ausgestaltung des Produkts
          wird gemeinsam mit Pilotpartnern und Fachberatung definiert und
          gesondert dokumentiert.
        </p>
      </LegalSection>

      <LegalSection heading="10. Stand und Änderungen">
        <p>
          Diese Datenschutzerklärung wird angepasst, sobald sich die technische
          Umsetzung der Website ändert — insbesondere bei Aktivierung des
          Kontaktformulars oder bei Einbindung weiterer Dienste.
        </p>
        <p>
          Stand: <Value>{legalLastUpdated}</Value>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
