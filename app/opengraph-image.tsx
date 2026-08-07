import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

/** Heat intensity of the logo mark's 5x5 grid, reproduced for the share card. */
const MARK: readonly (readonly number[])[] = [
  [0, 0, 0.55, 0, 0],
  [0, 0.55, 1, 0.55, 0],
  [0, 0.85, 0.95, 0.6, 0],
  [0, 0, 0.55, 0, 0],
  [0, 0, 0, 0, 0],
];

const NAVY = "#0B1426";
const STEEL = "#28445F";
const SIGNAL = "#F2A900";
const CLOUD = "#F4F7F9";
const MUTED = "#93A7BC";

/** Blend Signal Amber over Deep Navy at the given intensity. */
function cell(intensity: number) {
  if (intensity === 0) return STEEL;
  const channel = (signal: number, navy: number) =>
    Math.round(signal * intensity + navy * (1 - intensity));
  return `rgb(${channel(242, 11)}, ${channel(169, 20)}, ${channel(0, 38)})`;
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: NAVY,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {MARK.map((row, y) => (
              <div key={y} style={{ display: "flex", gap: 5 }}>
                {row.map((intensity, x) => (
                  <div
                    key={x}
                    style={{
                      width: 17,
                      height: 17,
                      borderRadius: 4,
                      backgroundColor: cell(intensity),
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: 14,
                color: CLOUD,
              }}
            >
              ATREIDES
            </div>
            <div
              style={{
                fontSize: 17,
                letterSpacing: 7,
                color: MUTED,
                marginTop: 6,
              }}
            >
              VENUE INTELLIGENCE
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 84, height: 5, backgroundColor: SIGNAL }} />
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              color: CLOUD,
              lineHeight: 1.12,
              marginTop: 34,
              maxWidth: 940,
            }}
          >
            Risiken erkennen, bevor Situationen eskalieren.
          </div>
          <div
            style={{
              fontSize: 27,
              color: MUTED,
              lineHeight: 1.45,
              marginTop: 26,
              maxWidth: 900,
            }}
          >
            AI Venue Intelligence für menschlich geführte Security-Teams.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
