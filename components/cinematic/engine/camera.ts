/**
 * Camera path.
 *
 * One continuous move from eye level inside the room to a true overhead plan.
 * It never reverses — that monotonic rise is the visual thesis of the whole
 * sequence: the club you flew through *is* the map you end up reading.
 *
 * The up vector is an explicit, interpolated keyframe value rather than a
 * fixed world-up. Deriving it from world-up would become singular exactly
 * where the camera looks straight down, which is precisely where the sequence
 * spends its most important seconds.
 */

import type { Camera, Vec3 } from "./types";
import { FOCUS_ZONE } from "./venue";

type Keyframe = Camera & { p: number };

const KEYFRAMES: Keyframe[] = [
  // Establishing: standing inside the room, near the back wall, looking down
  // its length. Being inside is what gives the opening frame its depth.
  { p: 0.0, pos: [-1.5, 1.9, 10.5], target: [1, 1.35, -8], up: [0, 1, 0], fov: 42 },
  { p: 0.1, pos: [-1, 2.2, 8], target: [1.5, 1.3, -8], up: [0, 1, 0], fov: 41 },
  // Flight: lift and drift across the floor.
  { p: 0.26, pos: [-4, 6.5, 6], target: [3, 1.2, -3], up: [0, 1, 0], fov: 38 },
  // Approach: push in on the zone, narrower lens. A restrained dolly zoom.
  {
    p: 0.4,
    pos: [4.5, 4.4, 3],
    target: [FOCUS_ZONE.x - 0.5, 1.3, FOCUS_ZONE.z - 3.5],
    up: [0, 1, 0],
    fov: 30,
  },
  // Perception: rise and pitch down; the up vector starts tipping to north.
  // The rise front-loads so the whole plan is legible while the state that
  // narrates it ("Aus dem Raum wird eine Struktur") is on screen.
  { p: 0.46, pos: [5.5, 13, 6], target: [6.5, 0, -2], up: [0, 0.78, -0.63], fov: 36 },
  { p: 0.52, pos: [4, 25, 5], target: [3.5, 0, -1], up: [0, 0.32, -0.95], fov: 41 },
  { p: 0.58, pos: [2.5, 31, 3], target: [1.5, 0, 0], up: [0, 0.1, -0.99], fov: 43 },
  { p: 0.7, pos: [1.5, 33, 2], target: [1, 0, 0], up: [0, 0.04, -1], fov: 44 },
  // Terminal: locked plan view. Screen-up is north, screen-right is +x,
  // which puts zone B-04 right of centre — as in the existing ProductVisual.
  { p: 0.82, pos: [0.6, 34, 0.8], target: [0.4, 0, 0], up: [0, 0, -1], fov: 44 },
  { p: 0.93, pos: [0.6, 34, 0.8], target: [0.4, 0, 0], up: [0, 0, -1], fov: 44 },
  // Resolution: settle back a little as the sequence releases.
  { p: 1.0, pos: [0.6, 38, 0.9], target: [0.4, 0, 0], up: [0, 0, -1], fov: 46 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function mix(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export function cameraAt(p: number): Camera {
  let i = 0;
  while (i < KEYFRAMES.length - 2 && p > KEYFRAMES[i + 1].p) i++;

  const a = KEYFRAMES[i];
  const b = KEYFRAMES[i + 1];
  const t = smooth(clamp01((p - a.p) / (b.p - a.p)));

  return {
    pos: mix(a.pos, b.pos, t),
    target: mix(a.target, b.target, t),
    up: mix(a.up, b.up, t),
    fov: a.fov + (b.fov - a.fov) * t,
  };
}
