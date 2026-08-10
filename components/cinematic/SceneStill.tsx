"use client";

import { useEffect, useRef } from "react";

import { createCrowd } from "./engine/crowd";
import { optionsFor, render } from "./engine/render";

/**
 * One still frame of the narrative, painted once.
 *
 * Used by the static presentation — which is simultaneously the
 * reduced-motion experience, the Canvas-failure fallback and the
 * no-cinematic path. It runs the same engine at a fixed scroll position, so
 * there is no second renderer to keep in sync.
 */
export function SceneStill({ p }: { p: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // In cinematic mode this canvas is not displayed; painting it would be
    // pure waste.
    if (document.documentElement.classList.contains("cine")) return;

    const paint = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      // Rendered at a fixed logical size and scaled by CSS, so the frame keeps
      // desktop proportions and legible type no matter how small it displays.
      // Narrow viewports get a portrait frame and therefore the phone layout.
      const portrait = window.innerWidth < 720;
      const width = portrait ? 640 : 1280;
      const height = portrait ? 800 : 720;
      parent.style.aspectRatio = `${width} / ${height}`;

      const options = optionsFor(width, height, true);
      const dpr = Math.min(options.quality.maxDpr, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      try {
        render(ctx, width, height, p, createCrowd(), options);
        canvas.dataset.painted = "true";
      } catch {
        // Leave data-painted unset; CSS keeps the grid backdrop visible.
      }
    };

    paint();

    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [p]);

  // Decorative: the narrative text beside it carries the meaning.
  return <canvas ref={ref} aria-hidden="true" data-cine-still-canvas />;
}
