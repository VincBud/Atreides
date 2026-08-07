"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { navItems, primaryCta } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  /* Escape closes the panel and returns focus to the trigger. */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* Keep focus inside the open panel so keyboard users cannot tab behind it. */
  useEffect(() => {
    if (!open) return;

    function onFocusIn(event: FocusEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) {
        return;
      }
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }

    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, [open]);

  /* Prevent the page behind the panel from scrolling. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-btn border border-steel/60 text-cloud transition-colors hover:border-steel hover:bg-steel/25"
      >
        <svg
          viewBox="0 0 20 20"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <path d="M5 5l10 10" />
              <path d="M15 5L5 15" />
            </>
          ) : (
            <>
              <path d="M3 6h14" />
              <path d="M3 10h14" />
              <path d="M3 14h14" />
            </>
          )}
        </svg>
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          className="fixed inset-x-0 top-[4.5rem] bottom-0 z-50 overflow-y-auto border-t border-steel/40 bg-navy-deep/98 px-5 pt-6 pb-10 backdrop-blur-md"
        >
          <nav aria-label="Hauptnavigation (mobil)">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex min-h-12 items-center rounded-btn px-3 text-lg font-medium text-cloud transition-colors hover:bg-steel/25 hover:text-signal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href={primaryCta.href}
            onClick={close}
            className="mt-6 flex min-h-12 items-center justify-center rounded-btn bg-signal px-5 text-base font-semibold text-navy transition-colors hover:bg-signal/90"
          >
            {primaryCta.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
