"use client";

import { useEffect, useState } from "react";

type CursorState = { x: number; y: number; label: string };

export const CustomCursor = () => {
  const [cursor, setCursor] = useState<CursorState>({ x: 0, y: 0, label: "" });
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    return !prefersReducedMotion && finePointer;
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>("[data-cursor-label]");
      setCursor({
        x: event.clientX,
        y: event.clientY,
        label: interactive?.dataset.cursorLabel ?? "",
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[100] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/70 bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary mix-blend-multiply sm:block"
      style={{ left: cursor.x, top: cursor.y }}
    >
      {cursor.label || ""}
    </div>
  );
};
