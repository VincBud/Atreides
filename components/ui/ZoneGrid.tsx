/**
 * Decorative 5x5 zone grid derived from the logo's mark: mostly inert cells
 * with a concentrated amber cluster. Used as a restrained background motif.
 *
 * Purely decorative — always hidden from assistive technology.
 */

/** Heat intensity per cell, 0 (inert) to 1 (peak). Mirrors the logo mark. */
const INTENSITY: readonly (readonly number[])[] = [
  [0, 0, 0.55, 0.14, 0],
  [0, 0.55, 1, 0.55, 0],
  [0, 0.85, 0.95, 0.6, 0],
  [0, 0.12, 0.55, 0.06, 0],
  [0, 0, 0, 0, 0],
];

type ZoneGridProps = {
  className?: string;
  /** Overall opacity of the motif. */
  opacity?: number;
};

export function ZoneGrid({ className = "", opacity = 1 }: ZoneGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`grid grid-cols-5 gap-[6%] ${className}`}
      style={{ opacity }}
    >
      {INTENSITY.flatMap((row, y) =>
        row.map((intensity, x) => (
          <span
            key={`${y}-${x}`}
            className="aspect-square rounded-[22%]"
            style={{
              backgroundColor:
                intensity === 0
                  ? "color-mix(in srgb, var(--color-steel) 55%, transparent)"
                  : `color-mix(in srgb, var(--color-signal) ${Math.round(
                      intensity * 100,
                    )}%, var(--color-steel))`,
            }}
          />
        )),
      )}
    </div>
  );
}
