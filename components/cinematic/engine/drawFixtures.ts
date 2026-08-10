/**
 * Club furniture: stage, DJ booth, bar, back shelf, lounge tables and benches.
 *
 * Everything is a box. In a room this dark a box reads convincingly as its
 * silhouette plus a slightly brighter top face, which is far cheaper than
 * shading individual sides and holds up better at small scale.
 */

import { rgba } from "./palette";
import type { Drawable, Projected, Projector, SceneState } from "./types";
import { FIXTURES, type Fixture } from "./venue";

/** Convex hull (monotone chain) of the projected corners. */
function hull(points: Projected[]): Projected[] {
  if (points.length < 3) return points;
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o: Projected, a: Projected, b: Projected) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower: Projected[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper: Projected[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function trace(ctx: CanvasRenderingContext2D, points: Projected[]) {
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.closePath();
}

function fixtureDrawable(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  fixture: Fixture,
  interior: number,
): Drawable | null {
  const base = fixture.y ?? 0;
  const top = base + fixture.h;
  const hw = fixture.w / 2;
  const hd = fixture.d / 2;

  const corners: Projected[] = [];
  for (const y of [base, top]) {
    for (const [dx, dz] of [
      [-hw, -hd],
      [hw, -hd],
      [hw, hd],
      [-hw, hd],
    ] as const) {
      const p = project(fixture.x + dx, y, fixture.z + dz);
      if (!p) return null;
      corners.push(p);
    }
  }

  const topFace = corners.slice(4);
  const silhouette = hull(corners);
  const centre = project(fixture.x, base, fixture.z);
  if (!centre) return null;

  return {
    depth: centre.depth,
    draw() {
      ctx.save();
      ctx.globalAlpha = interior;

      // Body.
      trace(ctx, silhouette);
      ctx.fillStyle = rgba.navyDeep(0.96);
      ctx.fill();
      ctx.strokeStyle = rgba.steel(0.5);
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top surface, catching the room light.
      trace(ctx, topFace);
      ctx.fillStyle = fixture.lit ? rgba.signal(0.16) : rgba.steel(0.3);
      ctx.fill();
      ctx.strokeStyle = fixture.lit ? rgba.signal(0.5) : rgba.steel(0.55);
      ctx.stroke();

      ctx.restore();
    },
  };
}

export function collectFixtures(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
): Drawable[] {
  if (state.interior <= 0.01) return [];

  const out: Drawable[] = [];
  for (const fixture of FIXTURES) {
    const drawable = fixtureDrawable(ctx, project, fixture, state.interior);
    if (drawable) out.push(drawable);
  }
  return out;
}
