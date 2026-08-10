/**
 * Canvas cannot read CSS custom properties, so the brand palette is mirrored
 * here. These values must stay in sync with the `@theme` block in
 * app/globals.css — they are the same five CI colours.
 */

export const NAVY = "#0B1426";
export const NAVY_DEEP = "#060B16";
export const STEEL = "#28445F";
export const SIGNAL = "#F2A900";
export const CLOUD = "#F4F7F9";

export const PANEL = "#101B2E";
export const MUTED = "#93A7BC";
export const SUBTLE = "#7B92AA";

export const rgba = {
  navyDeep: (a: number) => `rgba(6,11,22,${a})`,
  steel: (a: number) => `rgba(40,68,95,${a})`,
  signal: (a: number) => `rgba(242,169,0,${a})`,
  cloud: (a: number) => `rgba(244,247,249,${a})`,
  muted: (a: number) => `rgba(147,167,188,${a})`,
  panel: (a: number) => `rgba(16,27,46,${a})`,
  black: (a: number) => `rgba(0,0,0,${a})`,
};

/** Font stacks used for the small amount of type drawn into the canvas. */
export const FONT_MONO =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';
export const FONT_UI =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
