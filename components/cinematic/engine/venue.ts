/**
 * Venue geometry and zone activity.
 *
 * The activity matrix is deliberately identical to the one in
 * components/ui/ProductVisual.tsx and to the heat cluster in the supplied logo
 * mark: the film unfolds the existing visual system rather than inventing one.
 */

import type { Vec3 } from "./types";

export const ZONE_W = 8;
export const ZONE_D = 7;

const COLS = [-13.5, -4.5, 4.5, 13.5];
const ROWS = [-8, 0, 8];
const ROW_NAMES = ["A", "B", "C"];

/** Relative activity per zone, 0 (ruhig) to 1 (peak). */
const ACTIVITY = [
  [0.06, 0.14, 0.24, 0.34],
  [0.1, 0.3, 0.46, 0.88],
  [0.05, 0.12, 0.3, 0.42],
];

export type Zone = {
  id: string;
  x: number;
  z: number;
  activity: number;
  /** The one zone that becomes operationally relevant. */
  focus: boolean;
};

export const ZONES: Zone[] = ROWS.flatMap((z, ri) =>
  COLS.map((x, ci) => ({
    id: `${ROW_NAMES[ri]}-0${ci + 1}`,
    x,
    z,
    activity: ACTIVITY[ri][ci],
    focus: ri === 1 && ci === 3,
  })),
);

export const FOCUS_ZONE = ZONES.find((zone) => zone.focus) as Zone;

/** Centre of the developing situation, slightly off the zone centre. */
export const SITUATION = { x: FOCUS_ZONE.x - 0.4, z: FOCUS_ZONE.z + 0.2 };

export const ROOM = {
  minX: -18,
  maxX: 18,
  minZ: -12,
  maxZ: 12,
  height: 7,
};

export const ROOM_CORNERS: ReadonlyArray<readonly [number, number]> = [
  [ROOM.minX, ROOM.minZ],
  [ROOM.maxX, ROOM.minZ],
  [ROOM.maxX, ROOM.maxZ],
  [ROOM.minX, ROOM.maxZ],
];

/* ---------------------------------------------------------------------------
   Club anatomy

   The room is laid out as an actual venue rather than a neutral hall: stage at
   the far end, dance floor in front of it, bar down the right-hand wall,
   lounges at the entrance end, circulation between them. The camera enters
   from +z, so the stage sits at -z where it reads as the far wall.
--------------------------------------------------------------------------- */

export type AreaKind =
  | "dancefloor"
  | "bar"
  | "lounge"
  | "circulation"
  | "stage";

export type Area = {
  id: string;
  kind: AreaKind;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  /** Overrides the per-kind population where the layout calls for it. */
  densityOverride?: number;
};

/**
 * The bar and its crowd sit on the *left* wall. The camera approaches the
 * prioritised zone from the left in the situation scene, so putting the venue's
 * bulkiest furniture on that side would have hidden the very thing the scene
 * exists to show.
 */
export const AREAS: Area[] = [
  { id: "stage", kind: "stage", x0: -11, z0: -12, x1: 3, z1: -9.5 },
  { id: "floor", kind: "dancefloor", x0: -12, z0: -9, x1: 4, z1: 3 },
  { id: "bar-front", kind: "bar", x0: -15.4, z0: -6, x1: -9.5, z1: 7 },
  // The prioritised zone sits in this busy standing area between the dance
  // floor and the lounges — a natural bottleneck, kept free of furniture.
  {
    id: "east",
    kind: "circulation",
    x0: 8.5,
    z0: -8,
    x1: 17.5,
    z1: 5,
    densityOverride: 62,
  },
  { id: "lounge-a", kind: "lounge", x0: 4.5, z0: 6.5, x1: 12, z1: 11 },
  { id: "lounge-b", kind: "lounge", x0: 12.5, z0: 6, x1: 17.5, z1: 11 },
  { id: "entry", kind: "circulation", x0: -8, z0: 8, x1: 4, z1: 11.5 },
  { id: "cross", kind: "circulation", x0: -9, z0: 3.5, x1: 8, z1: 7.5 },
];

/** The dance floor gets its own inset surface treatment. */
export const DANCE_FLOOR = AREAS.find((a) => a.kind === "dancefloor") as Area;

export type Fixture = {
  kind: "stage" | "dj" | "bar" | "backbar" | "table" | "bench";
  /** Footprint centre. */
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  /** Base elevation. */
  y?: number;
  /** Carries a warm edge highlight — bar tops, the DJ booth. */
  lit?: boolean;
};

function loungeCluster(x: number, z: number): Fixture[] {
  return [
    { kind: "table", x, z, w: 1, d: 1, h: 0.74, lit: true },
    { kind: "bench", x: x - 1.5, z, w: 0.55, d: 1.9, h: 0.44 },
    { kind: "bench", x: x + 1.5, z, w: 0.55, d: 1.9, h: 0.44 },
  ];
}

export const FIXTURES: Fixture[] = [
  // Stage and DJ booth at the far end.
  { kind: "stage", x: -4, z: -10.75, w: 14, d: 2.5, h: 0.85 },
  { kind: "dj", x: -4, z: -10.6, w: 3.4, d: 1.5, h: 1.15, y: 0.85, lit: true },
  // Bar along the left-hand wall, with its back shelf against it.
  { kind: "bar", x: -16.8, z: 0.5, w: 2.1, d: 13.5, h: 1.15, lit: true },
  { kind: "backbar", x: -17.85, z: 0.5, w: 0.5, d: 13.5, h: 2.7 },
  // Lounge clusters at the entrance end, clear of the prioritised zone.
  ...loungeCluster(6.5, 8.8),
  ...loungeCluster(10.5, 8.8),
  ...loungeCluster(14.5, 8.8),
  ...loungeCluster(14.5, 6.6),
];

export type Light = {
  pos: Vec3;
  /** Radius of the pool cast on the floor, in world units. */
  radius: number;
  intensity: number;
  /** Casts a visible beam down through the haze. */
  beam?: boolean;
};

/**
 * Overhead sources. Three rig lights over the dance floor, one over the bar,
 * and one already above the zone that later becomes relevant — so the eye is
 * drawn there before any interface exists.
 */
export const LIGHTS: Light[] = [
  { pos: [-8, 6.3, -6], radius: 6.5, intensity: 0.6, beam: true },
  { pos: [-2, 6.3, -2.5], radius: 7, intensity: 0.5, beam: true },
  { pos: [3, 6.3, -6], radius: 6, intensity: 0.45, beam: true },
  { pos: [FOCUS_ZONE.x, 4.6, FOCUS_ZONE.z], radius: 8, intensity: 0.62 },
  { pos: [-9, 5, 8], radius: 8.5, intensity: 0.22 },
];

/** Small warm practicals: bar shelf, lounge tables. Cheap point glows. */
export const PRACTICALS: Vec3[] = [
  [-17.4, 2.1, -5],
  [-17.4, 2.1, -1],
  [-17.4, 2.1, 3],
  [-17.4, 2.1, 6.5],
  [6.5, 0.9, 8.8],
  [10.5, 0.9, 8.8],
  [14.5, 0.9, 8.8],
  [14.5, 0.9, 6.6],
  [-4, 1.9, -10.6],
];

/** Emissive wall surfaces: the wash behind the stage and the lit bar shelf. */
export const GLOW_SURFACES = {
  stage: {
    corners: [
      [-11, 0.2, ROOM.minZ + 0.1],
      [3, 0.2, ROOM.minZ + 0.1],
      [3, 4.6, ROOM.minZ + 0.1],
      [-11, 4.6, ROOM.minZ + 0.1],
    ] as ReadonlyArray<readonly [number, number, number]>,
    alpha: 0.115,
  },
  bar: {
    corners: [
      [-17.6, 1.2, -6.5],
      [-17.6, 1.2, 7.5],
      [-17.6, 2.75, 7.5],
      [-17.6, 2.75, -6.5],
    ] as ReadonlyArray<readonly [number, number, number]>,
    alpha: 0.15,
  },
};

/** Zones shown in the terminal's left rail, most relevant last. */
export const RAIL_ZONES = ["A-01", "B-02", "C-03", "B-04"];
