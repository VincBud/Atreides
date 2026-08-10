/** Shared types for the cinematic engine. */

export type Vec3 = readonly [number, number, number];

export type Camera = {
  pos: Vec3;
  target: Vec3;
  /** Explicit up vector. Interpolating it is what keeps the roll stable when
   *  the camera pitches through vertical into the plan view. */
  up: Vec3;
  /** Vertical field of view in degrees. */
  fov: number;
};

export type Projected = {
  x: number;
  y: number;
  /** Distance along the view axis — used for painter's-algorithm sorting. */
  depth: number;
  /** Projection scale at this depth: world units to pixels. */
  scale: number;
};

/** Projects a world point to stage pixels, or null if behind the camera. */
export type Projector = (x: number, y: number, z: number) => Projected | null;

/**
 * One painter's-algorithm item. Fixtures and people are collected into a
 * single list and sorted together, so a person standing behind the bar is
 * occluded by it rather than drawn on top.
 */
export type Drawable = {
  depth: number;
  draw: () => void;
};

/** Everything the renderer needs to know about a given scroll position. */
export type SceneState = {
  /** Raw scroll progress, 0 to 1. */
  p: number;
  /** Index of the active narrative state (0-based). */
  stateIndex: number;
  /** 0 = physical room, 1 = operational map. */
  abstraction: number;
  /** 0 = no interface, 1 = full terminal chrome. */
  chrome: number;
  /** How far the plan is framed into the terminal's map panel. */
  frame: number;
  /** 0 = no alert, 1 = alert panel fully populated. */
  alert: number;
  /** Interior shell — ceiling, furniture, beams — visible while inside the room. */
  interior: number;
  /** Terminal steps back as the human decision layer takes over. */
  recede: number;
  /** Final zoom-out as the sequence releases. */
  settle: number;
  /** Emphasis on the prioritised zone. */
  focus: number;
  /** Whether the transient "Auffällige Dynamik" marker is showing. */
  transient: number;
  /** Whether the story needle's leader line attaches to the zone. */
  attach: number;
};

export type Quality = {
  /** Fraction of the crowd to draw, 0 to 1. */
  crowd: number;
  haze: boolean;
  grid: boolean;
  maxDpr: number;
};

export type RenderOptions = {
  quality: Quality;
  /** Rect the plan is framed into once the terminal appears, as stage fractions. */
  mapPanel: { x0: number; y0: number; x1: number; y1: number };
  /**
   * Vertical band the terminal chrome occupies, as stage fractions. The
   * narrative copy lives below it, so interface and text never overlap.
   */
  terminalRegion: { y0: number; y1: number };
  /** Baseline vertical framing shift while the camera is inside the room. */
  viewOffsetY: number;
  /** Fallback anchor of the story-needle leader, as stage fractions. */
  needleAnchor: { x: number; y: number };
  /**
   * Measured end of the needle's DOM hairline, in stage pixels. Set on scene
   * change so the canvas leader continues the real label rather than an
   * assumed position. Falls back to `needleAnchor` when unmeasured.
   */
  needleAnchorPx?: { x: number; y: number } | null;
};
