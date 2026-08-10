import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { LogoImage } from "@/components/ui/Logo";
import { owner, siteConfig } from "@/lib/site";

const legalLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Kontakt", href: "/#kontakt" },
];

export function Footer() {
  return (
    <footer className="border-t border-steel/30 bg-navy-deep">
      <Container>
        <div className="flex flex-col gap-12 py-16 lg:flex-row lg:justify-between lg:gap-16">
          <div className="max-w-sm">
            <LogoImage width={180} />
            <p className="mt-6 text-sm leading-relaxed text-muted">
              {siteConfig.footerDescription}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-eyebrow text-subtle">Kontakt</h2>
              <div className="mt-4 space-y-2 text-sm text-muted">
                <p>{owner.name}</p>
                <address className="not-italic">
                  {owner.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p>
                  <a
                    href={`mailto:${owner.email}`}
                    className="inline-flex min-h-9 items-center transition-colors hover:text-signal"
                  >
                    {owner.email}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-eyebrow text-subtle">Rechtliches</h2>
              <ul className="mt-4 space-y-1 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-9 items-center text-muted transition-colors hover:text-signal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-steel/25 py-8 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. Alle Rechte
            vorbehalten.
          </p>
          <p>
            Atreides ist ein Entscheidungsunterstützungssystem. Die finale
            Bewertung bleibt beim Security-Team.
          </p>
        </div>
      </Container>
    </footer>
  );
}
