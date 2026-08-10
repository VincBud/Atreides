import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

type LegalLayoutProps = {
  title: string;
  intro: string;
  children: ReactNode;
};

export function LegalLayout({ title, intro, children }: LegalLayoutProps) {
  return (
    <main id="inhalt" className="flex-1 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="max-w-3xl">
          <Link
            href="/"
            className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-signal"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9.5 3.5 5 8l4.5 4.5" />
            </svg>
            Zurück zur Startseite
          </Link>

          <h1 className="mt-8 text-[2.25rem] leading-tight font-semibold tracking-tight text-cloud sm:text-[3rem]">
            {title}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted">{intro}</p>

          {/*
            The "Hinweis zum Bearbeitungsstand" banner that used to sit here was
            an internal working note aimed at the owner, not the visitor. It was
            removed for launch along with the last bracketed placeholder.
          */}

          <div className="mt-14 space-y-12">{children}</div>
        </div>
      </Container>
    </main>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-cloud sm:text-2xl">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-2.5 h-1 w-1 shrink-0 rounded-[1px] bg-signal"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A supplied, final value inside body copy. */
export function Value({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-cloud">{children}</strong>;
}
