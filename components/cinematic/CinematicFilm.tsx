"use client";

import { useEffect, useRef } from "react";

import { NARRATIVE, stateIndexAt } from "./narrative";
import { createCrowd } from "./engine/crowd";
import { optionsFor, render } from "./engine/render";

/**
 * The cinematic layer.
 *
 * Scroll is never intercepted — no preventDefault, no wheel handling, no
 * snapping. The sequence is a tall track with a sticky stage, and this
 * component only *reads* the scroll position and paints the matching frame.
 * Scroll fast and you pass through quickly; stop and you get a still.
 */
export function CinematicFilm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!document.documentElement.classList.contains("cine")) return;

    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    const track = stage?.parentElement;
    if (!canvas || !stage || !track) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      // Canvas unusable after all: drop back to the static presentation.
      document.documentElement.classList.remove("cine");
      return;
    }

    const crowd = createCrowd();
    const items = Array.from(
      track.querySelectorAll<HTMLElement>("[data-cine-state]"),
    );
    const stepNumber = track.querySelector<HTMLElement>("[data-cine-step-number]");
    const ticks = Array.from(
      track.querySelectorAll<HTMLElement>("[data-cine-step-tick]"),
    );

    let width = 0;
    let height = 0;
    let trackTop = 0;
    let usable = 1;
    let options = optionsFor(1, 1);
    let lastIndex = -1;
    let frame = 0;
    let visible = true;

    /** Geometry is measured only on resize — never inside the scroll path. */
    function measure() {
      const rect = track!.getBoundingClientRect();
      trackTop = rect.top + window.scrollY;
      usable = Math.max(1, track!.offsetHeight - window.innerHeight);

      width = stage!.clientWidth;
      height = stage!.clientHeight;
      options = optionsFor(width, height);

      const dpr = Math.min(options.quality.maxDpr, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function measureNeedle(index: number) {
      const item = items[index];
      const rule = item?.querySelector<HTMLElement>(
        "[data-cine-needle] > span:last-child",
      );
      if (!rule) {
        options.needleAnchorPx = null;
        return;
      }
      const stageRect = stage!.getBoundingClientRect();
      const ruleRect = rule.getBoundingClientRect();
      if (ruleRect.width === 0) {
        options.needleAnchorPx = null;
        return;
      }
      options.needleAnchorPx = {
        x: ruleRect.right - stageRect.left,
        y: ruleRect.top + ruleRect.height / 2 - stageRect.top,
      };
    }

    function paint() {
      frame = 0;
      const p = Math.min(1, Math.max(0, (window.scrollY - trackTop) / usable));

      try {
        render(ctx!, width, height, p, crowd, options);
      } catch {
        document.documentElement.classList.remove("cine");
        return;
      }

      const index = stateIndexAt(p);
      if (index !== lastIndex) {
        lastIndex = index;
        stage!.dataset.cineScene = String(index);
        // Keep hidden calls-to-action out of the tab order.
        items.forEach((item, i) => {
          if (i === index) item.removeAttribute("inert");
          else item.setAttribute("inert", "");
        });
        // Measure where the active needle's hairline actually ends, so the
        // canvas leader continues the real label instead of an assumed point.
        // Once per state change, never inside the scroll path.
        measureNeedle(index);
        if (stepNumber) {
          stepNumber.textContent = NARRATIVE[index].step ?? "—";
        }
        ticks.forEach((tick, i) => {
          tick.classList.toggle("bg-signal", i <= index);
          tick.classList.toggle("bg-cloud/25", i > index);
        });
      }
    }

    function schedule() {
      if (frame || !visible) return;
      frame = requestAnimationFrame(paint);
    }

    function onResize() {
      measure();
      lastIndex = -1;
      paint();
    }

    measure();
    paint();

    // Stop rendering entirely once the stage leaves the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(stage);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      items.forEach((item) => item.removeAttribute("inert"));
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" data-cine-film />;
}
