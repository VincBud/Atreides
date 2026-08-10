import { ButtonLink } from "@/components/ui/ButtonLink";
import { ZoneGrid } from "@/components/ui/ZoneGrid";
import { primaryCta, secondaryCta } from "@/lib/site";

import { CinematicFilm } from "./CinematicFilm";
import { NARRATIVE } from "./narrative";
import { SceneStill } from "./SceneStill";
import { StepIndicator, StoryNeedle } from "./StoryNeedle";

/**
 * Decides the presentation mode before first paint.
 *
 * Inlined deliberately: doing this in an effect would render the stacked
 * layout first and then jump to the sticky one. This is the same pattern used
 * for theme flash prevention, and it is the only justified use of
 * dangerouslySetInnerHTML in the project.
 */
const MODE_SCRIPT = `try{
var m=window.matchMedia,c=document.createElement('canvas');
var ok=m('(prefers-reduced-motion: no-preference)').matches
 && !!(c.getContext&&c.getContext('2d'))
 && !(navigator.connection&&navigator.connection.saveData);
if(ok)document.documentElement.classList.add('cine');
}catch(e){}`;

export function CinematicSequence() {
  return (
    <section
      id="produkt"
      aria-labelledby="cine-headline"
      data-cine-root
      className="relative isolate"
    >
      <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />

      <div data-cine-track>
        <div data-cine-stage data-cine-scene="0">
          <CinematicFilm />

          <div data-cine-overlay>
            <ol data-cine-states>
              {NARRATIVE.map((state, index) => (
                <li key={state.id} data-cine-state={index} id={`szene-${state.id}`}>
                  <figure data-cine-still>
                    {/* Always present, so a failed or absent canvas still
                        leaves a composed, on-brand surface. */}
                    <ZoneGrid
                      className="absolute inset-0 m-auto w-1/2 max-w-[14rem]"
                      opacity={0.16}
                    />
                    <SceneStill p={state.still} />
                  </figure>

                  <div data-cine-copy>
                    <StoryNeedle
                      step={state.step}
                      label={state.needle}
                      attaches={state.attaches}
                    />

                    {state.eyebrow ? (
                      <p className="text-eyebrow text-signal">{state.eyebrow}</p>
                    ) : null}

                    {index === 0 ? (
                      <h1
                        id="cine-headline"
                        className="text-[2.375rem] leading-[1.05] font-semibold tracking-tight text-cloud sm:text-[3rem] lg:text-[3.75rem]"
                      >
                        {state.heading}
                      </h1>
                    ) : (
                      <h2 className="text-[1.75rem] leading-[1.12] font-semibold tracking-tight text-cloud sm:text-[2.125rem] lg:text-[2.625rem]">
                        {state.heading}
                      </h2>
                    )}

                    <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                      {state.body}
                    </p>

                    {index === 0 ? (
                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                        <ButtonLink href={primaryCta.href}>
                          {primaryCta.label}
                        </ButtonLink>
                        <ButtonLink href={secondaryCta.href} variant="secondary">
                          {secondaryCta.label}
                        </ButtonLink>
                      </div>
                    ) : null}

                    {state.transient ? (
                      <p className="font-mono text-[0.625rem] tracking-[0.18em] text-signal uppercase">
                        {state.transient}
                      </p>
                    ) : null}

                    {state.chain ? (
                      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 pt-1">
                        {state.chain.map((link, linkIndex) => (
                          <li key={link.label} className="flex items-center gap-2">
                            {linkIndex > 0 ? (
                              <span
                                aria-hidden="true"
                                className="h-px w-4 bg-steel"
                              />
                            ) : null}
                            <span
                              className={`font-mono text-[0.625rem] tracking-[0.14em] uppercase ${
                                link.human
                                  ? "bg-signal px-2 py-1 font-semibold text-navy"
                                  : "border border-steel/70 px-2 py-1 text-subtle"
                              }`}
                            >
                              {link.label}
                            </span>
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <StepIndicator total={NARRATIVE.length} />

            <p data-cine-disclaimer>
              Konzeptdarstellung der geplanten Oberfläche. Kein Screenshot eines
              produktiven Systems.
            </p>
          </div>
        </div>
      </div>

      <a href="#lagebild" data-cine-skip>
        Story überspringen
      </a>
    </section>
  );
}
