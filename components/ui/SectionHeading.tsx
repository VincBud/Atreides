import type { ReactNode } from "react";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  headline: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  headline,
  intro,
  tone = "dark",
  align = "start",
  className = "",
}: SectionHeadingProps) {
  const isLight = tone === "light";

  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      <p
        className={`text-eyebrow flex items-center gap-3 ${
          align === "center" ? "justify-center" : ""
        } ${isLight ? "text-graphite-muted" : "text-signal"}`}
      >
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-[2px] ${isLight ? "bg-signal" : "bg-signal"}`}
        />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-5 text-[1.875rem] leading-[1.12] font-semibold tracking-tight sm:text-[2.375rem] lg:text-[2.875rem] ${
          isLight ? "text-graphite" : "text-cloud"
        }`}
      >
        {headline}
      </h2>
      {intro ? (
        <div
          className={`mt-6 text-base leading-relaxed sm:text-lg ${
            isLight ? "text-graphite-muted" : "text-muted"
          }`}
        >
          {intro}
        </div>
      ) : null}
    </div>
  );
}
