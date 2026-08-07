import type { ReactNode } from "react";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Feature = {
  title: string;
  body: string;
  icon: ReactNode;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
  "aria-hidden": true,
};

const features: Feature[] = [
  {
    title: "Live-Übersicht",
    body: "Eine strukturierte Ansicht relevanter Kamerabereiche und aktueller Lagehinweise.",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Heatmaps",
    body: "Verdichtete Darstellung von Aktivität, Auslastung und Veränderungen innerhalb definierter Zonen.",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 15c1.6-3.2 3-4.6 4-4.6s2.4 1.4 4 4.6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: "Priorisierte Hinweise",
    body: "Auffällige Entwicklungen werden nicht nur angezeigt, sondern nach Dringlichkeit zur Prüfung geordnet.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 6h16" />
        <path d="M4 12h11" />
        <path d="M4 18h6" />
        <circle cx="19" cy="17" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Nachvollziehbarer Workflow",
    body: "Hinweise können geprüft, eingeordnet und abgeschlossen werden, ohne die menschliche Entscheidung zu ersetzen.",
    icon: (
      <svg {...iconProps}>
        <path d="M9 4.5h6a1.5 1.5 0 0 1 1.5 1.5v0A1.5 1.5 0 0 1 15 7.5H9A1.5 1.5 0 0 1 7.5 6v0A1.5 1.5 0 0 1 9 4.5Z" />
        <path d="M7.5 6H6a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 18 6h-1.5" />
        <path d="m9 13.5 2 2 4-4" />
      </svg>
    ),
  },
];

export function Solution() {
  return (
    <Section labelledBy="solution-headline">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <SectionHeading
          id="solution-headline"
          eyebrow="Die Lösung"
          headline="Aus Videodaten wird ein priorisiertes Lagebild."
          intro="Atreides bündelt relevante Signale in einer zentralen Oberfläche. Heatmaps, priorisierte Hinweise und Kontextinformationen helfen Security-Verantwortlichen dabei, ihre Aufmerksamkeit gezielt auf Bereiche zu richten, die eine menschliche Prüfung benötigen."
        />

        <ul className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="rounded-card border border-steel/40 bg-panel/60 p-6 transition-colors duration-200 hover:border-steel/70"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-steel/50 bg-navy/60 text-signal">
                {feature.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-cloud">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {feature.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
