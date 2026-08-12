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
  // Without these, the page would inherit the landing page's social titles.
  openGraph: {
    title: `Datenschutzerklärung — ${siteConfig.name}`,
    description,
    url: "/datenschutz",
  },
  twitter: {
    title: `Datenschutzerklärung — ${siteConfig.name}`,
    description,
  },
};

/**
 * This page describes the site exactly as it behaves today: hosted on Vercel,
 * no analytics, no cookies on our own domain, self-hosted fonts, and a contact
 * form that posts to /api/contact and is delivered by Resend to a Google
 * mailbox, with Cloudflare Turnstile guarding it.
 *
 * The Turnstile wording in section 5 reflects measured production behaviour
 * (Managed widget, pre-clearance disabled): no cookies and no storage under
 * atreides-security.com, but a temporary third-party session-storage entry in
 * the challenges.cloudflare.com context. Do not simplify that to "no storage"
 * or to "cookies are used" — neither is true. Re-measure before changing it.
 */
export default function DatenschutzPage() {
  return (
    <LegalLayout
      title="Datenschutzerklärung"
      intro="Diese Erklärung beschreibt, welche Daten beim Besuch dieser Website und bei der Nutzung des Kontaktformulars verarbeitet werden. Sie bildet den aktuellen technischen Stand der Website ab."
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
          Tracking statt und es werden keine Analyse- oder Marketingdienste
          eingebunden.
        </p>
        <LegalList
          items={[
            "Keine Webanalyse und keine Reichweitenmessung.",
            "Es werden keine Cookies auf atreides-security.com gesetzt.",
            "Keine Social-Media-Plugins, Karten- oder Videodienste.",
            "Kein Newsletter, kein Profiling, keine Weitergabe zu Werbezwecken.",
          ]}
        />
        <p>
          Eine Ausnahme bildet das Kontaktformular: Dort wird zum Schutz vor
          automatisiertem Missbrauch der Dienst Cloudflare Turnstile eingebunden.
          Welche Daten dabei verarbeitet werden und welche Speichervorgänge im
          Browser auftreten können, ist in Abschnitt 5 beschrieben.
        </p>
        <p>
          Analyse-, Marketing- und Tracking-Dienste werden nicht eingesetzt; ein
          Einwilligungsbanner für solche Dienste wird daher nicht angezeigt.
          Sollten künftig einwilligungspflichtige Dienste ergänzt werden, ist
          diese Erklärung entsprechend zu erweitern.
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
          Hosting-Anbieter stellt die Website und die Serverfunktion des
          Kontaktformulars technisch bereit und verarbeitet dabei die Daten, die
          Ihr Browser beim Aufruf automatisch übermittelt. Dazu gehören
          typischerweise:
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
          Wir betreiben keine eigene Protokollierung und keine Analyse von
          Besucherdaten. Eine serverseitige Verarbeitung findet ausschließlich
          beim Absenden des Kontaktformulars statt (siehe Abschnitt 5).
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
          Über das Kontaktformular auf der Startseite können Sie uns eine Anfrage
          senden. Dabei werden die folgenden Angaben verarbeitet:
        </p>
        <LegalList
          items={[
            "Name",
            "Unternehmen",
            "Geschäftliche E-Mail-Adresse",
            "Art der Venue",
            "Anzahl der Kameras (freiwillige Angabe)",
            "Ihre Nachricht",
            "Bestätigung, dass Sie diese Datenschutzerklärung zur Kenntnis genommen haben",
          ]}
        />
        <p>
          Die Angaben werden verwendet, um Ihre Anfrage zu bearbeiten und zu
          beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die
          Anfrage auf eine mögliche Zusammenarbeit gerichtet ist, andernfalls
          Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres berechtigten Interesses an
          der Beantwortung von Anfragen. Die Angabe der Daten ist freiwillig; ohne
          sie können wir die Anfrage jedoch nicht bearbeiten.
        </p>
        <p>
          <b className="font-semibold text-cloud">Ablauf der Übermittlung:</b> Ihre
          Eingaben werden an eine Serverfunktion dieser Website übertragen, dort
          geprüft und anschließend über den E-Mail-Dienst Resend als E-Mail an unser
          Postfach gesendet. Das empfangende Postfach ist ein Google-Mail-Konto; die
          Anfrage wird dort gespeichert. Es findet keine Speicherung in einer
          Datenbank statt, und es wird kein Profil zu Ihrer Person angelegt.
        </p>
        <p>
          <b className="font-semibold text-cloud">Missbrauchsschutz:</b> Zum Schutz
          vor automatisierten Einsendungen setzen wir Cloudflare Turnstile ein. Der
          Dienst dient ausschließlich der technischen Abwehr von Bots und
          Missbrauch des Kontaktformulars. Er wird nicht zur Analyse Ihres
          Verhaltens, nicht zur Wiedererkennung über Websites hinweg und nicht zu
          Werbezwecken eingesetzt.
        </p>
        <p>
          Beim Aufruf des Formulars wird dazu ein Skript von Cloudflare geladen.
          Für die Prüfung verarbeitet Cloudflare technische Informationen zu Ihrem
          Browser und Endgerät sowie Angaben zur Interaktion mit dem Formular;
          dazu gehört auch Ihre IP-Adresse.
        </p>
        <p>
          Im Rahmen dieser Prüfung kann Cloudflare vorübergehend Daten im Browser
          ablegen — etwa im Sitzungsspeicher. Diese Speicherung erfolgt technisch
          im Kontext von Cloudflare (challenges.cloudflare.com), nicht unter
          atreides-security.com, und ist auf die laufende Browsersitzung begrenzt.
          In der derzeitigen Konfiguration werden dabei keine Cookies gesetzt.
        </p>
        <p>
          Ohne diese Prüfung kann das Formular nicht abgesendet werden.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse
          liegt in der Abwehr von Spam und automatisiertem Missbrauch. Alternativ
          können Sie uns jederzeit formlos per E-Mail schreiben.
        </p>
        <p>
          Wir löschen Ihre Anfrage, sobald sie für die Zweckerreichung nicht mehr
          erforderlich ist und keine gesetzlichen Aufbewahrungsfristen
          entgegenstehen.
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

      {/*
        Names the providers and their roles — all verifiable from the code. It
        deliberately makes no claim about processing agreements, certifications
        or Art. 44 transfer mechanisms, none of which have been confirmed.
        See the note on `hosting` in lib/site.ts.
      */}
      <LegalSection heading="7. Empfänger und eingesetzte Dienste">
        <p>
          Eine Weitergabe Ihrer Daten zu Werbezwecken oder an unbeteiligte Dritte
          findet nicht statt. An der technischen Bereitstellung dieser Website und
          an der Bearbeitung von Anfragen sind folgende Dienste beteiligt:
        </p>
        <LegalList
          items={[
            <>
              <b className="font-semibold text-cloud">Vercel</b> — Hosting der
              Website und Ausführung der Serverfunktion des Kontaktformulars.
            </>,
            <>
              <b className="font-semibold text-cloud">Resend</b> — Versand der
              Anfrage-E-Mail an unser Postfach.
            </>,
            <>
              <b className="font-semibold text-cloud">Cloudflare</b> — Turnstile
              zum Schutz des Formulars vor automatisiertem Missbrauch.
            </>,
            <>
              <b className="font-semibold text-cloud">Google</b> — Betreiber des
              E-Mail-Postfachs, in dem eingehende Anfragen empfangen und
              gespeichert werden.
            </>,
          ]}
        />
        <p>
          Für die Verarbeitung durch diese Anbieter gelten jeweils deren eigene
          Datenschutzbestimmungen. Darüber hinaus erfolgt eine Weitergabe nur,
          soweit wir gesetzlich dazu verpflichtet sind.
        </p>
        <p>
          Die genannten Anbieter sind US-Unternehmen oder mit US-Unternehmen
          verbunden. Eine Verarbeitung personenbezogener Daten in den USA ist
          daher möglich.
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
