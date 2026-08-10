/**
 * Story needle label.
 *
 * A map annotation, not a badge: no surface, no border, no shadow — a dot, a
 * step number, a short label and a hairline. In the cinematic layer the
 * hairline continues into the canvas and lands on the prioritised zone.
 */

type StoryNeedleProps = {
  step: string | null;
  label: string;
  /** Renders the hairline that the canvas leader line continues from. */
  attaches?: boolean;
};

export function StoryNeedle({ step, label, attaches = false }: StoryNeedleProps) {
  return (
    <p className="flex flex-col gap-1.5" data-cine-needle data-attaches={attaches}>
      <span className="flex items-center gap-2.5">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
        {step ? (
          <span className="font-mono text-sm font-semibold text-signal tabular-nums">
            {step}
          </span>
        ) : null}
      </span>
      <span className="font-mono text-[0.6875rem] font-medium tracking-[0.2em] text-cloud uppercase">
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`block h-px w-20 ${attaches ? "bg-signal/70" : "bg-cloud/40"}`}
      />
    </p>
  );
}

/**
 * Compact persistent indicator for narrow screens, where a leader line into
 * the scene would have nowhere to go.
 *
 * Hidden from assistive technology: the per-state needle labels already carry
 * this information as real text.
 */
export function StepIndicator({ total }: { total: number }) {
  return (
    <div
      aria-hidden="true"
      data-cine-steps
      className="pointer-events-none flex items-center gap-2.5"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
      <span
        className="font-mono text-[0.625rem] font-semibold text-signal tabular-nums"
        data-cine-step-number
      >
        01
      </span>
      <span className="flex items-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            data-cine-step-tick={i}
            className="h-px w-4 bg-cloud/25 transition-colors duration-300"
          />
        ))}
      </span>
    </div>
  );
}
