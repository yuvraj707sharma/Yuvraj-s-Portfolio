"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export const SmoothScroll = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.12,
      smoothWheel: !prefersReducedMotion,
      syncTouch: true,
    });

    let rafId: number | null = null;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      lenis.destroy();
    };
  }, []);

  return null;
};
