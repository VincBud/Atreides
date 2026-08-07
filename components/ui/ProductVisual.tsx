/**
 * Conceptual product visual.
 *
 * Built entirely from HTML/CSS/SVG so it stays crisp, responsive and editable.
 * It deliberately reads as a design concept — it carries a visible
 * "Konzeptdarstellung" marker and a caption clarifying that it is not a
 * screenshot of a deployed system.
 *
 * The graphic itself is hidden from assistive technology; the caption below it
 * carries the description.
 */

type Zone = {
  /** Grid position in the abstract floor plan. */
  x: number;
  y: number;
  /** Relative activity, 0 (ruhig) to 1 (peak). */
  heat: number;
};

const ZONE_W = 88;
const ZONE_H = 70;
const COLS = [16, 112, 208, 304];
const ROWS = [16, 94, 172];

const ZONES: Zone[] = [
  { x: 0, y: 0, heat: 0.06 },
  { x: 1, y: 0, heat: 0.14 },
  { x: 2, y: 0, heat: 0.24 },
  { x: 3, y: 0, heat: 0.34 },
  { x: 0, y: 1, heat: 0.1 },
  { x: 1, y: 1, heat: 0.22 },
  { x: 2, y: 1, heat: 0.46 },
  { x: 3, y: 1, heat: 0.88 },
  { x: 0, y: 2, heat: 0.05 },
  { x: 1, y: 2, heat: 0.12 },
  { x: 2, y: 2, heat: 0.3 },
  { x: 3, y: 2, heat: 0.42 },
];

/** The zone carrying the prioritised hint. */
const FOCUS = { x: 3, y: 1 };

/** Camera positions along the plan, in viewBox units. */
const CAMERAS = [
  { cx: 60, cy: 10 },
  { cx: 156, cy: 10 },
  { cx: 252, cy: 10 },
  { cx: 348, cy: 10 },
  { cx: 400, cy: 129 },
];

export function ProductVisual() {
  return (
    <figure className="relative">
      <div
        aria-hidden="true"
        className="relative rounded-panel border border-steel/55 bg-gradient-to-b from-panel-raised to-navy p-3 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-4"
      >
        {/* Top status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-steel/40 bg-navy/70 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-signal-pulse absolute inline-flex h-full w-full rounded-full bg-signal" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-cloud">
              Live-Lagebild
            </span>
          </div>
          <span className="rounded-full border border-steel/60 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.14em] text-subtle uppercase">
            Konzeptdarstellung
          </span>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.65fr_1fr]">
          {/* Venue map */}
          <div className="relative rounded-card border border-steel/40 bg-navy/60 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.625rem] font-semibold tracking-[0.14em] text-subtle uppercase">
                Kamerabereich
              </span>
              <span className="text-[0.625rem] font-medium text-subtle">
                12 Zonen
              </span>
            </div>

            <div className="relative mt-3">
              <svg
                viewBox="0 0 408 258"
                className="w-full"
                role="presentation"
                focusable="false"
              >
                {/* Floor-plan boundary */}
                <path
                  d="M8 8 H400 V250 H8 Z"
                  fill="none"
                  stroke="var(--color-steel)"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                />

                {ZONES.map((zone) => {
                  const isFocus = zone.x === FOCUS.x && zone.y === FOCUS.y;
                  return (
                    <g key={`${zone.x}-${zone.y}`}>
                      {/* Calm base surface, faded out as heat rises so the
                          amber layers over Deep Navy rather than over blue —
                          mixing the two directly turns mid-range cells olive. */}
                      <rect
                        x={COLS[zone.x]}
                        y={ROWS[zone.y]}
                        width={ZONE_W}
                        height={ZONE_H}
                        rx="6"
                        fill="var(--color-steel)"
                        fillOpacity={0.4 * (1 - zone.heat)}
                      />
                      {/* Amber layered by intensity, as in the logo mark. */}
                      <rect
                        x={COLS[zone.x]}
                        y={ROWS[zone.y]}
                        width={ZONE_W}
                        height={ZONE_H}
                        rx="6"
                        fill="var(--color-signal)"
                        fillOpacity={zone.heat}
                        className={isFocus ? "animate-heat" : undefined}
                      />
                      <rect
                        x={COLS[zone.x]}
                        y={ROWS[zone.y]}
                        width={ZONE_W}
                        height={ZONE_H}
                        rx="6"
                        fill="none"
                        stroke={
                          isFocus ? "var(--color-signal)" : "var(--color-steel)"
                        }
                        strokeOpacity={isFocus ? 1 : 0.5}
                        strokeWidth={isFocus ? 2 : 1}
                      />
                    </g>
                  );
                })}

                {/* Movement between the two most active zones */}
                <path
                  d="M252 129 C 276 116, 288 116, 300 129"
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {CAMERAS.map((camera) => (
                  <circle
                    key={`${camera.cx}-${camera.cy}`}
                    cx={camera.cx}
                    cy={camera.cy}
                    r="2.5"
                    fill="var(--color-cloud)"
                    fillOpacity="0.45"
                  />
                ))}
              </svg>

              {/* Zone callout, anchored above the prioritised zone */}
              <span className="absolute top-[24%] right-[1.5%] rounded-[6px] bg-signal px-2 py-0.5 text-[0.625rem] font-bold tracking-wide text-navy shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                Zone B-04
              </span>
            </div>

            {/* Heat legend */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[0.625rem] font-medium text-subtle">
                Aktivität
              </span>
              <span
                className="h-1.5 flex-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, color-mix(in srgb, var(--color-steel) 45%, transparent), var(--color-steel), var(--color-signal))",
                }}
              />
              <span className="text-[0.625rem] font-medium text-subtle">
                hoch
              </span>
            </div>
          </div>

          {/* Prioritised hint */}
          <div className="flex flex-col gap-3 rounded-card border border-signal/35 bg-panel/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.625rem] font-semibold tracking-[0.14em] text-subtle uppercase">
                Priorität
              </span>
              <span className="rounded-full bg-signal/15 px-2.5 py-1 text-[0.625rem] font-bold tracking-wide text-signal uppercase">
                Hoch
              </span>
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight text-cloud">
                Erhöhte Dynamik
              </p>
              <p className="mt-1 text-xs text-muted">
                Zone B-04 · Bewegungsmuster verdichtet
              </p>
            </div>

            <div className="rounded-[10px] border border-steel/40 bg-navy/60 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.625rem] font-semibold tracking-[0.14em] text-subtle uppercase">
                  Verlauf
                </span>
                <span className="text-[0.625rem] font-medium text-subtle">
                  8 Min.
                </span>
              </div>
              <svg
                viewBox="0 0 120 34"
                className="mt-2 w-full"
                role="presentation"
                focusable="false"
              >
                <polyline
                  points="0,28 15,26 30,27 45,22 60,23 75,16 90,12 105,7 120,4"
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="120" cy="4" r="2.5" fill="var(--color-signal)" />
              </svg>
            </div>

            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full border border-signal"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-cloud">
                  Status: Zur Prüfung
                </span>
              </div>
              <div className="pointer-events-none flex min-h-10 items-center justify-center rounded-btn bg-signal px-4 py-2 text-center text-[0.8125rem] font-semibold text-navy select-none">
                Von Security prüfen
              </div>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 text-xs leading-relaxed text-subtle">
        Konzeptdarstellung der geplanten Oberfläche: Zonenraster, Heatmap-Intensität
        und ein priorisierter Hinweis, der zur menschlichen Prüfung vorgelegt wird.
        Kein Screenshot eines produktiven Systems.
      </figcaption>
    </figure>
  );
}
