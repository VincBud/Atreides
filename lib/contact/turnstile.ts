/**
 * Cloudflare Turnstile server-side verification.
 *
 * The browser widget alone proves nothing — the token has to be redeemed
 * against Cloudflare, server-side, before an email is ever sent. Tokens are
 * single-use and expire, so the form resets its widget after every attempt.
 */

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true }
  /** `retryable` means a fresh token is likely to succeed. */
  | { ok: false; retryable: boolean; codes: string[] };

/** Outcomes caused by a stale or already-redeemed token rather than by abuse. */
const RETRYABLE = new Set([
  "timeout-or-duplicate",
  "invalid-input-response",
  "missing-input-response",
  "internal-error",
]);

export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp?: string,
): Promise<TurnstileResult> {
  if (!token) {
    return { ok: false, retryable: true, codes: ["missing-input-response"] };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  let response: Response;
  try {
    response = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      // Cloudflare is fast; a hung verification must not hold the request open.
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return { ok: false, retryable: true, codes: ["network-error"] };
  }

  if (!response.ok) {
    return { ok: false, retryable: true, codes: ["siteverify-http-error"] };
  }

  const result = (await response.json().catch(() => null)) as
    | { success?: boolean; "error-codes"?: string[] }
    | null;

  if (!result) {
    return { ok: false, retryable: true, codes: ["siteverify-bad-json"] };
  }
  if (result.success === true) {
    return { ok: true };
  }

  const codes = Array.isArray(result["error-codes"]) ? result["error-codes"] : [];
  return {
    ok: false,
    retryable: codes.length === 0 || codes.some((code) => RETRYABLE.has(code)),
    codes,
  };
}
