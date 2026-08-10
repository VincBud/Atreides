/**
 * Terminal layers: the interface that grows around the venue plan, and the
 * story needle's spatial connection.
 *
 * The chrome is drawn in canvas because it is part of the picture. Everything
 * a visitor actually needs to *read* lives in the DOM overlay, so nothing here
 * carries information that exists only on the canvas.
 */

import { FONT_MONO, FONT_UI, rgba } from "./palette";
import type { Projector, RenderOptions, SceneState } from "./types";
import { FOCUS_ZONE, RAIL_ZONES, SITUATION } from "./venue";

/** Letter-spaced text, which Canvas has no native support for. */
function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + spacing;
  }
}

export function drawTerminalChrome(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: SceneState,
  options: RenderOptions,
) {
  if (state.chrome <= 0.01) return;

  const compact = width < 720;
  const pad = Math.max(8, width * 0.012);
  const opacity = state.chrome * (1 - state.settle * 0.35) * (1 - state.recede * 0.55);
  const top = height * options.terminalRegion.y0;
  const bottom = height * options.terminalRegion.y1;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.textBaseline = "middle";

  // ---- status bar ----
  const barH = Math.max(32, height * 0.062);
  ctx.fillStyle = rgba.panel(0.92);
  ctx.fillRect(pad, top, width - pad * 2, barH);
  ctx.strokeStyle = rgba.steel(0.95);
  ctx.lineWidth = 1;
  ctx.strokeRect(pad, top, width - pad * 2, barH);

  ctx.fillStyle = rgba.signal(1);
  ctx.beginPath();
  ctx.arc(pad + barH * 0.42, top + barH / 2, Math.max(3, barH * 0.1), 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = rgba.cloud(1);
  ctx.font = `600 ${Math.max(12, height * 0.024).toFixed(0)}px ${FONT_UI}`;
  ctx.textAlign = "left";
  ctx.fillText("Live-Lagebild", pad + barH * 0.78, top + barH / 2);

  // The concept marker travels with the interface — the film must never imply
  // a deployed system.
  const chipW = Math.min(width * 0.34, 186);
  const chipH = barH * 0.56;
  const chipX = width - pad - chipW - 10;
  ctx.strokeStyle = rgba.muted(0.7);
  ctx.strokeRect(chipX, top + (barH - chipH) / 2, chipW, chipH);
  ctx.fillStyle = rgba.muted(0.95);
  ctx.font = `${Math.max(8, height * 0.0155).toFixed(0)}px ${FONT_MONO}`;
  ctx.textAlign = "center";
  ctx.fillText("KONZEPTDARSTELLUNG", chipX + chipW / 2, top + barH / 2);

  // ---- zone rail (desktop only; the map carries it on narrow screens) ----
  if (!compact) {
    const railW = width * 0.125;
    const railY = top + barH + 8;
    const railH = bottom - railY;
    ctx.fillStyle = rgba.panel(0.85);
    ctx.fillRect(pad, railY, railW, railH);
    ctx.strokeStyle = rgba.steel(0.95);
    ctx.strokeRect(pad, railY, railW, railH);

    ctx.font = `${Math.max(8, height * 0.015).toFixed(0)}px ${FONT_MONO}`;
    ctx.fillStyle = rgba.muted(0.8);
    ctx.textAlign = "left";
    tracked(ctx, "ZONEN", pad + 12, railY + 16, 1.4);

    RAIL_ZONES.forEach((id, i) => {
      const rowH = Math.min(height * 0.04, (railH - 40) / RAIL_ZONES.length - 8);
      const y = railY + 30 + i * (rowH + 8);
      const active = id === FOCUS_ZONE.id;
      ctx.fillStyle = active ? rgba.signal(0.18) : rgba.steel(0.26);
      ctx.fillRect(pad + 10, y, railW - 20, rowH);
      if (active) {
        ctx.strokeStyle = rgba.signal(0.7);
        ctx.strokeRect(pad + 10, y, railW - 20, rowH);
      }
      ctx.fillStyle = active ? rgba.signal(1) : rgba.muted(0.9);
      ctx.font = `${Math.max(9, height * 0.018).toFixed(0)}px ${FONT_MONO}`;
      ctx.fillText(id, pad + 20, y + rowH / 2);
    });
  }

  ctx.restore();
}

export function drawAlertPanel(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: SceneState,
  project: Projector,
  options: RenderOptions,
) {
  if (state.alert <= 0.01) return;

  const compact = width < 720;
  const pad = Math.max(8, width * 0.012);
  const barH = Math.max(32, height * 0.062);
  const opacity = state.chrome * state.alert * (1 - state.settle * 0.35) * (1 - state.recede * 0.55);
  const top = height * options.terminalRegion.y0;
  const bottom = height * options.terminalRegion.y1;

  const panelW = compact ? width - pad * 2 : width * 0.3;
  // Stacked below the plan on narrow screens, beside it on wide ones.
  const panelY = compact ? height * 0.42 : top + barH + 8;
  const panelH = bottom - panelY;
  const panelX = compact ? pad : width - pad - panelW;

  // The connection line is drawn first so the panel sits on top of it, which
  // reads as the panel having grown out of the zone.
  const zone = project(FOCUS_ZONE.x, 0, FOCUS_ZONE.z);
  if (zone) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = rgba.signal(0.65);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(zone.x, zone.y);
    if (compact) {
      ctx.lineTo(zone.x, panelY - 10);
    } else {
      ctx.lineTo((zone.x + panelX) / 2, zone.y);
      ctx.lineTo(panelX, panelY + panelH * 0.18);
    }
    ctx.stroke();
    ctx.fillStyle = rgba.signal(1);
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.textBaseline = "middle";

  ctx.fillStyle = rgba.panel(0.95);
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = rgba.signal(0.5);
  ctx.lineWidth = 1;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  const inner = panelX + 14;
  const small = Math.max(8, height * 0.0165).toFixed(0);

  ctx.font = `${small}px ${FONT_MONO}`;
  ctx.fillStyle = rgba.muted(0.95);
  ctx.textAlign = "left";
  tracked(ctx, "PRIORITÄT", inner, panelY + panelH * 0.09, 1.3);

  ctx.fillStyle = rgba.signal(1);
  ctx.textAlign = "right";
  ctx.fillText("ERHÖHT", panelX + panelW - 14, panelY + panelH * 0.09);

  ctx.fillStyle = rgba.cloud(1);
  ctx.font = `600 ${Math.max(14, height * 0.03).toFixed(0)}px ${FONT_UI}`;
  ctx.textAlign = "left";
  ctx.fillText("Erhöhte Dynamik", inner, panelY + panelH * 0.22);

  ctx.fillStyle = rgba.muted(0.95);
  ctx.font = `${Math.max(10, height * 0.019).toFixed(0)}px ${FONT_UI}`;
  ctx.fillText(
    `Zone ${FOCUS_ZONE.id} · Bewegungsdichte verändert`,
    inner,
    panelY + panelH * 0.31,
  );

  // Verlauf. Dropped on narrow screens — there is no vertical room for it, and
  // the status and review request matter more than the trend.
  if (!compact) {
    const chartX = inner;
    const chartY = panelY + panelH * 0.38;
    const chartW = panelW - 28;
    const chartH = panelH * 0.24;
    ctx.strokeStyle = rgba.steel(0.9);
    ctx.strokeRect(chartX, chartY, chartW, chartH);
    ctx.fillStyle = rgba.muted(0.8);
    ctx.font = `${small}px ${FONT_MONO}`;
    tracked(ctx, "VERLAUF · 8 MIN", chartX + 8, chartY + chartH * 0.16, 1.2);

    const series = [0, 0.06, 0.04, 0.14, 0.12, 0.26, 0.4, 0.52];
    ctx.strokeStyle = rgba.signal(1);
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    series.forEach((value, i) => {
      const x = chartX + 10 + (chartW - 20) * (i / (series.length - 1));
      const y = chartY + chartH - 8 - value * (chartH * 0.62);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  // Status and review request — the sequence ends in an instruction to a
  // human, never in an action taken by the system.
  ctx.fillStyle = rgba.muted(0.9);
  ctx.font = `${small}px ${FONT_MONO}`;
  tracked(ctx, "STATUS", inner, panelY + panelH * 0.71, 1.3);
  ctx.fillStyle = rgba.cloud(1);
  ctx.font = `${Math.max(11, height * 0.022).toFixed(0)}px ${FONT_UI}`;
  ctx.fillText("Zur Prüfung", inner, panelY + panelH * 0.79);

  const btnH = Math.max(30, panelH * 0.13);
  const btnY = panelY + panelH - btnH - 12;
  ctx.fillStyle = rgba.signal(1);
  ctx.fillRect(inner, btnY, panelW - 28, btnH);
  ctx.fillStyle = "#0B1426";
  ctx.font = `700 ${Math.max(10, height * 0.02).toFixed(0)}px ${FONT_UI}`;
  ctx.textAlign = "center";
  ctx.fillText("VON SECURITY PRÜFEN", panelX + panelW / 2, btnY + btnH / 2);

  ctx.restore();
}

/**
 * The story needle's leader line.
 *
 * The label itself is real DOM text at a known stage fraction; only the line
 * connecting it to the zone is drawn here, recomputed each frame from the
 * projected zone position. That is what makes the annotation feel attached to
 * the room rather than pinned to the screen.
 */
export function drawNeedleLeader(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: SceneState,
  project: Projector,
  options: RenderOptions,
) {
  if (state.attach <= 0.01) return;

  const zone = project(FOCUS_ZONE.x, 0, FOCUS_ZONE.z);
  if (!zone) return;

  const anchorX = options.needleAnchorPx
    ? options.needleAnchorPx.x
    : width * options.needleAnchor.x;
  const anchorY = options.needleAnchorPx
    ? options.needleAnchorPx.y
    : height * options.needleAnchor.y;
  const elbowX = anchorX + Math.max(28, width * 0.05);

  ctx.save();
  ctx.globalAlpha = state.attach * (1 - state.chrome * 0.45);
  ctx.strokeStyle = rgba.signal(0.75);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(anchorX, anchorY);
  ctx.lineTo(elbowX, anchorY);
  ctx.lineTo(zone.x, zone.y);
  ctx.stroke();

  ctx.fillStyle = rgba.signal(1);
  ctx.beginPath();
  ctx.arc(zone.x, zone.y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Transient, unnumbered annotation during the developing situation.
 *
 * It points at the *zone boundary*, never at the people inside it.
 */
export function drawTransientMarker(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: SceneState,
  project: Projector,
) {
  if (state.transient <= 0.01) return;

  const edge = project(SITUATION.x, 0, SITUATION.z - 3.4);
  if (!edge) return;

  const label = "AUFFÄLLIGE DYNAMIK";
  const lift = height * 0.11;
  const fontSize = Math.max(9, height * 0.019);
  ctx.font = `${fontSize.toFixed(0)}px ${FONT_MONO}`;
  const labelWidth = ctx.measureText(label).width + label.length * 1.6;

  // Flip the callout to the inside when it would run off the edge — which it
  // always would on a narrow stage.
  const flip = edge.x + 32 + labelWidth > width - 12;
  const elbow = flip ? edge.x - 26 : edge.x + 26;
  const textX = flip ? edge.x - 32 - labelWidth : edge.x + 32;

  ctx.save();
  ctx.globalAlpha = state.transient;
  ctx.strokeStyle = rgba.signal(0.8);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(edge.x, edge.y);
  ctx.lineTo(edge.x, edge.y - lift);
  ctx.lineTo(elbow, edge.y - lift);
  ctx.stroke();

  ctx.fillStyle = rgba.signal(1);
  ctx.beginPath();
  ctx.arc(edge.x, edge.y, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = rgba.cloud(1);
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  tracked(ctx, label, Math.max(12, textX), edge.y - lift + 4, 1.6);
  ctx.restore();
}
