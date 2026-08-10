/**
 * Crowd state.
 *
 * Figures are anonymous throughout — never outlined, labelled, tracked or
 * counted individually. What the sequence shows is the *space* between them
 * changing, which is also the honest depiction of what a zone-level system
 * actually perceives.
 *
 * Occupancy is generated from the club's areas, not from the zone activity
 * matrix. Those are different things on purpose: a packed dance floor is
 * normal and scores low, while the anomaly at B-04 is a *change* in movement.
 * Density is where people are; activity is what is unusual about them.
 */

import { AREAS, FIXTURES, SITUATION, type AreaKind } from "./venue";

export type Figure = {
  /** Resting position. */
  x: number;
  z: number;
  /** Phase offset used to vary trail direction. */
  phase: number;
  /** Trail length in world units. */
  drift: number;
  /** Height in metres, so a crowd does not read as identical cut-outs. */
  height: number;
  /** Part of the two small groups at the centre of the situation. */
  inSituation: boolean;
};

/**
 * Population controls. Tune the venue's feel here rather than by adding
 * figures inside the renderer.
 */
export type CrowdDensity = {
  /** Global multiplier applied to every area. */
  scale: number;
  /** People per 100 m² for each kind of area. */
  perArea: Record<AreaKind, number>;
  /** Radius kept clear of stray figures around the developing situation. */
  clearingRadius: number;
  /** How far bystanders drift outward once the situation develops. */
  clearingPush: number;
  /** Range over which that drift falls off. */
  clearingReach: number;
};

export const DEFAULT_DENSITY: CrowdDensity = {
  scale: 1,
  perArea: {
    dancefloor: 52,
    bar: 34,
    lounge: 20,
    circulation: 16,
    stage: 4,
  },
  // A tight hole with a short, strong push. A wider reach would thin the whole
  // area out, and the point is a *local* change inside a crowd that stays dense
  // around it.
  clearingRadius: 2.5,
  clearingPush: 2.6,
  clearingReach: 5.5,
};

/** Deterministic PRNG so every render and every reload composes identically. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Footprints people cannot stand inside: bar counters, stage, furniture. */
const BLOCKED = FIXTURES.filter((f) => f.kind !== "bench").map((f) => ({
  x0: f.x - f.w / 2 - 0.3,
  x1: f.x + f.w / 2 + 0.3,
  z0: f.z - f.d / 2 - 0.3,
  z1: f.z + f.d / 2 + 0.3,
}));

function blocked(x: number, z: number) {
  return BLOCKED.some((b) => x > b.x0 && x < b.x1 && z > b.z0 && z < b.z1);
}

export function createCrowd(
  density: CrowdDensity = DEFAULT_DENSITY,
  seed = 11,
): Figure[] {
  const random = mulberry32(seed);
  const figures: Figure[] = [];

  for (const area of AREAS) {
    const w = area.x1 - area.x0;
    const d = area.z1 - area.z0;
    const perArea = area.densityOverride ?? density.perArea[area.kind];
    const target = Math.round(((w * d) / 100) * perArea * density.scale);

    let placed = 0;
    let attempts = 0;
    while (placed < target && attempts < target * 6) {
      attempts++;
      const x = area.x0 + random() * w;
      const z = area.z0 + random() * d;
      if (blocked(x, z)) continue;
      if (Math.hypot(x - SITUATION.x, z - SITUATION.z) < density.clearingRadius) {
        continue;
      }
      figures.push({
        x,
        z,
        phase: random() * Math.PI * 2,
        drift: 0.4 + random() * 0.9,
        height: 1.6 + random() * 0.28,
        inSituation: false,
      });
      placed++;
    }
  }

  // Two small groups facing each other. Ambiguous by design: at the camera
  // distance used in that scene, no individual is legible.
  const groups: ReadonlyArray<readonly [number, number]> = [
    [-1.35, -0.75],
    [-1.05, 0.2],
    [-1.7, 0.55],
    [1.25, -0.6],
    [1.5, 0.35],
    [1.9, -0.15],
  ];
  for (const [dx, dz] of groups) {
    figures.push({
      x: SITUATION.x + dx,
      z: SITUATION.z + dz,
      phase: 0,
      drift: 0.35,
      height: 1.7,
      inSituation: true,
    });
  }

  return figures;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Position of a figure at scroll progress `p`.
 *
 * Bystanders drift outward as the situation develops, opening a clearing.
 * That widening gap — not the two groups — is the visual signal, and it is
 * what has to stay readable as overall density rises.
 */
export function figurePosition(
  figure: Figure,
  p: number,
  density: CrowdDensity = DEFAULT_DENSITY,
) {
  if (figure.inSituation) return { x: figure.x, z: figure.z };

  const opening = smoothstep(0.2, 0.46, p);
  if (opening <= 0) return { x: figure.x, z: figure.z };

  const dx = figure.x - SITUATION.x;
  const dz = figure.z - SITUATION.z;
  const distance = Math.hypot(dx, dz) || 1;
  const push =
    Math.max(0, 1 - distance / density.clearingReach) *
    density.clearingPush *
    opening;

  return {
    x: figure.x + (dx / distance) * push,
    z: figure.z + (dz / distance) * push,
  };
}
