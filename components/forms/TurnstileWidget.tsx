"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile, rendered explicitly.
 *
 * Explicit rendering rather than the auto-scanning `cf-turnstile` class: React
 * owns this subtree, and letting Cloudflare hunt for elements it did not create
 * breaks as soon as the component re-renders.
 *
 * Appearance is `interaction-only`, so nothing is shown unless the visitor
 * actually has to do something — which keeps the contact section calm and is
 * the behaviour the brief asked for.
 */

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: Record<string, unknown>,
  ) => string | undefined;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __atreidesTurnstileReady?: boolean;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Loads the Cloudflare script once per document. */
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("load")), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("load")), {
      once: true,
    });
    document.head.appendChild(script);
  });
}

type TurnstileWidgetProps = {
  siteKey: string;
  /** Fires with a fresh token, or null when the token is gone. */
  onToken: (token: string | null) => void;
  /** Fires when the widget cannot run at all. */
  onUnavailable: () => void;
  /**
   * Incremented by the parent to request a new token after a submit attempt.
   * Turnstile tokens are single-use, so every attempt needs a reset.
   */
  resetSignal: number;
};

export function TurnstileWidget({
  siteKey,
  onToken,
  onUnavailable,
  resetSignal,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  // Callbacks live in refs so re-renders never force the widget to remount.
  // Written in an effect, not during render: a ref mutation during render is
  // not safe under concurrent rendering.
  const onTokenRef = useRef(onToken);
  const onUnavailableRef = useRef(onUnavailable);
  useEffect(() => {
    onTokenRef.current = onToken;
    onUnavailableRef.current = onUnavailable;
  });

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile) {
          if (!cancelled) onUnavailableRef.current();
          return;
        }
        widgetIdRef.current = window.turnstile.render(container, {
          sitekey: siteKey,
          theme: "dark",
          appearance: "interaction-only",
          language: "de",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "timeout-callback": () => onTokenRef.current(null),
          "error-callback": () => {
            onTokenRef.current(null);
            onUnavailableRef.current();
          },
        });
      })
      .catch(() => {
        if (!cancelled) onUnavailableRef.current();
      });

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      widgetIdRef.current = undefined;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // Already gone — nothing to clean up.
        }
      }
    };
  }, [siteKey]);

  // A consumed or rejected token can never be reused; ask for a new one.
  useEffect(() => {
    if (resetSignal === 0) return;
    const id = widgetIdRef.current;
    if (id && window.turnstile) {
      onTokenRef.current(null);
      try {
        window.turnstile.reset(id);
      } catch {
        onUnavailableRef.current();
      }
    }
  }, [resetSignal]);

  return <div ref={containerRef} className="empty:hidden" />;
}
