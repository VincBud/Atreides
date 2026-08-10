/**
 * Composition only.
 *
 * render() is pure with respect to scroll: given a progress value it paints
 * exactly one frame. That is what lets the same engine produce the cinematic
 * flight, every still frame in the reduced-motion sequence, and any debug
 * reference state, with no separate code path.
 */

import { cameraAt } from "./camera";
import { DEFAULT_DENSITY, type CrowdDensity, type Figure } from "./crowd";
import { collectFixtures } from "./drawFixtures";
import {
  collectCrowd,
  drawArchitecture,
  drawAreas,
  drawBackground,
  drawBeams,
  drawCeiling,
  drawFloor,
  drawFocusBloom,
  drawGrid,
  drawHaze,
  drawLightPools,
  drawPracticals,
  drawSourceGlows,
  drawVignette,
} from "./drawScene";
import {
  drawAlertPanel,
  drawNeedleLeader,
  drawTerminalChrome,
  drawTransientMarker,
} from "./drawTerminal";
import { createProjector } from "./projector";
import { sceneStateAt } from "./sceneState";
import type { Quality, RenderOptions } from "./types";

export const DESKTOP_QUALITY: Quality = {
  crowd: 1,
  haze: true,
  grid: true,
  maxDpr: 2,
};

export const MOBILE_QUALITY: Quality = {
  crowd: 0.55,
  haze: false,
  grid: true,
  maxDpr: 1.5,
};

/**
 * `compact` means a tall, narrow stage — a phone — not merely a small canvas.
 * Keying it off width alone would give a wide-but-short still frame the
 * stacked phone layout, which does not fit a landscape frame.
 */
export function optionsFor(
  width: number,
  height: number,
  /**
   * A still frame shown beside its copy rather than under it. There is no
   * overlay text inside the frame, so the interface can use the whole height.
   */
  standalone = false,
): RenderOptions {
  const compact = width < 720 && height / width > 0.9;

  if (standalone) {
    return {
      quality: compact ? MOBILE_QUALITY : DESKTOP_QUALITY,
      terminalRegion: { y0: 0.05, y1: 0.95 },
      viewOffsetY: 0,
      mapPanel: compact
        ? { x0: 0.07, y0: 0.12, x1: 0.93, y1: 0.5 }
        : { x0: 0.17, y0: 0.14, x1: 0.63, y1: 0.92 },
      needleAnchor: { x: 0.06, y: 0.9 },
    };
  }

  return {
    quality: compact ? MOBILE_QUALITY : DESKTOP_QUALITY,
    // The terminal occupies the upper band and the plan sits inside it; the
    // narrative copy keeps the lower band to itself. y0 clears the sticky site
    // header, which would otherwise cover the status bar.
    terminalRegion: compact ? { y0: 0.11, y1: 0.63 } : { y0: 0.1, y1: 0.66 },
    // Lift the horizon on phones so the venue sits above the copy block.
    viewOffsetY: compact ? -0.16 : 0,
    // On narrow screens the plan and the alert stack instead of sitting side
    // by side; there is no width to place them next to each other.
    mapPanel: compact
      ? { x0: 0.06, y0: 0.16, x1: 0.94, y1: 0.4 }
      : { x0: 0.18, y0: 0.19, x1: 0.63, y1: 0.64 },
    needleAnchor: compact ? { x: 0.07, y: 0.72 } : { x: 0.055, y: 0.7 },
  };
}

export function render(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: number,
  crowd: Figure[],
  options: RenderOptions,
  density: CrowdDensity = DEFAULT_DENSITY,
) {
  const state = sceneStateAt(p);
  const camera = cameraAt(p);
  const project = createProjector(camera, width, height, {
    amount: state.frame,
    panel: options.mapPanel,
    offsetY: options.viewOffsetY,
  });

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height);
  drawCeiling(ctx, project, state);
  drawLightPools(ctx, project, state, width);
  drawFloor(ctx, project, state);
  drawAreas(ctx, project, state);
  drawGrid(ctx, project, state, options.quality);
  drawArchitecture(ctx, project, state);
  // Behind the crowd, so people read as silhouettes against it.
  drawSourceGlows(ctx, project, state);

  // Furniture and people share one depth-sorted pass, so someone standing
  // behind the bar is occluded by it instead of drawn over it.
  const occupants = [
    ...collectFixtures(ctx, project, state),
    ...collectCrowd(ctx, project, state, crowd, options.quality, density),
  ];
  occupants.sort((a, b) => b.depth - a.depth);
  for (const item of occupants) item.draw();

  drawPracticals(ctx, project, state);
  drawBeams(ctx, project, state, options.quality);
  drawHaze(ctx, project, state, options.quality, width);
  drawFocusBloom(ctx, project, state);
  drawVignette(ctx, width, height, state);

  drawTerminalChrome(ctx, width, height, state, options);
  drawAlertPanel(ctx, width, height, state, project, options);
  drawTransientMarker(ctx, width, height, state, project);
  drawNeedleLeader(ctx, width, height, state, project, options);

  ctx.restore();
}
