import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "Atreides";

/**
 * Apple Touch Icon, 180×180.
 *
 * Generated rather than hand-drawn so it stays byte-for-byte consistent with
 * app/icon.svg: the same 5×5 grid, the same amber intensities, the same
 * proportions scaled 64 → 180 (×2.8125). The brand geometry is reproduced, not
 * reinterpreted.
 *
 * iOS ignores transparency and squares the corners itself, so the navy plate is
 * drawn edge to edge and the mark keeps the SVG's padding.
 */

/** Amber opacity per cell; everything else is Steel Blue. Mirrors icon.svg. */
const CELLS: Record<string, number> = {
  "0-2": 0.55,
  "1-1": 0.55,
  "1-2": 1,
  "1-3": 0.55,
  "2-1": 0.85,
  "2-2": 0.95,
  "2-3": 0.6,
  "3-2": 0.55,
};

const NAVY = "#0B1426";
const STEEL = "#28445F";

/** Signal Amber over Deep Navy at the given opacity, flattened. */
function amber(opacity: number) {
  const mix = (signal: number, navy: number) =>
    Math.round(signal * opacity + navy * (1 - opacity));
  return `rgb(${mix(242, 11)}, ${mix(169, 20)}, ${mix(0, 38)})`;
}

// icon.svg at 64px: 9px cells on an 11.5px pitch, 4.5px margin, 2.4px radius.
const SCALE = 180 / 64;
const CELL = 9 * SCALE;
const GAP = 2.5 * SCALE;
const PAD = 4.5 * SCALE;
const RADIUS = 2.4 * SCALE;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: NAVY,
          padding: PAD,
          gap: GAP,
        }}
      >
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} style={{ display: "flex", gap: GAP }}>
            {[0, 1, 2, 3, 4].map((col) => {
              const intensity = CELLS[`${row}-${col}`];
              return (
                <div
                  key={col}
                  style={{
                    width: CELL,
                    height: CELL,
                    borderRadius: RADIUS,
                    backgroundColor: intensity ? amber(intensity) : STEEL,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    ),
    size,
  );
}
