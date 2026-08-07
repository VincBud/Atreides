import type { ReactNode } from "react";

import { Container } from "./Container";

type Tone = "navy" | "deep" | "light";

type SectionProps = {
  id?: string;
  children: ReactNode;
  /** Surface treatment. `light` is the Cloud White break used sparingly. */
  tone?: Tone;
  className?: string;
  /** Rendered outside the container, e.g. background motifs. */
  decoration?: ReactNode;
  labelledBy?: string;
};

const tones: Record<Tone, string> = {
  navy: "bg-navy text-cloud",
  deep: "bg-navy-deep text-cloud",
  light: "bg-cloud text-graphite",
};

export function Section({
  id,
  children,
  tone = "navy",
  className = "",
  decoration,
  labelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative isolate overflow-hidden py-20 sm:py-24 lg:py-32 ${tones[tone]} ${className}`}
    >
      {decoration}
      <Container className="relative">{children}</Container>
    </section>
  );
}
