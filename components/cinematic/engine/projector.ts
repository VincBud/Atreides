/**
 * Pinhole projector.
 *
 * This is the entire 3D engine: build an orthonormal camera basis, divide by
 * depth. No dependency, no shaders, no context loss to handle.
 */

import type { Camera, Projected, Projector } from "./types";

type Frame = {
  /** 0 = fill the stage, 1 = framed into the terminal's map panel. */
  amount: number;
  panel: { x0: number; y0: number; x1: number; y1: number };
  /**
   * Baseline vertical shift as a fraction of stage height, applied while the
   * camera is still in the room. Portrait stages need the horizon lifted so
   * the venue sits above the narrative copy instead of behind it.
   */
  offsetY?: number;
};

export function createProjector(
  camera: Camera,
  width: number,
  height: number,
  frame?: Frame,
): Projector {
  const [px, py, pz] = camera.pos;

  // forward
  let fx = camera.target[0] - px;
  let fy = camera.target[1] - py;
  let fz = camera.target[2] - pz;
  const fl = Math.hypot(fx, fy, fz) || 1;
  fx /= fl;
  fy /= fl;
  fz /= fl;

  // right = forward × up
  const [ux0, uy0, uz0] = camera.up;
  let rx = fy * uz0 - fz * uy0;
  let ry = fz * ux0 - fx * uz0;
  let rz = fx * uy0 - fy * ux0;
  const rl = Math.hypot(rx, ry, rz) || 1;
  rx /= rl;
  ry /= rl;
  rz /= rl;

  // up = right × forward (re-orthogonalised)
  const ux = ry * fz - rz * fy;
  const uy = rz * fx - rx * fz;
  const uz = rx * fy - ry * fx;

  // On a portrait stage the field of view has to be driven by the *narrow*
  // dimension, otherwise a phone shows a sliver of the room and the same
  // camera path frames almost nothing. Landscape stages are unaffected.
  const reference = Math.min(width, height);
  const focal = reference / 2 / Math.tan((camera.fov * Math.PI) / 360);

  // Framing the plan into the terminal's map panel is a viewport transform on
  // the projected point, not a second projection — so geometry stays coherent
  // and there is never a cut between the room and the dashboard.
  let scale = 1;
  let cx = width / 2;
  let cy = height / 2;

  if (frame?.offsetY) {
    cy += height * frame.offsetY * (1 - frame.amount);
  }

  if (frame && frame.amount > 0) {
    const { x0, y0, x1, y1 } = frame.panel;
    // The plan is depth-limited on screen, so the panel's height fraction is
    // what it has to fit into. Using the width fraction would leave the map
    // floating in a panel far larger than itself.
    const targetScale = y1 - y0;
    scale = 1 + (targetScale - 1) * frame.amount;
    cx = width / 2 + (((x0 + x1) / 2 - 0.5) * width) * frame.amount;
    cy = height / 2 + (((y0 + y1) / 2 - 0.5) * height) * frame.amount;
  }

  return function project(x: number, y: number, z: number): Projected | null {
    const dx = x - px;
    const dy = y - py;
    const dz = z - pz;

    const depth = dx * fx + dy * fy + dz * fz;
    if (depth <= 0.12) return null;

    const vx = dx * rx + dy * ry + dz * rz;
    const vy = dx * ux + dy * uy + dz * uz;
    const s = focal / depth;

    return {
      x: cx + vx * s * scale,
      y: cy - vy * s * scale,
      depth,
      scale: s * scale,
    };
  };
}
