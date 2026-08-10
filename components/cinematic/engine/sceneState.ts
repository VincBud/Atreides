/**
 * Derives every animated quantity from a single scroll value.
 *
 * Keeping this pure and separate means the renderer has no notion of scrolling,
 * and a still frame is simply `render(state(p))` for any p.
 */

import { stateIndexAt } from "../narrative";
import type { SceneState } from "./types";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Eased 0→1 ramp between two scroll positions. */
function ramp(p: number, from: number, to: number) {
  return smooth(clamp01((p - from) / (to - from)));
}

/** Eased pulse that rises, holds, then falls. */
function pulse(p: number, inA: number, inB: number, outA: number, outB: number) {
  return ramp(p, inA, inB) * (1 - ramp(p, outA, outB));
}

export function sceneStateAt(p: number): SceneState {
  return {
    p,
    stateIndex: stateIndexAt(p),

    // Abstraction starts only after the situation has been *seen* physically,
    // and completes before the interface arrives. The offset between the
    // camera rise and this ramp is what makes the change feel inevitable
    // rather than like a cut.
    abstraction: ramp(p, 0.34, 0.6),

    // Framing leads the chrome slightly, so the plan is already sitting in its
    // panel by the time the interface grows around it.
    frame: ramp(p, 0.52, 0.66),
    chrome: ramp(p, 0.58, 0.7),
    // Reaches full well before the state ends, so the populated alert is what
    // the visitor dwells on rather than a half-faded one.
    alert: ramp(p, 0.67, 0.75),
    // The terminal steps back once the decision layer takes over, so the
    // human step is the thing in focus rather than the interface.
    recede: ramp(p, 0.82, 0.88),
    settle: ramp(p, 0.93, 1),
    focus: ramp(p, 0.2, 0.42),

    // The ceiling and furniture drop away as the camera climbs out of the
    // room; keeping them would occlude the plan they are turning into.
    interior: 1 - ramp(p, 0.36, 0.47),

    transient: pulse(p, 0.26, 0.3, 0.38, 0.41),

    // The numbered needle only reaches into the scene once the zone is
    // formally prioritised. Before that the transient marker does the
    // pointing — two amber leaders at once read as noise, not annotation.
    attach: pulse(p, 0.41, 0.47, 0.84, 0.9),
  };
}
