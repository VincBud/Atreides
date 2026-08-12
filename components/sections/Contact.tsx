import { ContactForm } from "@/components/forms/ContactForm";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { owner } from "@/lib/site";

const expectations = [
  "Ein kurzes Gespräch über Ihre Venue, bestehende Kameras und relevante Bereiche.",
  "Eine ehrliche Einschätzung, ob ein Pilotprojekt zum aktuellen Entwicklungsstand passt.",
  "Keine Verpflichtung — ein erstes Gespräch dient der gegenseitigen Einschätzung.",
];

export function Contact() {
  return (
    <Section id="kontakt" labelledBy="contact-headline">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-headline"
            eyebrow="Kontakt"
            headline="Machen Sie aus vorhandenen Kameradaten eine bessere Entscheidungsgrundlage."
            intro="Sie betreiben eine Venue, planen Großveranstaltungen oder verantworten ein Security-Team? Lassen Sie uns über einen möglichen Pilotrahmen sprechen."
          />

          <ul className="mt-10 space-y-4">
            {expectations.map((item) => (
              <li key={item} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-signal"
                />
                <span className="text-sm leading-relaxed text-muted">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-card border border-steel/40 bg-panel/40 p-5">
            <h3 className="text-eyebrow text-subtle">Direkter Kontakt</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Sie erreichen uns auch ohne Formular direkt per E-Mail:
            </p>
            <a
              href={`mailto:${owner.email}`}
              className="mt-2 inline-flex min-h-9 items-center font-semibold text-cloud underline underline-offset-2 transition-colors hover:text-signal"
            >
              {owner.email}
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
