/**
 * World layers: everything that exists in the venue itself.
 *
 * Each layer is an independent function so the composition in render.ts stays
 * readable and any single layer can be tuned or disabled per quality tier.
 */

import { figurePosition, type CrowdDensity, type Figure } from "./crowd";
import { FONT_MONO, rgba } from "./palette";
import type { Drawable, Projector, Quality, SceneState } from "./types";
import {
  AREAS,
  DANCE_FLOOR,
  FOCUS_ZONE,
  GLOW_SURFACES,
  LIGHTS,
  PRACTICALS,
  ROOM,
  ROOM_CORNERS,
  ZONE_D,
  ZONE_W,
  ZONES,
  type AreaKind,
} from "./venue";

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#04070F");
  gradient.addColorStop(0.55, "#070D1A");
  gradient.addColorStop(1, "#0B1426");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Ceiling plane. Without it the room has no lid and reads as an open hall
 * rather than an interior at night.
 */
export function drawCeiling(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
) {
  if (state.interior <= 0.01) return;

  const corners = ROOM_CORNERS.map(([x, z]) => project(x, ROOM.height, z));
  if (corners.some((c) => !c)) return;

  ctx.save();
  ctx.globalAlpha = state.interior;
  ctx.beginPath();
  corners.forEach((c, i) => {
    if (!c) return;
    if (i === 0) ctx.moveTo(c.x, c.y);
    else ctx.lineTo(c.x, c.y);
  });
  ctx.closePath();
  ctx.fillStyle = "#03060C";
  ctx.fill();
  ctx.strokeStyle = rgba.steel(0.32);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

/**
 * Floor surfaces per club area.
 *
 * This is what separates dance floor from bar from lounge from circulation at
 * a glance — without it the room reads as one undifferentiated hall.
 */
const AREA_TONE: Record<AreaKind, { fill: string; edge: string; width: number }> = {
  dancefloor: { fill: rgba.steel(0.28), edge: rgba.signal(0.3), width: 1.5 },
  bar: { fill: rgba.signal(0.055), edge: rgba.signal(0.18), width: 1 },
  lounge: { fill: rgba.steel(0.14), edge: rgba.steel(0.42), width: 1 },
  circulation: { fill: rgba.steel(0.06), edge: rgba.steel(0.26), width: 1 },
  stage: { fill: rgba.steel(0.1), edge: rgba.steel(0.36), width: 1 },
};

export function drawAreas(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
) {
  if (state.interior <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = state.interior;

  for (const area of AREAS) {
    const corners = [
      project(area.x0, 0.01, area.z0),
      project(area.x1, 0.01, area.z0),
      project(area.x1, 0.01, area.z1),
      project(area.x0, 0.01, area.z1),
    ];
    if (corners.some((c) => !c)) continue;

    const tone = AREA_TONE[area.kind];
    ctx.beginPath();
    corners.forEach((c, i) => {
      if (!c) return;
      if (i === 0) ctx.moveTo(c.x, c.y);
      else ctx.lineTo(c.x, c.y);
    });
    ctx.closePath();
    ctx.fillStyle = tone.fill;
    ctx.fill();
    ctx.strokeStyle = tone.edge;
    ctx.lineWidth = tone.width;
    ctx.stroke();
  }

  // Panel joints on the dance floor, so it reads as a surface not a shape.
  const { x0, z0, x1, z1 } = DANCE_FLOOR;
  ctx.strokeStyle = rgba.steel(0.32);
  ctx.lineWidth = 0.6;
  for (let x = x0 + 4; x < x1; x += 4) {
    const a = project(x, 0.01, z0);
    const b = project(x, 0.01, z1);
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Emissive surfaces: the wash behind the stage and the lit bar shelf.
 *
 * These do the most work of anything in the scene. A bright back wall with the
 * crowd silhouetted against it is the single strongest "nightclub" cue
 * available, and it costs two gradient-filled quads.
 */
function glowQuad(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  corners: ReadonlyArray<readonly [number, number, number]>,
  alpha: number,
) {
  const points = corners.map(([x, y, z]) => project(x, y, z));
  if (points.some((p) => !p)) return;

  // Gradient runs from the first corner (bright, near the floor) to the last.
  const from = points[0]!;
  const to = points[3]!;
  const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
  gradient.addColorStop(0, rgba.signal(alpha));
  gradient.addColorStop(0.55, rgba.signal(alpha * 0.32));
  gradient.addColorStop(1, rgba.signal(0));

  ctx.fillStyle = gradient;
  ctx.beginPath();
  points.forEach((p, i) => {
    if (!p) return;
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.fill();
}

export function drawSourceGlows(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
) {
  if (state.interior <= 0.01) return;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const surface of Object.values(GLOW_SURFACES)) {
    glowQuad(ctx, project, surface.corners, surface.alpha * state.interior);
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

/** Rig beams falling through the haze onto the dance floor. */
export function drawBeams(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
  quality: Quality,
) {
  if (!quality.haze || state.interior <= 0.01) return;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const light of LIGHTS) {
    if (!light.beam) continue;
    const [lx, ly, lz] = light.pos;
    // A narrow cone. Wider than this and the beams stop reading as rig lights
    // and start reading as searchlights.
    const spread = light.radius * 0.26;

    const a = project(lx - 0.22, ly, lz);
    const b = project(lx + 0.22, ly, lz);
    const c = project(lx + spread, 0, lz);
    const d = project(lx - spread, 0, lz);
    if (!a || !b || !c || !d) continue;

    const gradient = ctx.createLinearGradient(a.x, a.y, d.x, d.y);
    gradient.addColorStop(0, rgba.signal(0.05 * state.interior));
    gradient.addColorStop(1, rgba.signal(0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

/** Small warm practicals along the bar shelf and on lounge tables. */
export function drawPracticals(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
) {
  if (state.interior <= 0.01) return;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const [x, y, z] of PRACTICALS) {
    const point = project(x, y, z);
    if (!point) continue;
    const radius = Math.min(48, Math.max(3, point.scale * 0.5));
    const gradient = ctx.createRadialGradient(
      point.x,
      point.y,
      0,
      point.x,
      point.y,
      radius,
    );
    gradient.addColorStop(0, rgba.signal(0.34 * state.interior));
    gradient.addColorStop(1, rgba.signal(0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.restore();
}

/** Warm pools cast on the floor. Physical phase only. */
export function drawLightPools(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
  stageWidth: number,
) {
  if (state.abstraction > 0.98) return;

  ctx.globalCompositeOperation = "lighter";
  for (const light of LIGHTS) {
    const point = project(light.pos[0], 0.02, light.pos[2]);
    if (!point) continue;

    // Clamped in screen space: an unclamped pool close to the camera floods
    // the frame and turns the whole shot brown.
    const radius = Math.min(stageWidth * 0.32, Math.max(8, light.radius * point.scale));
    const alpha = light.intensity * (1 - state.abstraction) * 0.2;
    const gradient = ctx.createRadialGradient(
      point.x,
      point.y,
      0,
      point.x,
      point.y,
      radius,
    );
    gradient.addColorStop(0, rgba.signal(alpha * 0.85));
    gradient.addColorStop(0.45, rgba.signal(alpha * 0.22));
    gradient.addColorStop(1, rgba.signal(0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(point.x, point.y, radius, radius * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

/** Zone quads with activity fill, sorted back to front. */
export function drawFloor(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
) {
  const halfW = (ZONE_W / 2) * 0.92;
  const halfD = (ZONE_D / 2) * 0.92;

  const quads = ZONES.map((zone) => {
    const corners = [
      project(zone.x - halfW, 0, zone.z - halfD),
      project(zone.x + halfW, 0, zone.z - halfD),
      project(zone.x + halfW, 0, zone.z + halfD),
      project(zone.x - halfW, 0, zone.z + halfD),
    ];
    const centre = project(zone.x, 0, zone.z);
    return { zone, corners, centre };
  }).filter((q) => q.corners.every(Boolean) && q.centre);

  quads.sort((a, b) => (b.centre?.depth ?? 0) - (a.centre?.depth ?? 0));

  for (const { zone, corners, centre } of quads) {
    ctx.beginPath();
    corners.forEach((c, i) => {
      if (!c) return;
      if (i === 0) ctx.moveTo(c.x, c.y);
      else ctx.lineTo(c.x, c.y);
    });
    ctx.closePath();

    // The steel base fades as activity rises so amber layers over Deep Navy
    // rather than over blue — mixing the two directly turns mid-range zones
    // olive, which reads as a different brand entirely.
    const steelAlpha = (0.1 + 0.24 * state.abstraction) * (1 - zone.activity * 0.75);
    ctx.fillStyle = rgba.steel(steelAlpha);
    ctx.fill();

    // Barely present while the room is still a room, and capped even at full
    // abstraction: a zone filling a third of the frame at high alpha would put
    // amber far past the share the brand allows it.
    const heatAlpha = Math.min(
      0.32,
      zone.activity * (0.05 + 0.6 * state.abstraction),
    );
    if (heatAlpha > 0.01) {
      ctx.fillStyle = rgba.signal(heatAlpha);
      ctx.fill();
    }

    ctx.lineWidth = zone.focus ? 1.6 : 1;
    ctx.strokeStyle = zone.focus
      ? rgba.signal(0.3 + 0.7 * Math.max(state.abstraction, state.focus))
      : rgba.steel(0.3 + 0.45 * state.abstraction);
    ctx.stroke();

    // Zone identifiers appear only once the map reading has taken over.
    if (state.abstraction > 0.45 && centre) {
      const size = Math.max(7, Math.min(14, 1.1 * centre.scale));
      ctx.globalAlpha = Math.min(1, (state.abstraction - 0.45) / 0.35);
      ctx.fillStyle = zone.focus ? "#0B1426" : rgba.muted(0.85);
      ctx.font = `600 ${size.toFixed(0)}px ${FONT_MONO}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(zone.id, centre.x, centre.y);
      ctx.globalAlpha = 1;
    }
  }
}

/** Spatial grid that emerges as the room becomes a map. */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
  quality: Quality,
) {
  if (!quality.grid || state.abstraction < 0.05) return;

  ctx.strokeStyle = rgba.steel(state.abstraction * 0.5);
  ctx.lineWidth = 0.6;

  const step = 3;
  for (let x = ROOM.minX; x <= ROOM.maxX; x += step) {
    const a = project(x, 0, ROOM.minZ);
    const b = project(x, 0, ROOM.maxZ);
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  for (let z = ROOM.minZ; z <= ROOM.maxZ; z += step) {
    const a = project(ROOM.minX, 0, z);
    const b = project(ROOM.maxX, 0, z);
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}

/** Room outline, walls and ceiling truss. Reduces to a plan outline. */
export function drawArchitecture(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
) {
  const solidity = (1 - state.abstraction) * 0.85 + 0.12;

  ctx.strokeStyle = rgba.steel(solidity * 0.9);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ROOM_CORNERS.forEach(([x, z], i) => {
    const c = project(x, 0, z);
    if (!c) return;
    if (i === 0) ctx.moveTo(c.x, c.y);
    else ctx.lineTo(c.x, c.y);
  });
  ctx.closePath();
  ctx.stroke();

  if (state.abstraction > 0.9) return;

  ctx.strokeStyle = rgba.steel((1 - state.abstraction) * 0.5);
  for (const [x, z] of ROOM_CORNERS) {
    const base = project(x, 0, z);
    const top = project(x, ROOM.height, z);
    if (!base || !top) continue;
    ctx.beginPath();
    ctx.moveTo(base.x, base.y);
    ctx.lineTo(top.x, top.y);
    ctx.stroke();
  }
  for (let x = -12; x <= 12; x += 12) {
    const a = project(x, 6.6, ROOM.minZ);
    const b = project(x, 6.6, ROOM.maxZ);
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}

/**
 * The crowd. Silhouettes in the physical phase, anonymous points with short
 * movement trails in the operational phase.
 *
 * No figure is ever outlined, boxed, labelled or numbered — at any p.
 */
export function collectCrowd(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
  crowd: Figure[],
  quality: Quality,
  density: CrowdDensity,
): Drawable[] {
  const limit = Math.floor(crowd.length * quality.crowd);
  const out: Drawable[] = [];

  for (let i = 0; i < limit; i++) {
    const figure = crowd[i];
    const { x, z } = figurePosition(figure, state.p, density);
    const base = project(x, 0, z);
    const head = project(x, figure.height, z);
    if (!base || !head) continue;
    // Anything this close fills the frame and reads as an obstruction rather
    // than a person. The room stays legible without it.
    if (base.depth < 3.2 && state.abstraction < 0.5) continue;

    out.push({
      depth: base.depth,
      draw: () => drawFigure(ctx, project, state, figure, x, z, base, head),
    });
  }

  return out;
}

type Point = NonNullable<ReturnType<Projector>>;

function drawFigure(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
  figure: Figure,
  x: number,
  z: number,
  base: Point,
  head: Point,
) {
  const bodyHeight = Math.max(2, base.y - head.y);
  const bodyWidth = Math.max(1.2, bodyHeight * 0.26);

    if (state.abstraction < 0.95) {
      const alpha = 1 - state.abstraction;
      const headR = bodyWidth * 0.3;
      const shoulderY = base.y - bodyHeight + headR * 2.3;

      // Contact shadow, so figures stand on the floor rather than float.
      ctx.fillStyle = rgba.black(0.34 * alpha);
      ctx.beginPath();
      ctx.ellipse(
        base.x,
        base.y,
        bodyWidth * 0.62,
        Math.max(0.8, bodyWidth * 0.2),
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // A standing silhouette: head, shoulders, tapered body.
      ctx.fillStyle = rgba.navyDeep(0.94 * alpha);
      ctx.beginPath();
      ctx.arc(base.x, base.y - bodyHeight + headR, headR, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(base.x - bodyWidth * 0.46, base.y);
      ctx.lineTo(base.x - bodyWidth * 0.42, shoulderY);
      ctx.quadraticCurveTo(
        base.x,
        shoulderY - bodyWidth * 0.4,
        base.x + bodyWidth * 0.42,
        shoulderY,
      );
      ctx.lineTo(base.x + bodyWidth * 0.46, base.y);
      ctx.closePath();
      ctx.fill();
    }

    if (state.abstraction > 0.05) {
      const radius = Math.max(1.1, Math.min(3.6, base.scale * 0.3));
      const nearFocus =
        Math.hypot(x - FOCUS_ZONE.x, z - FOCUS_ZONE.z) < 5.2;

      ctx.globalAlpha = state.abstraction;

      if (nearFocus) {
        const trail = project(
          x - Math.cos(figure.phase) * figure.drift,
          0,
          z - Math.sin(figure.phase) * figure.drift,
        );
        if (trail) {
          ctx.strokeStyle = rgba.signal(0.55);
          ctx.lineWidth = Math.max(0.7, radius * 0.42);
          ctx.beginPath();
          ctx.moveTo(trail.x, trail.y);
          ctx.lineTo(base.x, base.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = nearFocus ? rgba.signal(1) : rgba.muted(0.82);
      ctx.beginPath();
      ctx.arc(base.x, base.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
  }
}

/** Volumetric haze around the light sources. */
export function drawHaze(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
  quality: Quality,
  stageWidth: number,
) {
  if (!quality.haze || state.abstraction > 0.85) return;

  ctx.globalCompositeOperation = "lighter";
  for (const light of LIGHTS) {
    const point = project(light.pos[0], light.pos[1] * 0.55, light.pos[2]);
    if (!point) continue;

    const radius = Math.min(
      stageWidth * 0.5,
      Math.max(30, light.radius * point.scale * 1.5),
    );
    const alpha = light.intensity * (1 - state.abstraction) * 0.075;
    const gradient = ctx.createRadialGradient(
      point.x,
      point.y,
      0,
      point.x,
      point.y,
      radius,
    );
    gradient.addColorStop(0, rgba.signal(alpha));
    gradient.addColorStop(1, rgba.signal(0));
    ctx.fillStyle = gradient;
    ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
  }
  ctx.globalCompositeOperation = "source-over";
}

/** Warmth gathering over the prioritised zone. Applied to the floor, never people. */
export function drawFocusBloom(
  ctx: CanvasRenderingContext2D,
  project: Projector,
  state: SceneState,
) {
  if (state.focus <= 0.01) return;

  const centre = project(FOCUS_ZONE.x, 0, FOCUS_ZONE.z);
  if (!centre) return;

  const radius = Math.max(20, 7 * centre.scale);
  const gradient = ctx.createRadialGradient(
    centre.x,
    centre.y,
    0,
    centre.x,
    centre.y,
    radius,
  );
  gradient.addColorStop(0, rgba.signal(0.18 * state.focus));
  gradient.addColorStop(1, rgba.signal(0));

  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(
    centre.x,
    centre.y,
    radius,
    radius * (0.42 + 0.5 * state.abstraction),
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

export function drawVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: SceneState,
) {
  if (state.abstraction > 0.9) return;

  const gradient = ctx.createRadialGradient(
    width / 2,
    height * 0.52,
    Math.min(width, height) * 0.25,
    width / 2,
    height * 0.52,
    Math.max(width, height) * 0.72,
  );
  gradient.addColorStop(0, rgba.black(0));
  gradient.addColorStop(1, rgba.black(0.62 * (1 - state.abstraction * 0.6)));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
