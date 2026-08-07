import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  className?: string;
};

/* Minimum touch target of 44 px is enforced through min-h on every variant. */
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-btn px-5 py-3 text-sm font-semibold transition-colors duration-200 sm:text-base";

const variants: Record<Variant, string> = {
  primary: "bg-signal text-navy hover:bg-signal/90",
  secondary:
    "border border-steel/70 bg-navy/40 text-cloud hover:border-steel hover:bg-steel/25",
  ghost: "text-cloud hover:text-signal",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
