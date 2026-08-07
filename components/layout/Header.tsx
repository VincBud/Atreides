import Link from "next/link";

import { MobileNav } from "@/components/layout/MobileNav";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { LogoLink } from "@/components/ui/Logo";
import { navItems, primaryCta } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-steel/30 bg-navy/85 backdrop-blur-md">
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <LogoLink width={170} priority className="shrink-0" />

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-btn px-3 text-sm font-medium text-muted transition-colors hover:text-cloud"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/*
              Visibility is toggled on a wrapper rather than on ButtonLink:
              `hidden` and the button's own `inline-flex` both set `display`,
              and Tailwind's layer order — not class order — decides the winner.
            */}
            <div className="hidden sm:block">
              <ButtonLink href={primaryCta.href} className="text-sm">
                {primaryCta.label}
              </ButtonLink>
            </div>
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
